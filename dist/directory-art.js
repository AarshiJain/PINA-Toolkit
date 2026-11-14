/* Small editorial scenes for the tool directory. The shapes follow each tool's method. */
const DIRECTORY_SCENES = [
  ['#e0e9eb','#a9c1ca',`
    <path class="art-paper" d="M21 17h65v31H44L31 59V48H21z"/>
    <path class="art-color" d="M66 50h70v33h-9v12l-14-12H66z"/>
    <path d="M32 28h40m-40 9h27m47 24h17m-45 10h45"/>
    <circle class="art-ink" cx="79" cy="62" r="2"/><circle class="art-ink" cx="88" cy="62" r="2"/><circle class="art-ink" cx="97" cy="62" r="2"/>`],
  ['#ddecea','#92c0b7',`
    <path class="art-color" d="M26 45h104l-2 43H31z"/>
    <path class="art-paper" d="m51 45 28-32 27 32z"/>
    <path class="art-white" d="m51 45 8 18 22 26 20-22 5-22z"/>
    <path d="m79 13 3 32-1 44m1-44 19 22M26 45h104M35 62h13m64 11h12"/>`],
  ['#ede6d8','#cfad7f',`
    <g transform="rotate(-12 62 52)"><rect class="art-color" x="26" y="24" width="67" height="54" rx="3"/><path class="art-white" d="M36 34h47v34H36z"/><circle class="art-color" cx="52" cy="46" r="6"/></g>
    <g transform="rotate(12 96 63)"><rect class="art-paper" x="64" y="34" width="68" height="56" rx="3"/><path d="M73 43h50v38H73zM74 72l14-13 10 8 11-13 14 14"/></g>`],
  ['#f1f7fa','#92c0b7',`
    <path class="art-white" d="M46 87 65 15h9L55 87zm52 0 19-72h9l-19 72z"/>
    <path class="art-color" d="M61 28h61l-2 7H59zm-4 16h61l-2 7H55zm-4 16h61l-2 7H51zm-4 16h61l-2 7H47z"/>
    <path class="art-paper" d="M67 15h5L53 87h-5zm51 0h6l-19 72h-5z"/>`],
  ['#eee4db','#cf9d83',`
    <ellipse class="art-paper" cx="75" cy="66" rx="32" ry="19" transform="rotate(-14 75 66)"/>
    <ellipse class="art-color" cx="70" cy="58" rx="31" ry="18" transform="rotate(-14 70 58)"/>
    <ellipse class="art-paper" cx="65" cy="49" rx="30" ry="17" transform="rotate(-14 65 49)"/>
    <path class="art-color" d="M95 50c22-3 33-14 36-22 9 4 7 12-2 19l-25 15z"/>
    <path d="M43 51c15-8 30-9 46-6M43 60c15-8 30-9 46-6M56 73c17-8 30-9 42-7m4-1c29 3 26 23 4 22-10 0-15-7-27-6-14 1-15 9-28 8"/>`],
  ['#e4e9ef','#a9b9cd',`
    <path class="art-paper" d="M31 22h67v55H31z"/><path d="M42 35h42m-42 11h33m-33 11h35m-35 11h22"/>
    <path class="art-color" d="M83 53h47v28h-12l-12 10v-10H83z"/>
    <path d="m93 66 6 6 12-13m-86-29-5 9 8 3m88-4c-2-11-9-16-19-19m14 19 6 2 3-7"/>`],
  ['#eee9d9','#ceb881',`
    <path class="art-paper" d="M76 79h16v7H59v-7zM75 29h9v50h-9z"/>
    <path d="m40 40 78-11M44 40 29 61h30zm72-9-15 24h30z"/>
    <path class="art-color" d="M28 61h32q-2 11-16 11T28 61zm72-6h32q-2 11-16 11t-16-11z"/>
    <circle class="art-color" cx="79" cy="34" r="5"/><path d="M22 80h22m71-53 12-12m1 12h9m-10-12v-7"/>`],
  ['#deebe1','#a7c4ae',`
    <rect class="art-paper" x="34" y="15" width="91" height="73" rx="4"/>
    <path d="M79.5 15v73M34 51.5h91M28 75V23m-4 4 4-4 4 4m15 72h70m-4-4 4 4-4 4"/>
    <circle class="art-color" cx="56" cy="36" r="7"/><circle class="art-color" cx="102" cy="32" r="7"/>
    <circle class="art-color" cx="110" cy="68" r="7"/><circle class="art-color" cx="58" cy="70" r="4"/>
    <circle class="art-paper" cx="104" cy="32" r="13"/><path d="M99 32l4 4 7-8"/>`],
  ['#e8e5ee','#b7aed0',`
    <path class="art-paper" d="M25 27h108v55H25z"/><path d="M35 72h90"/>
    <rect class="art-color" x="41" y="44" width="7" height="22" rx="3"/><rect class="art-color" x="60" y="38" width="7" height="28" rx="3"/>
    <rect class="art-color" x="78" y="43" width="7" height="23" rx="3"/><rect class="art-color" x="97" y="34" width="7" height="32" rx="3"/>
    <rect class="art-color" x="115" y="44" width="7" height="22" rx="3"/>
    <path d="M37 51h15m4 8h15m3-11h15m4 2h15m3 10h15M31 27l8-9h86l8 9"/>`],
  ['#ede5db','#cda783',`
    <ellipse class="art-color" cx="79" cy="61" rx="49" ry="24"/>
    <path class="art-paper" d="m43 41 23 1 5 18-25 1zm50 2 21-2-3 20-24-1z"/>
    <path d="M48 47h12m-11 5h13m35-4h11m-13 5h12m-42 16h28"/>
    <path class="art-paper" d="M62 33c-7-14 8-19 18-10l-1 8-6 4v-6h-6zm35 44 12-1-1 10-7 5v-7l-6-3z"/>`],
  ['#e4ebe5','#99b7a4',`
    <path class="art-paper" d="M80 17 36 80h88z"/><path d="M80 17v42m0 0L36 80m44-21 44 21"/>
    <circle class="art-color" cx="80" cy="17" r="11"/><circle class="art-color" cx="36" cy="80" r="11"/>
    <circle class="art-color" cx="124" cy="80" r="11"/><circle class="art-paper" cx="80" cy="59" r="8"/>
    <path d="m77 59 2 2 5-5"/>`],
  ['#eee2df','#cc9e97',`
    <g transform="rotate(-14 62 54)"><rect class="art-color" x="35" y="22" width="58" height="64" rx="5"/><path d="m43 70 37-39M46 78l38-39"/></g>
    <g transform="rotate(12 97 56)"><rect class="art-paper" x="67" y="22" width="57" height="66" rx="5"/><path class="art-color" d="m95 35 15 26H80z"/><path d="M95 43v8m0 4v1M79 72h33m-28 7h23"/></g>`],
  ['#e4e9ef','#a5b9cf',`
    <path class="art-paper" d="M28 82h103v8H28z"/><path d="M31 71c24-1 29-43 61-43 12 0 18 9 30 9m-8-7 8 7-9 5"/>
    <circle class="art-color" cx="37" cy="69" r="4"/><circle class="art-color" cx="53" cy="56" r="4"/>
    <circle class="art-color" cx="69" cy="36" r="4"/><circle class="art-color" cx="86" cy="28" r="4"/>
    <path class="art-color" d="M127 19v34m0-33 16 5-16 7"/>`],
  ['#e7ede2','#a3b69c',`
    <rect class="art-paper" x="29" y="23" width="102" height="62" rx="8"/>
    <path d="M55 35v37m25-37v37m25-37v37"/>
    <rect class="art-color" x="45" y="48" width="20" height="10" rx="4"/>
    <rect class="art-color" x="70" y="37" width="20" height="10" rx="4"/>
    <rect class="art-color" x="95" y="61" width="20" height="10" rx="4"/>`],
  ['#efe8db','#c4a177',`
    <path class="art-paper" d="M23 36h39v23H41l-10 10V59h-8z"/>
    <path class="art-color" d="M99 31h39v27h-9v10l-10-10H99z"/>
    <circle class="art-paper" cx="80" cy="52" r="15"/>
    <path class="art-paper" d="M52 83a28 20 0 0 1 56 0z"/>
    <path d="M33 46h18m58-4h19m-19 8h13m-46 5q4 5 8 0"/>`]
];

function directoryArt(id){
  const [ground,accent,scene]=DIRECTORY_SCENES[id];
  return `<svg class="tool-illustration" viewBox="0 0 160 108" aria-hidden="true" focusable="false" style="--art-accent:${accent}">
    <rect x="2" y="2" width="156" height="104" rx="12" fill="${ground}"/>
    <g fill="none" stroke="#26352e" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${scene}</g></svg>`;
}
