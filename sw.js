const CACHE='firefly-camp-v4';
const FILES=['./','index.html','three.min.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','supabase.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
// 게임 화면(index.html)은 항상 최신 버전을 먼저 받아오고, 인터넷이 없을 때만 저장된 것을 써요.
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return;
  const isPage=req.mode==='navigate'||req.url.endsWith('.html')||req.url.endsWith('/');
  if(isPage){e.respondWith(fetch(req.url,{cache:'no-store'}).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));return res}).catch(()=>caches.match(req).then(r=>r||caches.match('index.html'))));return}
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return res})))});
