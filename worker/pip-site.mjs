/* Public chat uses a server-held connection. Only an authenticated settings vault can replace it. */
function siteConnectionStore(db,master,ids){
  const allowed=String(ids||'').split(',').map(x=>x.trim()).filter(Boolean);
  if(!db||!allowed.length)return null;
  const id='pina_site_connection';
  const row=key=>db.prepare('SELECT vault_id, token_hash, payload FROM pip_invites WHERE vault_id = ?').bind(key).first();
  return {
    allowed,
    async read(){
      const current=await row(id);
      if(current){
        const data=await open(master,'pip site connection',current.payload);
        if(!data)throw error(503,'Pip’s saved connection could not be read. Open the settings lock to check it.');
        return {...data,budgetId:id};
      }
      for(const key of allowed){
        const legacy=await row(key);
        const share=legacy&&await open(master,'pip invite '+key,legacy.payload);
        if(share?.settings?.key)return {settings:share.settings,adminVault:null,budgetId:key};
      }
      return {settings:{},adminVault:null,budgetId:null};
    },
    async save(settings,adminVault){
      const payload=await seal(master,'pip site connection',{settings,adminVault});
      await db.prepare('INSERT INTO pip_invites (vault_id, token_hash, payload) VALUES (?, ?, ?) ON CONFLICT(vault_id) DO UPDATE SET payload = excluded.payload')
        .bind(id,'pina-site-connection-v1',payload).run();
    },
    async use(record){
      if(!record?.settings?.key)throw error(503,'Pip needs a provider connection. The owner can connect it using the settings lock.','connection_missing');
      const day=Math.floor(Date.now()/86400000);
      const usage=await db.prepare('UPDATE pip_invites SET requests = CASE WHEN budget_day = ? THEN requests + 1 ELSE 1 END, budget_day = ? WHERE vault_id = ? AND (budget_day <> ? OR requests < ?) RETURNING requests')
        .bind(day,day,record.budgetId,day,inviteBudget).first();
      if(!usage)throw error(429,'Pip has reached this website’s daily AI allowance. Please try again tomorrow.');
      return record.settings;
    }
  };
}
