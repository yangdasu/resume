(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reduceMotion.matches;
  document.documentElement.classList.add('js-motion');
  const works = [
    {id:10,title:'郎德苗寨 · 全景',category:'风光'},
    {id:4,title:'重庆 · 索道',category:'城市'},
    {id:8,title:'乌东苗寨 · 彩虹',category:'风光'},
    {id:12,title:'昆明 · 天空之境',category:'风光'},
    {id:7,title:'樱花与摩托',category:'人文'},
    {id:5,title:'血月',category:'天文'},
    {id:1,title:'山野峡谷',category:'风光'},
    {id:2,title:'云海',category:'风光'},
    {id:3,title:'小高山',category:'风光'},
    {id:6,title:'重庆 · 解放碑',category:'城市'},
    {id:9,title:'天空 · 樱花 · 油菜花',category:'风光'},
    {id:11,title:'郎德苗寨 · 寨门',category:'人文'}
  ];
  let filter = 'all', expanded = false, filtered = works, activeWork = 0;
  const gallery = $('#works-grid');
  const lightbox = $('#lightbox');
  function renderWorks() {
    filtered = filter === 'all' ? works : works.filter(work => work.category === filter);
    const visible = expanded || filter !== 'all' ? filtered : filtered.slice(0, 6);
    gallery.replaceChildren(...visible.map((work, index) => {
      const button = document.createElement('button');
      button.className = 'work-card';
      button.style.animationDelay = `${Math.min(index * .055, .3)}s`;
      button.setAttribute('aria-label', `放大作品：${work.title}`);
      button.innerHTML = `<div class="work-photo"><img src="assets/p${work.id}.jpg" alt="${work.title}" loading="lazy" width="800" height="600"><span class="work-number">${String(index + 1).padStart(2, '0')} / 2026</span><span class="work-open" aria-hidden="true">↗</span></div><div class="work-caption"><h3>${work.title}</h3><span>${work.category}摄影 / 2026</span></div>`;
      button.addEventListener('click', () => openWork(index));
      return button;
    }));
    $('#show-more').hidden = filter !== 'all';
    $('#show-more').innerHTML = expanded ? '收起作品 <span>−</span>' : '展开全部作品 <span>＋</span>';
    $('#gallery-status').textContent = `当前显示 ${visible.length} 件作品，共 ${filtered.length} 件`;
  }
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    $$('.filter').forEach(item => {const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', selected);});
    renderWorks();
  }));
  $('#show-more').addEventListener('click', () => {
    expanded = !expanded; renderWorks();
    if (!expanded) $('#works').scrollIntoView({behavior:motionPaused ? 'instant' : 'smooth'});
  });
  function updateLightbox() {
    const work = filtered[activeWork];
    $('#lightbox-image').src = `assets/p${work.id}.jpg`;
    $('#lightbox-image').alt = work.title;
    $('#lightbox-title').textContent = `${work.title} · ${work.category}摄影`;
    $('#lightbox-count').textContent = `${String(activeWork + 1).padStart(2,'0')} / ${String(filtered.length).padStart(2,'0')}`;
  }
  function openWork(index) {activeWork = index; updateLightbox(); lightbox.showModal(); document.body.style.overflow = 'hidden';}
  function changeWork(direction) {activeWork = (activeWork + direction + filtered.length) % filtered.length; updateLightbox();}
  $('.lightbox-close').addEventListener('click', () => lightbox.close());
  $('.lightbox-prev').addEventListener('click', () => changeWork(-1));
  $('.lightbox-next').addEventListener('click', () => changeWork(1));
  lightbox.addEventListener('click', event => {if(event.target === lightbox) lightbox.close();});
  lightbox.addEventListener('close', () => {document.body.style.overflow = '';});
  lightbox.addEventListener('keydown', event => {if(event.key === 'ArrowLeft'){event.preventDefault();changeWork(-1);}if(event.key === 'ArrowRight'){event.preventDefault();changeWork(1);}});
  renderWorks();
  const menu = $('.menu-toggle');
  function closeMenu(){menu.setAttribute('aria-expanded','false');$('#navigation').classList.remove('open');menu.querySelector('span').textContent='＋';}
  menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true';menu.setAttribute('aria-expanded',open);$('#navigation').classList.toggle('open',open);menu.querySelector('span').textContent=open?'−':'＋';});
  $$('#navigation a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {if(event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true'){closeMenu();menu.focus();}});
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.08});
  $$('.reveal').forEach(item => revealObserver.observe(item));
  const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){$$('#navigation a').forEach(link=>link.classList.toggle('active',link.hash === `#${entry.target.id}`));}}),{rootMargin:'-15% 0px -60% 0px',threshold:0});
  $$('main section[id]').forEach(section=>navObserver.observe(section));
  let statsStarted = false;
  const statsObserver = new IntersectionObserver(entries => {if(!entries[0].isIntersecting || statsStarted)return;statsStarted=true;statsObserver.disconnect();if(motionPaused)return;
    const start = performance.now();const counters=$$('[data-count]');
    function tick(now){const progress=Math.min((now-start)/1500,1);const eased=1-Math.pow(1-progress,3);counters.forEach(counter=>counter.textContent=Math.round(Number(counter.dataset.count)*(motionPaused?1:eased)));if(progress<1&&!motionPaused)requestAnimationFrame(tick);}
    requestAnimationFrame(tick);
  },{threshold:.4});statsObserver.observe($('.stats'));
  let scrollScheduled=false;
  function updateProgress(){const distance=document.documentElement.scrollHeight-window.innerHeight;$('.reading-progress').style.transform=`scaleX(${distance>0?Math.min(window.scrollY/distance,1):0})`;scrollScheduled=false;}
  window.addEventListener('scroll',()=>{if(!scrollScheduled){requestAnimationFrame(updateProgress);scrollScheduled=true;}},{passive:true});
  window.addEventListener('resize',updateProgress);updateProgress();
  const slides=$$('.hero-image');
  const slideText=[['贵州 · 郎德苗寨','山水之间，人间日常。'],['云南 · 昆明','向天空借一场浪漫。'],['贵州 · 乌东苗寨','雨后，遇见一束光。']];
  let slideIndex=0;
  function nextSlide(){slides[slideIndex].classList.remove('active');slideIndex=(slideIndex+1)%slides.length;slides[slideIndex].classList.add('active');$('#slide-index').textContent=String(slideIndex+1).padStart(2,'0');$('.photo-bottom small').textContent=slideText[slideIndex][0];$('.photo-bottom strong').textContent=slideText[slideIndex][1];}
  $('.next-slide').addEventListener('click', nextSlide);
  setInterval(()=>{if(!motionPaused&&!document.hidden&&!lightbox.open&&window.scrollY<window.innerHeight)nextSlide();},6500);
  function applyMotion(){document.documentElement.classList.toggle('motion-off',motionPaused);$('#motion-toggle').textContent=motionPaused?'开启动效':'暂停动效';$('#motion-toggle').setAttribute('aria-pressed',motionPaused);}
  $('#motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;applyMotion();});
  reduceMotion.addEventListener('change',event=>{motionPaused=event.matches;applyMotion();});applyMotion();
  let toastTimeout;
  function toast(message){$('.toast').textContent=message;$('.toast').classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('.toast').classList.remove('show'),3000);}
  $('#copy-wechat').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('hexx--');toast('微信号已复制：hexx--');}catch{toast('微信号：hexx--，请长按或手动复制');}});
  $('.print-button').addEventListener('click',()=>window.print());
  const honors=$('.more-awards');let honorsOpen=false;
  window.addEventListener('beforeprint',()=>{honorsOpen=honors.open;honors.open=true;});
  window.addEventListener('afterprint',()=>{honors.open=honorsOpen;});
})();
