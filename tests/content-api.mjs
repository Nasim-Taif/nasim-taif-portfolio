import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.TEST_URL||'http://127.0.0.1:5173';
assert.match(base,/^http:\/\/(127\.0\.0\.1|localhost):\d+$/,'Run only against the disposable local preview.');
const request=(path,options={})=>fetch(base+path,options);
assert.equal((await request('/api/content')).status,403,'anonymous content read blocked');
assert.equal((await request('/api/content',{method:'PUT',headers:{Origin:base,'Content-Type':'application/json'},body:'{}'})).status,403,'anonymous content write blocked');
const signin=await request('/signin-with-chatgpt?return_to=/admin',{redirect:'manual'});
const cookie=signin.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
assert.ok(cookie,'development login cookie');
const headers={Cookie:cookie,Origin:base,'Content-Type':'application/json'};
let state=await (await request('/api/content',{headers:{Cookie:cookie}})).json();
const baseline=structuredClone(state.published);let revision=state.revision;
const save=(content,rev,method='PUT',extra={})=>request('/api/content',{method,headers:{...headers,...extra},body:JSON.stringify({content,revision:rev})});
try{
 assert.equal((await save(baseline,revision,'PUT',{Origin:'https://elsewhere.example'})).status,403,'cross-origin write rejected');
 const invalid=structuredClone(baseline);invalid.socials[0].url='javascript:alert(1)';
 assert.equal((await save(invalid,revision)).status,400,'unsafe link rejected');
 const draft=structuredClone(baseline);draft.profile.headline='Local draft persistence check';
 let r=await save(draft,revision);assert.equal(r.status,200);revision=(await r.json()).revision;
 state=await (await request('/api/content',{headers:{Cookie:cookie}})).json();
 assert.equal(state.draft.profile.headline,draft.profile.headline,'draft persisted');
 assert.deepEqual(state.published,baseline,'draft does not change published document');
 assert.equal((await save(draft,revision-1)).status,409,'stale revision rejected');
 r=await save(draft,revision,'POST');assert.equal(r.status,200);revision=(await r.json()).revision;
 const html=await (await request('/')).text();assert.ok(html.includes(draft.profile.headline),'published change rendered');
 const form=new FormData();form.append('file',new Blob([await fs.readFile('public/images/nishchinto.jpg')],{type:'image/jpeg'}),'cover.jpg');
 r=await request('/api/upload',{method:'POST',headers:{Cookie:cookie,Origin:base},body:form});assert.equal(r.status,200,'image uploaded');
 const uploaded=await r.json();r=await request(uploaded.url);assert.equal(r.status,200);assert.match(r.headers.get('content-type'),/^image\//,'stored image served');
 const unsafe=new FormData();unsafe.append('file',new Blob(['<script>alert(1)</script>'],{type:'image/jpeg'}),'bad.jpg');
 assert.equal((await request('/api/upload',{method:'POST',headers:{Cookie:cookie,Origin:base},body:unsafe})).status,400,'non-image rejected');
 assert.equal((await request('/work/missing-project')).status,404,'unknown project returns 404');
 console.log('PASS: access protection, origin checks, content validation, durable drafts, publish, stale-edit protection, image upload and retrieval, invalid-file rejection, and missing-project handling.');
}finally{
 const latest=await (await request('/api/content',{headers:{Cookie:cookie}})).json();
 const restore=await save(baseline,latest.revision,'POST');assert.equal(restore.status,200,'restored baseline');
}
