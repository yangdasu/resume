'use strict';
const works=[
 {file:'p10.jpg',title:'郎德苗寨 · 全景',category:'landscape',label:'风光摄影'},
 {file:'p4.jpg',title:'重庆 · 索道',category:'city',label:'城市摄影'},
 {file:'p8.jpg',title:'乌东苗寨 · 彩虹',category:'landscape',label:'风光摄影'},
 {file:'p12.jpg',title:'昆明 · 天空之境',category:'landscape',label:'风光摄影'},
 {file:'p7.jpg',title:'樱花与摩托',category:'human',label:'人文摄影'},
 {file:'p5.jpg',title:'血月',category:'astro',label:'天文摄影'},
 {file:'p1.jpg',title:'山野峡谷',category:'landscape',label:'风光摄影'},
 {file:'p2.jpg',title:'云海',category:'landscape',label:'风光摄影'},
 {file:'p3.jpg',title:'小高山',category:'landscape',label:'风光摄影'},
 {file:'p6.jpg',title:'重庆 · 解放碑',category:'city',label:'城市摄影'},
 {file:'p9.jpg',title:'天空 · 樱花 · 油菜花',category:'landscape',label:'风光摄影'},
 {file:'p11.jpg',title:'郎德苗寨 · 寨门',category:'human',label:'人文摄影'}
];
const grid=document.getElementById('work-grid'),more=document.getElementById('show-more'),count=document.getElementById('work-count');
let category='all',expanded=false,selection=0,visibleWorks=[];
function renderWorks(){
 const matches=works.filter(w=>category==='all'||w.category===category);
 visibleWorks=expanded?matches:matches.slice(0,6);
 grid.replaceChildren(...visibleWorks.map((work,index)=>{
  const card=document.createElement('button'); card.type='button';card.className='work-card';card.style.setProperty('--card-index',index);card.setAttribute('aria-label',`放大作品：${work.title}`);
  card.innerHTML=`<div class="work-photo"><img src="assets/${work.file}" alt="${work.title}" loading="lazy" width="800" height="600"><span class="photo-number">${String(works.indexOf(work)+1).padStart(2,'0')} / 2026</span><span class="photo-open" aria-hidden="true">↗</span></div><div class="work-caption"><h3>${work.title}</h3><span>${work.label} / 2026</span></div>`;
  card.addEventListener('click',()=>openLightbox(index));return card;
 }));
 more.hidden=matches.length<=6;more.innerHTML=expanded?'收起作品 <span>−</span>':'查看全部作品 <span>＋</span>';
 count.textContent=`显示 ${visibleWorks.length} / ${matches.length} 件作品`;
}
more.addEventListener('click',()=>{expanded=!expanded;renderWorks()});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 category=button.dataset.filter;expanded=false;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderWorks();
}));
const lightbox=document.getElementById('lightbox');
function updateLightbox(){const work=visibleWorks[selection];document.getElementById('lightbox-image').src='assets/'+work.file;document.getElementById('lightbox-image').alt=work.title;document.getElementById('lightbox-title').textContent=work.title;document.getElementById('lightbox-category').textContent=work.label+' / 2026';document.getElementById('lightbox-position').textContent=`${String(selection+1).padStart(2,'0')} / ${String(visibleWorks.length).padStart(2,'0')}`;document.getElementById('previous-work').disabled=document.getElementById('next-work').disabled=visibleWorks.length===1;}
function openLightbox(index){selection=index;updateLightbox();lightbox.showModal();}
function step(direction){selection=(selection+direction+visibleWorks.length)%visibleWorks.length;updateLightbox();}
document.getElementById('close-lightbox').addEventListener('click',()=>lightbox.close());
document.getElementById('previous-work').addEventListener('click',()=>step(-1));document.getElementById('next-work').addEventListener('click',()=>step(1));
lightbox.addEventListener('click',event=>{if(event.target===lightbox){const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();}});
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();step(1)}if(event.key==='ArrowLeft'){event.preventDefault();step(-1)}});
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','打开导航');menu.textContent='菜单 ＋'}
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'关闭导航':'打开导航');menu.textContent=open?'关闭 ×':'菜单 ＋'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});
document.getElementById('copy-wechat').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('hexx--');status.textContent='微信号 hexx-- 已复制。'}catch{status.textContent='请长按或选中复制微信号：hexx--';}});
const awardsDetails=document.querySelector('.awards details');let originalOpen=false;
window.addEventListener('beforeprint',()=>{originalOpen=awardsDetails.open;awardsDetails.open=true;});window.addEventListener('afterprint',()=>{awardsDetails.open=originalOpen;});document.querySelector('.print-button').addEventListener('click',()=>window.print());
document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause()})));
renderWorks();

// Motion is progressive enhancement: all content stays readable without it.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
const revealTargets=[...document.querySelectorAll('.about-body,.section-heading,.stats,.skill-grid article,.journey,.award-row,.motion-head,.video-grid figure,.contact-title,.contact-grid')];
let revealObserver;
function configureReveals(){
 if(revealObserver)revealObserver.disconnect();
 revealTargets.forEach(el=>{el.classList.remove('reveal-pending');el.classList.add('reveal')});
 if(motionPreference.matches||!('IntersectionObserver' in window)){revealTargets.forEach(el=>el.classList.add('is-visible'));return;}
 revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');entry.target.classList.remove('reveal-pending');revealObserver.unobserve(entry.target)}})},{threshold:.08,rootMargin:'0px 0px -25px 0px'});
 revealTargets.forEach(el=>{if(!el.classList.contains('is-visible')){el.classList.add('reveal-pending');revealObserver.observe(el)}});
}
const progress=document.querySelector('.scroll-progress'),heroImage=document.querySelector('.hero-image'),header=document.querySelector('.site-header');
let scrollFrame=0;
function updateScroll(){scrollFrame=0;const distance=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${distance>0?Math.min(1,Math.max(0,scrollY/distance)):0})`;header.classList.toggle('scrolled',scrollY>15);if(heroImage&&!motionPreference.matches){const rect=heroImage.getBoundingClientRect();if(rect.bottom>0&&rect.top<innerHeight){const amount=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));heroImage.style.setProperty('--hero-scale',String(1.015+amount*.075))}}}
function queueScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll)}
window.addEventListener('scroll',queueScroll,{passive:true});window.addEventListener('resize',queueScroll,{passive:true});motionPreference.addEventListener('change',()=>{configureReveals();queueScroll()});
configureReveals();updateScroll();
