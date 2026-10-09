// Presentation only: keep the existing published catalog and membership links.
(()=>{
 'use strict';
 const main=document.querySelector('main'),content=document.getElementById('content');
 if(!main||!content)return;
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const link=(text,href,cls='action')=>{const n=el('a',text,cls);n.href=href;return n;};
 const photos=[
  ['04-fedora','After Hours','Black fedora · Charcoal studio'],
  ['05-bucket','City Rhythm','Cream bucket hat · City courtyard'],
  ['10-panama','Island State','Straw Panama · Caribbean terrace'],
  ['06-beanie','Cold City','Charcoal beanie · Evening streets'],
  ['07-newsboy','Sunday Soul','Tweed newsboy cap · Vinyl lounge'],
  ['08-snapback','The Home Team','Burgundy snapback · Ivory studio'],
  ['09-porkpie','Blue Note','Navy pork pie · Recording room'],
  ['11-trucker','Off the Clock','Black trucker cap · Studio hallway'],
  ['12-beret','Creative Direction','Black beret · Artist loft'],
  ['02-ivory-portrait','In the Light','Black cap · Warm ivory set'],
  ['03-studio-session','Behind the Sound','Black cap · Recording studio'],
  ['01-studio-hero','Signature','Black cap · Gold studio lights']
 ];
 let dialog,current=0,returnFocus;
 function showPhoto(index){
  current=(index+photos.length)%photos.length;const [file,title,look]=photos[current];
  dialog.querySelector('img').src=`assets/portraits/${file}.jpg`;
  dialog.querySelector('img').alt=`Wayne Kastro — ${title}. ${look}.`;
  dialog.querySelector('#photo-title').textContent=title;
  dialog.querySelector('.photo-description').textContent=`${current+1} / ${photos.length} · ${look}`;
  const download=dialog.querySelector('a');download.href=`assets/portraits/${file}.jpg`;download.download=`wayne-kastro-${file}.jpg`;
 }
 function openPhoto(index,trigger){
  if(!dialog){
   dialog=el('dialog',null,'photo-dialog');dialog.setAttribute('aria-labelledby','photo-title');
   const top=el('div',null,'photo-dialog-top'),title=el('strong');title.id='photo-title';
   const close=el('button','×');close.type='button';close.setAttribute('aria-label','Close photo');close.onclick=()=>dialog.close();
   top.append(title,close);const image=el('img');image.decoding='async';
   const bottom=el('div',null,'photo-dialog-bottom'),desc=el('span',null,'photo-description');desc.setAttribute('aria-live','polite');
   const download=link('Download ↗','#','photo-download');
   const controls=el('div'),previous=el('button','←'),next=el('button','→');
   for(const [button,name,delta] of [[previous,'Previous photo',-1],[next,'Next photo',1]]){button.type='button';button.setAttribute('aria-label',name);button.onclick=()=>showPhoto(current+delta);}
   controls.append(previous,next);bottom.append(desc,download,controls);dialog.append(top,image,bottom);document.body.append(dialog);
   dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPhoto(current+(e.key==='ArrowRight'?1:-1));}});
   dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
   dialog.addEventListener('close',()=>{document.body.style.overflow='';returnFocus?.focus({preventScroll:true});});
  }
  returnFocus=trigger;showPhoto(index);document.body.style.overflow='hidden';dialog.showModal();
 }
 function enhanceAlbum(){
  let target=document.getElementById('photos');
  if(!target&&content.querySelector('.notice')?.textContent.startsWith('Updates are temporarily unavailable')){target=el('section');target.id='photos';const head=el('div',null,'section-head');head.append(el('h2','Photos'));target.append(head);content.append(target);}
  if(!target||target.dataset.album)return;target.dataset.album='ready';
  for(const b of target.querySelectorAll('.block'))if(b.textContent.trim()==='Photos from the studio and stage will appear here.')b.remove();
  const intro=el('p','Different looks. Different settings. Always WAYNE KASTRO.','album-intro');
  const grid=el('div',null,'album-grid');grid.id='portrait-album';
  photos.forEach(([file,title,look],index)=>{const figure=el('figure',null,'album-item');figure.hidden=index>=6;const button=el('button',null,'album-open');button.type='button';button.setAttribute('aria-label',`Open photo: ${title}`);const image=el('img');image.src=`assets/portraits/${file}.jpg`;image.alt=`Wayne Kastro — ${look}`;image.width=1122;image.height=1402;image.loading='lazy';image.decoding='async';button.append(image);button.onclick=()=>openPhoto(index,button);const caption=el('figcaption',title);caption.append(el('small',look));figure.append(button,caption);grid.append(figure);});
  const more=el('button','View all 12 photos','album-more');more.type='button';more.setAttribute('aria-expanded','false');more.setAttribute('aria-controls',grid.id);
  more.onclick=()=>{const expanded=more.getAttribute('aria-expanded')!=='true';[...grid.children].forEach((item,i)=>item.hidden=!expanded&&i>=6);more.setAttribute('aria-expanded',String(expanded));more.textContent=expanded?'Show featured photos':'View all 12 photos';};
  target.append(intro,grid,more);
 }
 function enhanceCatalog(){
  const grid=document.querySelector('#music .catalog-grid');if(!grid||grid.dataset.browse)return;grid.dataset.browse='ready';grid.id='music-catalog';
  const cards=[...grid.querySelectorAll('.catalog-card')];if(!cards.length)return;
  const toolbar=el('div',null,'catalog-toolbar'),label=el('label','Find a release','catalog-search'),input=el('input');input.type='search';input.placeholder='Search music or credits';input.setAttribute('aria-label','Search Wayne Kastro music');input.setAttribute('aria-controls',grid.id);label.append(input);
  const status=el('p',null,'catalog-status');status.setAttribute('role','status');toolbar.append(label,status);grid.before(toolbar);
  const more=el('button',null,'catalog-more');more.type='button';more.setAttribute('aria-controls',grid.id);grid.after(more);
  let expanded=false;
  function update(){const query=input.value.trim().toLowerCase(),matches=cards.filter(card=>card.textContent.toLowerCase().includes(query));cards.forEach(card=>card.hidden=true);const shown=query||expanded?matches:matches.slice(0,6);shown.forEach(card=>card.hidden=false);status.textContent=matches.length?`${shown.length} of ${matches.length} releases`:'No matching releases. Try another title or credit.';more.hidden=!!query||matches.length<=6;more.textContent=expanded?'Show latest releases':`View all ${cards.length} releases`;more.setAttribute('aria-expanded',String(expanded));}
  input.addEventListener('input',update);more.onclick=()=>{expanded=!expanded;update();};update();
 }
 function enhanceAbout(){
  const target=document.getElementById('about');if(!target||target.dataset.campaign)return;target.dataset.campaign='ready';
  const figure=el('figure',null,'artist-story-photo'),img=el('img');img.src='assets/portraits/02-ivory-portrait.jpg';img.alt='Wayne Kastro in a black cap and overshirt against a warm ivory background';img.loading='lazy';img.width=1122;img.height=1402;figure.append(img);target.append(figure);
  const links=el('div',null,'artist-story-links');links.append(link('Biography ↗','biography.html',''),link('Press kit ↗','epk.html',''));target.append(links);
 }
 function enhanceConnect(){
  const target=document.getElementById('connect');if(!target||target.dataset.campaign)return;target.dataset.campaign='ready';
  for(const [label,url] of [['Instagram ↗','https://www.instagram.com/drammawayne/'],['Apple Music ↗','https://music.apple.com/us/artist/wayne-kastro/1332476950']]){const block=el('div',null,'block');const a=link(label,url);a.target='_blank';a.rel='noopener noreferrer';block.append(a);target.append(block);}
 }
 function addInvites(){
  if(document.getElementById('artist-experience'))return;
  const section=el('section',null,'experience-invite');section.id='artist-experience';section.setAttribute('aria-label','More from Wayne Kastro');
  for(const [kicker,title,body,label,url] of [['OFFICIAL MERCH','Wear the sound.','Explore the Rich Row store for published items, sizes and availability.','Explore merch ↗','merch.html'],['MEMBERSHIP','Your access. Your way.','Explore the Wayne Kastro membership tiers and access your member catalog.','Explore membership ↗','membership.html']]){const card=el('article');card.append(el('p',kicker,'eyebrow'),el('h2',title),el('p',body),link(label,url));section.append(card);}
  content.after(section);
 }
 function moveRadio(){
  const radio=main.querySelector(':scope > section[aria-label="Highlife Radio live player"]');if(!radio)return;
  let lounge=document.getElementById('radio-lounge');if(!lounge){lounge=el('section',null,'radio-lounge');lounge.id='radio-lounge';lounge.append(el('p','ON AIR / HIGHLIFE RADIO','eyebrow'),el('h2','Keep the music playing.'));main.append(lounge);}lounge.append(radio);
 }
 function enhance(){enhanceAlbum();enhanceCatalog();enhanceAbout();enhanceConnect();moveRadio();}
 addInvites();enhance();let queued=false;
 new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance();});}).observe(main,{childList:true,subtree:true});
})();
