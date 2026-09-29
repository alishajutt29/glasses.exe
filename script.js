/* glasses.exe — shared script. Sections: 1 Data · 2 Helpers · 3 State · 4 Layout · 5 Components · 6 Actions · 7 Pages · 8 Init */

/* ===== 1. DATA (edit products here) ===== */
const SZ=['S','M','L'];
const P=[
{id:1,n:'Crimson Oval',t:'Full-rim',p:8500,s:['S','M','L'],img:['images/a1.jpg','images/a2.jpg','images/a3.jpg','images/a4.jpg'],d:'Slim full-rim oval frame in gunmetal with crimson-lined temples and soft silicone nose pads. Lightweight metal build made for all-day wear.'},
{id:2,n:'Apex Rimless',t:'Rimless',p:11500,s:['M','L'],img:['images/b1.jpg','images/b2.jpg','images/b3.jpg','images/b4.jpg'],d:'Rimless rectangular frame with a brushed metal bridge and red-accented hinges and temple tips. Clean, light and sharp.'},
{id:3,n:'Slate Rimless',t:'Rimless',p:10500,s:['S','M','L'],img:['images/c1.jpg','images/c2.jpg','images/c3.jpg','images/c4.jpg'],d:'A softer rimless shape with gently rounded lens corners, a gunmetal bridge and a red inlay along the temples.'}
];

/* ===== 2. HELPERS ===== */
const $=s=>document.querySelector(s);
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const rs=n=>'Rs '+n.toLocaleString('en-PK');
const SUN='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>';
const MOON='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 13a9 9 0 1 1-10-10 7 7 0 0 0 10 10z"/></svg>';
function toast(m){const t=$('#toast');t.textContent=m;t.style.opacity=1;clearTimeout(t._h);t._h=setTimeout(()=>t.style.opacity=0,2200)}

/* ===== 3. STATE ===== */
const page=document.body.dataset.page;
let cart=ld('gx_cart',[]),user=ld('gx_user',null),fs=[],sheet=false,ps='',pq=1,tab='in';
const saveCart=()=>{sv('gx_cart',cart);upd()};

/* ===== 4. LAYOUT (header + footer on every page) ===== */
const NAV=[['Home','index.html','home'],['Shop','products.html','products'],['About','about.html','about'],['Contact','contact.html','contact']];
function renderLayout(){
  const links=NAV.map(([t,h,k])=>`<a href="${h}" class="nl ${page===k?'active':''}">${t}</a>`).join('');
  $('#site-header').outerHTML=`<header class="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-neutral-300 dark:border-neutral-800" style="top:env(safe-area-inset-top,0px)">
  <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
    <a href="index.html" class="dsp text-3xl font-black tracking-tight">glasses<span class="text-rose-600">.exe</span></a>
    <nav class="hidden md:flex gap-7">${links}</nav>
    <div class="flex items-center gap-3">
      <a href="login.html" id="acct" class="nl hidden sm:block">Login</a>
      <a href="cart.html" class="nl">Cart <span id="cnt" class="inline-block bg-rose-600 text-white text-xs px-1.5 py-0.5 ml-1">0</span></a>
      <button onclick="toggleTheme()" id="tt" class="w-10 h-10 grid place-items-center border border-current/30 hover:text-rose-600" aria-label="Toggle light or dark mode"></button>
      <button onclick="$('#mm').classList.toggle('hidden')" class="md:hidden border border-current/40 w-10 h-10" aria-label="Menu">☰</button>
    </div>
  </div>
  <nav id="mm" class="hidden md:hidden border-t border-neutral-300 dark:border-neutral-800 px-4 py-3 flex flex-col gap-3">${links}<a href="login.html" class="nl" id="acct2">Login / Sign Up</a></nav>
</header>`;
  $('#site-footer').outerHTML=`<footer class="surf mt-16 border-t border-neutral-300 dark:border-neutral-800">
  <div class="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    <div><div class="dsp text-3xl font-black">glasses<span class="text-rose-600">.exe</span></div><p class="mt-3 text-sm opacity-70">Bold frames for sharp people. Limited drops, precision fit.</p></div>
    <div><h4 class="font-black mb-3">Quick links</h4><ul class="space-y-2 text-sm opacity-80"><li><a href="index.html" class="hover:text-rose-600">Home</a></li><li><a href="products.html" class="hover:text-rose-600">Shop</a></li><li><a href="cart.html" class="hover:text-rose-600">Cart</a></li><li><a href="login.html" class="hover:text-rose-600">Login / Sign Up</a></li></ul></div>
    <div><h4 class="font-black mb-3">Company</h4><ul class="space-y-2 text-sm opacity-80"><li><a href="about.html" class="hover:text-rose-600">About</a></li><li><a href="contact.html" class="hover:text-rose-600">Contact</a></li></ul></div>
    <div><h4 class="font-black mb-3">Legal</h4><ul class="space-y-2 text-sm opacity-80"><li><a href="privacy.html" class="hover:text-rose-600">Privacy Policy</a></li><li><a href="terms.html" class="hover:text-rose-600">Terms &amp; Services</a></li><li><a href="refund.html" class="hover:text-rose-600">Refund Policy</a></li></ul></div>
  </div>
  <div class="border-t border-neutral-300 dark:border-neutral-800 text-center text-xs py-4 opacity-70">© ${new Date().getFullYear()} glasses.exe. All rights reserved.</div>
</footer>`;
  $('#acct').onclick=$('#acct2').onclick=e=>{if(user){e.preventDefault();logout()}};
  $('#tt').innerHTML=document.documentElement.classList.contains('dark')?SUN:MOON;
}
function toggleTheme(){const d=document.documentElement.classList.toggle('dark');sv('gx_theme',d?'dark':'light');$('#tt').innerHTML=d?SUN:MOON}
function upd(){
  $('#cnt').textContent=cart.reduce((a,i)=>a+i.q,0);
  const l=user?'Hi, '+user.name.split(' ')[0]:'Login';
  $('#acct').textContent=l;$('#acct2').textContent=user?l+' (Logout)':'Login / Sign Up';
}
function logout(){user=null;sv('gx_user',null);upd();toast('Logged out');if(page==='cart'||page==='login')R()}

