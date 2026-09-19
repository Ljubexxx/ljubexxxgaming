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

  const primarySocial = cfg.socials[0];
  const primaryBtn = byId('primarySocialBtn');
  primaryBtn.href = primarySocial.url;
  primaryBtn.target = '_blank';
  primaryBtn.rel = 'noopener noreferrer';
  primaryBtn.textContent = `${primarySocial.cta} ON ${primarySocial.label.toUpperCase()}`;

  socialGrid.innerHTML = cfg.socials.map((social) => `
    <article class="social-card" style="--accent:${social.accent}">
      <span class="social-eyebrow">${social.eyebrow}</span>
      <h3>${social.label}</h3>
      <a href="${social.url}" target="_blank" rel="noopener noreferrer">${social.cta}</a>
    </article>
  `).join('');

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
