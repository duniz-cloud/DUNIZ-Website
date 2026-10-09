// Vercel Serverless Function. Requires RESEND_API_KEY and DUNIZ_FROM_EMAIL.
// Configured inbox: DUNIZ_INQUIRY_TO, default anupam@duniz.com.
const escapeHtml = (text) => String(text ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if(req.method !== 'POST') {res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed'});}
  const key=process.env.RESEND_API_KEY;
  const from=process.env.DUNIZ_FROM_EMAIL;
  if(!key || !from) return res.status(503).json({error:'Enquiries are not configured yet. Please use email.'});
  let body = req.body;
  if(typeof body === 'string') { try{body=JSON.parse(body)}catch{return res.status(400).json({error:'Invalid request'})} }
  if(!body || typeof body !== 'object') return res.status(400).json({error:'Invalid request'});
  if(body.website) return res.status(200).json({ok:true});
  const name=String(body.name||'').trim(), email=String(body.email||'').trim(), company=String(body.company||'').trim(),focus=String(body.focus||'').trim(),message=String(body.message||'').trim();
  if(!name||name.length>120||!email||email.length>150||!/^\S+@\S+\.\S+$/.test(email)||!focus||focus.length>140||!message||message.length>2500||company.length>140||!body.consent)return res.status(400).json({error:'Please complete all required fields correctly.'});
  // Do not blindly trust request headers for redirect destinations or outbound mail.
  const html=`<h2>New DUNIZ Business Enquiry</h2><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Organization:</b> ${escapeHtml(company)}</p><p><b>Focus:</b> ${escapeHtml(focus)}</p><p><b>Message:</b><br>${escapeHtml(message).replace(/\n/g,'<br>')}</p>`;
  try {
    const response=await fetch('https://api.resend.com/emails', {method:'POST',headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[process.env.DUNIZ_INQUIRY_TO||'anupam@duniz.com'],reply_to:email,subject:`DUNIZ enquiry: ${focus.slice(0,100)}`,html})});
    if(!response.ok){console.error('Resend request failed',response.status);return res.status(502).json({error:'Unable to send enquiry right now.'});}
    return res.status(200).json({ok:true});
  }catch(error){console.error('Email delivery error',error?.message);return res.status(502).json({error:'Unable to send enquiry right now.'});}
};
