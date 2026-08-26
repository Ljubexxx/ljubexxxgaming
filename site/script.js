(() => {
  const cfg = window.LJUBE_CONFIG;
  const socialColors = {twitch:'#a970ff',youtube:'#ff2d45',tiktok:'#ff4b72',kick:'#53fc18',instagram:'#ff4aa0',discord:'#7189ff'};

  // Desktop links remain visually identical to approved mockup but are real clickable anchors.
  document.querySelectorAll('[data-social]').forEach(el => {
    const key = el.dataset.social;
    const s = cfg.socials[key];
    if (!s || !s.enabled || !s.url) return;
    el.href = s.url;
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });

  const toast = document.getElementById('desktopToast');
  let toastTimer;
  const showToast = (text) => {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  };
  document.getElementById('desktopPrev')?.addEventListener('click', () => showToast('Game carousel controls are ready — visual rotation comes next.'));
  document.getElementById('desktopNext')?.addEventListener('click', () => showToast('Game carousel controls are ready — visual rotation comes next.'));
  document.querySelector('.hs-discord')?.addEventListener('click', () => showToast('Discord community — COMING SOON'));

  // Functional responsive/mobile view.
  const order = ['twitch','youtube','tiktok','kick','instagram','discord'];
  const mobileSocials = document.getElementById('mobileSocials');
  mobileSocials.innerHTML = order.map(key => {
    const s = cfg.socials[key];
    const action = s.enabled && s.url
      ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.cta}</a>`
      : `<button type="button" disabled>${s.cta}</button>`;
    return `<article class="m-social" style="--accent:${socialColors[key]}"><small>${s.eyebrow}</small><h3>${s.label.toUpperCase()}</h3>${action}</article>`;
  }).join('');

  document.getElementById('mobileGames').innerHTML = cfg.games.map(g => `<article class="m-game"><img src="${g.image}" alt="${g.title}"><span>${g.title}</span></article>`).join('');
  document.getElementById('mobileAbout').textContent = cfg.about;
  document.getElementById('mobileCurrent').textContent = cfg.currentlyPlaying;
  document.getElementById('mobileGenres').textContent = cfg.genres;
  document.getElementById('mobileSchedule').innerHTML = cfg.schedule.map(s => `<div class="m-schedule-row"><strong>${s.day}</strong><span>${s.start} - ${s.end}</span></div>`).join('');
  document.getElementById('year').textContent = new Date().getFullYear();
})();
