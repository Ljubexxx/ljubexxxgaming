(() => {
  const cfg = window.LJUBE_CONFIG;
  if (!cfg) return;

  const colors = {
    twitch:'#a970ff', youtube:'#ff1f35', tiktok:'#ff3855',
    kick:'#53fc18', instagram:'#ff3f97', discord:'#6678ff'
  };
  const leftOrder = ['twitch','youtube','tiktok'];
  const rightOrder = ['kick','instagram','discord'];

  const iconClass = key => `social-icon icon-${key}`;
  const iconContent = key => key === 'tiktok' ? '♪' : '';

  function socialCard(key){
    const s = cfg.socials[key];
    const action = s.enabled && s.url
      ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.cta}</a>`
      : `<button type="button" disabled>${s.cta}</button>`;
    return `<article class="social-card" style="--accent:${colors[key]}">
      <span class="${iconClass(key)}">${iconContent(key)}</span>
      <small>${s.eyebrow}</small>
      <h3>${s.label.toUpperCase()}</h3>
      ${action}
    </article>`;
  }
  document.getElementById('socialsLeft').innerHTML = leftOrder.map(socialCard).join('');
  document.getElementById('socialsRight').innerHTML = rightOrder.map(socialCard).join('');

  const gameAssets = {
    'FC 27':'assets/game-fc27.webp',
    'FOOTBALL MANAGER 2026':'assets/game-fm2026.webp',
    'GRAND THEFT AUTO V':'assets/game-gtav.webp',
    'COUNTER-STRIKE 2':'assets/game-cs2.webp'
  };
  const gameGrid = document.getElementById('gameGrid');
  gameGrid.innerHTML = cfg.games.map((g,i) => `<article class="game-card${i===0?' is-active':''}" data-index="${i}">
    <img src="${gameAssets[g.title] || g.image}" alt="${g.title}" loading="${i===0?'eager':'lazy'}">
    <div class="game-meta"><strong>${g.title}</strong><span>${g.tag}</span></div>
  </article>`).join('');

  const cards = [...document.querySelectorAll('.game-card')];
  let activeIndex = 0;
  function setActive(index, scroll=true){
    activeIndex = (index + cards.length) % cards.length;
    cards.forEach((c,i)=>c.classList.toggle('is-active',i===activeIndex));
    if(scroll && matchMedia('(max-width:680px)').matches){
      cards[activeIndex].scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    }
  }
  document.getElementById('prevGame').addEventListener('click',()=>setActive(activeIndex-1));
  document.getElementById('nextGame').addEventListener('click',()=>setActive(activeIndex+1));
  cards.forEach((card,i)=>card.addEventListener('mouseenter',()=>setActive(i,false)));

  document.getElementById('aboutText').textContent = cfg.about;
  document.getElementById('currentGame').textContent = cfg.currentlyPlaying;
  document.getElementById('genres').textContent = cfg.genres;
  document.getElementById('scheduleList').innerHTML = cfg.schedule.map(s => `<div class="schedule-row"><strong>${s.day}</strong><span>${s.start} - ${s.end}</span></div>`).join('');
  document.getElementById('liveTagline').textContent = cfg.brand.tagline;
  document.getElementById('year').textContent = new Date().getFullYear();

  // Live indicator based on configured Belgrade schedule. Cross-midnight streams are supported.
  function belgradeParts(date=new Date()){
    const parts = new Intl.DateTimeFormat('en-GB',{timeZone:cfg.timezone,weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(date);
    const get = t => parts.find(p=>p.type===t)?.value;
    const dayMap={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};
    return {day:dayMap[get('weekday')],mins:(+get('hour')%24)*60+(+get('minute'))};
  }
  const toMins = value => { const [h,m]=value.split(':').map(Number); return h*60+m; };
  function isLiveNow(){
    const now = belgradeParts();
    return cfg.schedule.some(s=>{
      const start=toMins(s.start), end=toMins(s.end);
      if(end>start) return now.day===s.dayIndex && now.mins>=start && now.mins<end;
      // crosses midnight
      return (now.day===s.dayIndex && now.mins>=start) || (now.day===(s.dayIndex+1)%7 && now.mins<end);
    });
  }
  const liveLabel = document.getElementById('liveLabel');
  const liveBar = document.getElementById('liveBar');
  if(!isLiveNow()){
    liveLabel.textContent='STREAM HUB';
    liveBar.classList.add('offline');
  }

  // Perfectly centered nav hover is handled by the anchor itself; here we only manage active state.
  const navLinks=[...document.querySelectorAll('.main-nav a')];
  navLinks.forEach(link=>link.addEventListener('click',()=>{
    navLinks.forEach(a=>a.classList.remove('active'));
    link.classList.add('active');
    if(matchMedia('(max-width:980px)').matches){
      document.getElementById('mainNav').classList.remove('open');
      document.getElementById('menuToggle').setAttribute('aria-expanded','false');
    }
  }));

  const menuToggle=document.getElementById('menuToggle');
  const mainNav=document.getElementById('mainNav');
  menuToggle.addEventListener('click',()=>{
    const open=mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded',String(open));
  });

  const toast=document.getElementById('toast');
  let timer;
  document.querySelector('.social-card button:disabled')?.addEventListener('click',()=>{
    toast.textContent='Discord community — COMING SOON';
    toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),1600);
  });
})();
