const inviteBudget=100;
const inviteToken=/^[A-Za-z0-9_-]{43}$/;
const digestInvite=async token=>b64(new Uint8Array(await hash(token)));

function inviteStore(db,master){
  if(!db)return null;
  const owned=id=>db.prepare('SELECT payload FROM pip_invites WHERE vault_id = ?').bind(id).first();
  const disable=id=>db.prepare('DELETE FROM pip_invites WHERE vault_id = ?').bind(id).run();
  return {
    owned,disable,
    async guest(token){
      if(!inviteToken.test(token||''))return null;
      const digest=await digestInvite(token);
      const row=await db.prepare('SELECT vault_id, payload FROM pip_invites WHERE token_hash = ?').bind(digest).first();
      return row?{...row,digest}:null;
    },
    async enable(id,settings){
      const existing=await owned(id);
      if(existing){
        const share=await open(master,'pip invite '+id,existing.payload);
        if(share?.token)return share.token;
      }
      const token=b64(random(32));
      const payload=await seal(master,'pip invite '+id,{token,settings});
      await db.prepare('INSERT INTO pip_invites (vault_id, token_hash, payload) VALUES (?, ?, ?) ON CONFLICT(vault_id) DO NOTHING')
        .bind(id,await digestInvite(token),payload).run();
      const row=await owned(id);
      const current=await open(master,'pip invite '+id,row?.payload);
      if(!current?.token)throw error(503,'The invite link could not be created. Try again.');
      return current.token;
    },
    async use(row){
      const share=await open(master,'pip invite '+row.vault_id,row.payload);
      if(!share?.settings?.key)throw error(403,'This Ask It link is no longer active.','invite_inactive');
      const day=Math.floor(Date.now()/86400000);
      const usage=await db.prepare('UPDATE pip_invites SET requests = CASE WHEN budget_day = ? THEN requests + 1 ELSE 1 END, budget_day = ? WHERE token_hash = ? AND (budget_day <> ? OR requests < ?) RETURNING requests')
        .bind(day,day,row.digest,day,inviteBudget).first();
      if(!usage){
        const active=await db.prepare('SELECT 1 FROM pip_invites WHERE token_hash = ?').bind(row.digest).first();
        if(!active)throw error(403,'This Ask It link is no longer active.','invite_inactive');
        throw error(429,'This Ask It link has reached its daily request limit. Try again tomorrow.');
      }
      return share.settings;
    }
  };
}