/* ===== 5. COMPONENTS ===== */
const pic=(p,i,c)=>`<img src="${p.img[i]}" alt="${p.n}, view ${i+1}" loading="lazy" class="${c}">`;
const card=p=>`<article class="group"><a href="product.html?id=${p.id}" class="relative block aspect-[4/3] overflow-hidden bg-black">${pic(p,0,'absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:opacity-0')}${pic(p,1,'absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition duration-500 group-hover:opacity-100 group-hover:scale-100')}</a><div class="pt-4 flex items-start justify-between gap-3"><div><h3 class="font-bold text-sm sm:text-base leading-tight">${p.n}</h3><div class="text-xs opacity-60 mt-1">${p.t}</div></div><div class="font-bold text-sm sm:text-base whitespace-nowrap">${rs(p.p)}</div></div><div class="grid grid-cols-2 gap-2 mt-3"><a href="product.html?id=${p.id}" class="btn2 btn-sm">View</a><button onclick="quickAdd(${p.id})" class="btn btn-sm">Add</button></div></article>`;

/* ===== 6. ACTIONS ===== */
function addItem(id,s,q){const f=cart.find(i=>i.id===id&&i.s===s);f?f.q+=q:cart.push({id,s,q});saveCart();toast('Added to bag')}
function quickAdd(id){const p=P.find(x=>x.id===id);addItem(id,p.s.includes('M')?'M':p.s[0],1)}
function atb(id){if(!ps)return toast('Choose a frame size first');addItem(id,ps,pq);pq=1}
function cq(x,d){cart[x].q+=d;if(cart[x].q<1)cart.splice(x,1);saveCart();R()}
function rm(x){cart.splice(x,1);saveCart();R()}
function tf(s){fs=fs.includes(s)?fs.filter(x=>x!==s):[...fs,s];R()}
function checkout(){
  if(!user){toast('Login to place your order');setTimeout(()=>location.href='login.html',700);return}
  cart=[];saveCart();
  $('#app').innerHTML=`<section class="max-w-2xl mx-auto px-4 py-20 text-center"><div class="h-1 w-16 bg-rose-600 mx-auto"></div><h1 class="text-5xl font-black uppercase mt-4">Order placed</h1><p class="mt-3 opacity-80">Thanks ${user.name.split(' ')[0]}, your order is confirmed. Check your email for tracking details.</p><a href="products.html" class="btn mt-6">Keep shopping</a></section>`;
}
function auth(e){
  e.preventDefault();const f=new FormData(e.target),em=f.get('email');let us=ld('gx_users',[]);
  if(tab==='up'){if(us.some(u=>u.email===em))return toast('Email already registered. Log in instead.');us.push({name:f.get('name'),email:em,pw:f.get('pw')});sv('gx_users',us);user={name:f.get('name'),email:em}}
  else{const u=us.find(u=>u.email===em&&u.pw===f.get('pw'));if(!u)return toast('Wrong email or password');user={name:u.name,email:em}}
  sv('gx_user',user);upd();toast('Welcome, '+user.name.split(' ')[0]);
  setTimeout(()=>location.href=cart.length?'cart.html':'index.html',600);
}

