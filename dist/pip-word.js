/* A Word file is a ZIP. Read only its bounded document.xml entry. */
async function pipWordText(file){
  const buffer=await file.arrayBuffer(),view=new DataView(buffer),bytes=new Uint8Array(buffer),length=buffer.byteLength;
  const invalid=()=>Error('This Word document could not be read. Try exporting it as PDF or plain text.');
  let end=length-22;
  while(end>=Math.max(0,length-65557)&&view.getUint32(end,true)!==0x06054b50)end--;
  if(end<0||view.getUint32(end,true)!==0x06054b50)throw invalid();
  const count=view.getUint16(end+10,true);
  let at=view.getUint32(end+16,true);
  for(let i=0;i<count&&at+46<=end;i++){
    if(view.getUint32(at,true)!==0x02014b50)throw invalid();
    const nameLength=view.getUint16(at+28,true);
    const name=new TextDecoder().decode(bytes.subarray(at+46,at+46+nameLength));
    if(name==='word/document.xml'){
      const size=view.getUint32(at+20,true),expanded=view.getUint32(at+24,true),offset=view.getUint32(at+42,true);
      if(expanded>1000000||offset+30>length||view.getUint32(offset,true)!==0x04034b50)throw invalid();
      const start=offset+30+view.getUint16(offset+26,true)+view.getUint16(offset+28,true),method=view.getUint16(at+10,true);
      if(start+size>length||![0,8].includes(method))throw invalid();
      const raw=bytes.subarray(start,start+size);
      let xml='';
      if(method===0){if(raw.length>1000000)throw invalid();xml=new TextDecoder().decode(raw);}
      else{
        const reader=new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
        const decoder=new TextDecoder();let read=0;
        for(;;){
          const {value,done}=await reader.read();if(done)break;
          read+=value.length;if(read>1000000){await reader.cancel();throw invalid();}
          xml+=decoder.decode(value,{stream:true});
        }
        xml+=decoder.decode();
      }
      const doc=new DOMParser().parseFromString(xml,'application/xml');
      if(doc.querySelector('parsererror'))throw invalid();
      return [...doc.getElementsByTagNameNS('*','p')].map(p=>[...p.getElementsByTagNameNS('*','t')].map(n=>n.textContent).join('')).filter(Boolean).join('\n');
    }
    at+=46+nameLength+view.getUint16(at+30,true)+view.getUint16(at+32,true);
  }
  throw invalid();
}
