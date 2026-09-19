(() => {
  const cfg = window.LJUBE_CONFIG;

  const byId = (id) => document.getElementById(id);
  const socialGrid = byId('socialGrid');
  const gamesGrid = byId('gamesGrid');
  const scheduleList = byId('scheduleList');
  const setupGrid = byId('setupGrid');

  byId('aboutText').textContent = cfg.about;
  byId('liveHeadline').textContent = 'LIVE NOW';
  byId('heroTagline').textContent = cfg.brand.tagline;
  byId('currentGame').textContent = cfg.currentlyPlaying;
  byId('genresText').textContent = cfg.genres;
  byId('year').textContent = new Date().getFullYear();

  const primarySocial = cfg.socials.find((social) => social.key === 'kick') || cfg.socials[0];
  const primaryBtn = byId('primarySocialBtn');
  primaryBtn.href = primarySocial.url;
  primaryBtn.target = '_blank';
  primaryBtn.rel = 'noopener noreferrer';
  primaryBtn.textContent = `${primarySocial.cta} ON ${primarySocial.label.toUpperCase()}`;

  const livePlatforms = new Set(['twitch', 'youtube', 'kick']);

  socialGrid.innerHTML = cfg.socials.map((social) => `
    <article class="social-card" data-platform="${social.key}" style="--accent:${social.accent}">
      ${livePlatforms.has(social.key) ? `<span class="platform-live-badge" data-live-key="${social.key}" hidden><i aria-hidden="true"></i> LIVE NOW</span>` : ''}
      <span class="social-eyebrow">${social.eyebrow}</span>
      <h3>${social.label}</h3>
      <a href="${social.url}" target="_blank" rel="noopener noreferrer">${social.cta}</a>
    </article>
  `).join('');

  const applyLiveStatus = (statuses = {}) => {
    livePlatforms.forEach((key) => {
      const card = socialGrid.querySelector(`[data-platform="${key}"]`);
      const badge = socialGrid.querySelector(`[data-live-key="${key}"]`);
      if (!card || !badge) return;

      const isLive = statuses[key] === true;
      badge.hidden = !isLive;
      card.classList.toggle('is-live', isLive);
    });
  };

  const refreshLiveStatus = async () => {
    try {
      const response = await fetch('/api/live-status', { cache: 'no-store' });
      if (!response.ok) return;
      const payload = await response.json();
      applyLiveStatus(payload.live || {});
    } catch (_) {
      // If a platform check is temporarily unavailable, keep the site clean and functional.
    }
  };

  refreshLiveStatus();
  window.setInterval(refreshLiveStatus, 60000);

  gamesGrid.innerHTML = cfg.games.map((game) => `
    <article class="game-card">
      <img src="${game.image}" alt="${game.title}" loading="lazy" />
      <div class="game-overlay"></div>
      <div class="game-copy">
        <span>${game.tag}</span>
        <h3>${game.title}</h3>
      </div>
    </article>
  `).join('');

  scheduleList.innerHTML = cfg.schedule.map((slot) => `
    <div class="schedule-row">
      <strong>${slot.day}</strong>
      <span>${slot.start} — ${slot.end}</span>
    </div>
  `).join('');

  setupGrid.innerHTML = cfg.setup.map((item) => `
    <article class="setup-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
    </article>
  `).join('');
})();