/* ===== 7. PAGES (dynamic parts; static text lives in each .html file) ===== */
const pages={
home:()=>`<section class="max-w-7xl mx-auto px-4 pt-20"><div class="flex items-end justify-between mb-8"><h2 class="text-5xl sm:text-6xl font-black uppercase leading-none">The drop</h2><a href="products.html" class="nl">See all</a></div><div class="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12">${P.map(card).join('')}</div></section>`,

products:()=>{
  const l=P.filter(p=>!fs.length||fs.some(s=>p.s.includes(s)||p.t===s));
  const F=`<h3 class="font-black uppercase mb-3">Filter frames</h3><div class="flex flex-wrap gap-2">${SZ.concat(['Full-rim','Rimless']).map(s=>`<button class="chip ${fs.includes(s)?'on':''}" onclick="tf('${s}')">${s}</button>`).join('')}</div><button class="mt-4 underline text-sm" onclick="fs=[];R()">Clear filters</button>`;
  return `<section class="max-w-7xl mx-auto px-4 pt-10"><div class="flex items-center justify-between mb-6"><h1 class="text-5xl font-black uppercase">Catalog</h1><button class="btn2 lg:hidden !py-2" onclick="sheet=true;R()">Filters${fs.length?' ('+fs.length+')':''}</button></div>
  <div class="lg:grid lg:grid-cols-[14rem_1fr] gap-8"><aside class="hidden lg:block surf p-5 h-fit sticky top-24">${F}</aside><div><p class="text-sm opacity-70 mb-3">${l.length} items</p>${l.length?`<div class="grid grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-5">${l.map(card).join('')}</div>`:'<p class="surf p-8 text-center">No frames match. Clear the filters to see everything.</p>'}</div></div></section>
  <div class="fixed inset-0 z-50 lg:hidden ${sheet?'':'hidden'}"><div class="absolute inset-0 bg-black/70" onclick="sheet=false;R()"></div><div class="absolute bottom-0 inset-x-0 surf p-6 border-t-2 border-rose-600 rounded-t-2xl"><div class="flex justify-between mb-4"><b class="text-xl">FILTERS</b><button onclick="sheet=false;R()" aria-label="Close">✕</button></div>${F}<button class="btn w-full mt-6" onclick="sheet=false;R()">Show ${l.length} items</button></div></div>`},

product:()=>{
  const p=P.find(x=>x.id==new URLSearchParams(location.search).get('id'));
  if(!p)return `<section class="max-w-3xl mx-auto px-4 py-20 text-center"><h1 class="text-6xl font-black uppercase">Not found</h1><p class="mt-3">That product does not exist.</p><a href="products.html" class="btn mt-6">Back to shop</a></section>`;
  if(!p.s.includes(ps))ps='';
  return `<section class="max-w-7xl mx-auto px-4 pt-8"><a href="products.html" class="nl">← Back to shop</a><div class="grid lg:grid-cols-[1.4fr_1fr] gap-8 mt-6">
  <div class="grid gap-3 sm:grid-cols-2">${[0,1,2,3].map(i=>`<div class="surf overflow-hidden ${i==0?'sm:col-span-2':''}">${pic(p,i,'w-full h-full object-cover '+(i==0?'aspect-[16/9]':'aspect-[4/3]'))}</div>`).join('')}</div>
  <div class="lg:sticky lg:top-24 h-fit"><h1 class="text-5xl sm:text-6xl font-black uppercase leading-none">${p.n}</h1><div class="text-2xl font-bold text-rose-600 mt-3">${rs(p.p)}</div><p class="mt-4 opacity-80 leading-relaxed">${p.d}</p>
  <h3 class="font-black uppercase mt-6 mb-2">Frame size (S 48mm · M 52mm · L 55mm)</h3><div class="flex flex-wrap gap-2">${SZ.map(s=>p.s.includes(s)?`<button class="chip ${ps===s?'on':''}" onclick="ps='${s}';R()">${s}</button>`:`<button class="chip opacity-30 line-through cursor-not-allowed" disabled>${s}</button>`).join('')}</div>
  <h3 class="font-black uppercase mt-6 mb-2">Quantity</h3><div class="inline-flex items-center border-2 border-neutral-400 dark:border-neutral-600"><button class="w-11 h-11 font-black" onclick="pq=Math.max(1,pq-1);R()">−</button><span class="w-12 text-center font-bold">${pq}</span><button class="w-11 h-11 font-black" onclick="pq++;R()">+</button></div>
  <button class="btn w-full mt-6 !py-4 text-lg" onclick="atb(${p.id})">Add to bag</button><p class="text-xs opacity-60 mt-3">Free delivery over Rs 15,000 · 7-day returns</p></div></div></section>`},

cart:()=>{
  const rows=cart.map((i,x)=>({...i,x,p:P.find(p=>p.id===i.id)}));
  const sub=rows.reduce((a,r)=>a+r.p.p*r.q,0),ship=sub>=15000?0:300;
  if(!rows.length)return `<section class="max-w-3xl mx-auto px-4 py-20 text-center"><h1 class="text-5xl font-black uppercase">Your bag is empty</h1><p class="mt-3 opacity-70">Pick a pair of frames and they will show up here.</p><a href="products.html" class="btn mt-6">Browse the shop</a></section>`;
  return `<section class="max-w-7xl mx-auto px-4 pt-10"><h1 class="text-5xl font-black uppercase mb-6">Your bag</h1><div class="grid lg:grid-cols-3 gap-8"><div class="lg:col-span-2 space-y-3">
  <div class="hidden sm:grid grid-cols-[5rem_1fr_8rem_7rem_2rem] gap-4 text-xs uppercase tracking-widest opacity-60 px-4"><span></span><span>Product</span><span>Quantity</span><span>Price</span><span></span></div>
  ${rows.map(r=>`<div class="surf p-4 grid grid-cols-[5rem_1fr] sm:grid-cols-[5rem_1fr_8rem_7rem_2rem] gap-4 items-center">${pic(r.p,0,'w-20 h-20 object-cover')}<div><a href="product.html?id=${r.p.id}" class="font-black uppercase">${r.p.n}</a><div class="text-sm opacity-70">Size ${r.s} · ${rs(r.p.p)}</div></div>
  <div class="inline-flex items-center border-2 border-neutral-400 dark:border-neutral-600 w-fit col-start-2 sm:col-start-auto"><button class="w-9 h-9 font-black" onclick="cq(${r.x},-1)">−</button><span class="w-9 text-center font-bold">${r.q}</span><button class="w-9 h-9 font-black" onclick="cq(${r.x},1)">+</button></div>
  <div class="font-bold col-start-2 sm:col-start-auto">${rs(r.p.p*r.q)}</div><button class="text-rose-600 font-black justify-self-end col-start-2 sm:col-start-auto" onclick="rm(${r.x})" aria-label="Remove">✕ <span class="sm:hidden text-sm">Remove</span></button></div>`).join('')}</div>
  <aside class="surf p-6 h-fit lg:sticky lg:top-24"><h2 class="font-black uppercase text-2xl mb-4">Order summary</h2><div class="flex justify-between py-2"><span>Subtotal</span><b>${rs(sub)}</b></div><div class="flex justify-between py-2"><span>Delivery</span><b>${ship?rs(ship):'Free'}</b></div><div class="flex justify-between py-3 mt-2 border-t border-neutral-400 dark:border-neutral-700 text-xl font-black"><span>Total</span><span>${rs(sub+ship)}</span></div><button class="btn w-full mt-4 !py-4" onclick="checkout()">Checkout</button>${user?'':'<p class="text-xs opacity-60 mt-3">You will be asked to log in before ordering.</p>'}</aside></div></section>`},

login:()=>`<section class="max-w-md mx-auto px-4 py-14"><div class="grid grid-cols-2 mb-6"><button class="chip ${tab=='in'?'on':''}" onclick="tab='in';R()">Login</button><button class="chip ${tab=='up'?'on':''}" onclick="tab='up';R()">Sign up</button></div><h1 class="text-5xl font-black uppercase mb-6">${tab=='in'?'Welcome back':'Create account'}</h1><form onsubmit="auth(event)" class="space-y-4">${tab=='up'?'<input class="inp" name="name" required placeholder="Full name">':''}<input class="inp" name="email" type="email" required placeholder="Email address"><input class="inp" name="pw" type="password" minlength="6" required placeholder="Password (6+ characters)"><button class="btn w-full">${tab=='in'?'Login':'Sign up'}</button></form><p class="text-xs opacity-60 mt-4">Demo store: accounts are saved only in this browser.</p></section>`
};
function R(){if(pages[page]&&$('#app'))$('#app').innerHTML=pages[page]()}

/* ===== 8. INIT ===== */
renderLayout();upd();R();
