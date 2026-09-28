'use strict';
const site=document.body.dataset.site,base='https://console.richrowmusic.com',content=document.querySelector('#content');
document.querySelector('#year').textContent=new Date().getFullYear();
const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
const safe=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}};
function link(url,label){const a=node('a',label,'action');a.href=safe(url)||base;a.rel='noopener noreferrer';a.target='_blank';return a;}
function block(b){const box=node('div',null,'block');if(b.title)box.append(node('h3',b.title));if(b.body)box.append(node('p',b.body));
 if(['button','distribution','instagram','tiktok','facebook','x'].includes(b.type)&&safe(b.url))box.append(link(b.url,b.label||'Open '+b.type+' ↗'));
 if(['image','cover','release'].includes(b.type)&&safe(b.media?.url)){const img=node('img');img.src=b.media.url;img.alt=b.title||b.media.name||'Artist photo';img.loading='lazy';box.append(img);}
 if(b.type==='gallery'){const grid=node('div',null,'gallery');for(const m of b.media||[]){if(!safe(m.url))continue;const img=node('img');img.src=m.url;img.alt=m.name||'Artist photo';img.loading='lazy';grid.append(img);}box.append(grid);}
 if(['audio','video'].includes(b.type)&&safe(b.media?.url)){const m=node(b.type);m.src=b.media.url;m.controls=true;m.preload='none';if(b.type==='video')m.playsInline=true;box.append(m);}
 if(['youtube','vimeo'].includes(b.type)&&safe(b.url)&&['www.youtube-nocookie.com','player.vimeo.com'].includes(new URL(b.url).hostname)){const frame=node('iframe');frame.src=b.url;frame.title=b.title||'Official video';frame.loading='lazy';frame.allow='fullscreen; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';box.append(frame);}
 if(b.type==='release')box.append(node('p',b.artist),link(base+'/addons/store?product='+encodeURIComponent(b.productId),b.label||'View release'));
 if(b.type==='radio')box.append(link(base+'/addons/radio',b.label||'Listen to Highlife Radio'));
 if(b.type==='divider')box.append(node('hr'));if(b.type==='spacer')box.style.height=Math.min(160,Math.max(8,Number(b.height)||8))+'px';return box;}
async function load(){try{const r=await fetch(base+'/api/addon/page?slug='+encodeURIComponent(site),{credentials:'omit',cache:'no-store'});if(!r.ok)throw Error('unavailable');const p=await r.json();if(!Array.isArray(p.blocks))throw Error('invalid');const fragment=document.createDocumentFragment();let section,number=0;
 for(const [i,b] of p.blocks.filter(b=>!b.hidden).entries()){if(i===0&&b.type==='heading'){document.querySelector('h1').textContent=b.title||p.title;document.querySelector('#intro').textContent=b.body||'';continue;}
 if(b.type==='heading'){section=node('section');section.id=(b.title||'section-'+number).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const head=node('div',null,'section-head');head.append(node('small',String(++number).padStart(2,'0')),node('h2',b.title));section.append(head);if(b.body)section.append(node('p',b.body));fragment.append(section);}else{if(!section){section=node('section');fragment.append(section);}section.append(block(b));}}
 content.replaceChildren(fragment);
 }catch{content.replaceChildren(node('p','Updates are temporarily unavailable. Please check back soon.','notice'),link(base+'/addons/page?slug='+site,'Open artist updates'),link('https://richrowmusic.com/contact.html','Booking & enquiries'));}}
load();
