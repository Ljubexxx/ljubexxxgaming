(() => {
  const cfg = window.LJUBE_CONFIG;
  const socialOrderLeft = ['twitch', 'youtube', 'tiktok'];
  const socialOrderRight = ['kick', 'instagram', 'discord'];
  const makeSocialCard = (key) => {
    const s = cfg.socials[key];
    const tag = s.enabled && s.url ? 'a' : 'div';
    const href = s.enabled && s.url ? `href="${s.url}" target="_blank" rel="noopener noreferrer"` : '';
    return `
      <${tag} class="social-card panel ${s.enabled && s.url ? '' : 'disabled'}" style="--accent:${s.accent}" ${href}>
        <div class="social-top">
          <div class="social-icon">${s.icon}</div>
          <div>
            <div class="eyebrow-small">${s.eyebrow}</div>
            <div class="social-name">${s.label.toUpperCase()}</div>
          </div>
        </div>
        <div class="social-cta">${s.cta}</div>
      </${tag}>`;
  };

  document.getElementById('leftSocials').innerHTML = socialOrderLeft.map(makeSocialCard).join('');
  document.getElementById('rightSocials').innerHTML = socialOrderRight.map(makeSocialCard).join('');

  document.getElementById('desktopGames').innerHTML = cfg.games.map(game => `
    <article class="game-card" style="--img-pos:${game.position}">
      <img src="${game.image}" alt="${game.title}">
      <div class="game-caption">
        <span class="game-tag">${game.tag}</span>
        <h3 class="game-title">${game.title}</h3>
      </div>
    </article>
  `).join('');

  document.getElementById('aboutText').textContent = cfg.about;
  document.getElementById('playingTitle').textContent = cfg.currentlyPlaying;
  document.getElementById('playingGenres').textContent = cfg.genres;
  document.getElementById('scheduleList').innerHTML = cfg.schedule.map(row => `
    <div class="schedule-row"><strong>${row.day}</strong><time>${row.start} - ${row.end}</time></div>
  `).join('');
  document.getElementById('liveTagline').textContent = cfg.brand.tagline;
  document.getElementById('year').textContent = new Date().getFullYear();

  // Desktop arrow buttons: smooth scroll on smaller layouts where the games row becomes horizontal.
  const gamesGrid = document.getElementById('desktopGames');
  const scrollAmount = 220;
  document.getElementById('desktopPrev')?.addEventListener('click', () => {
    gamesGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  document.getElementById('desktopNext')?.addEventListener('click', () => {
    gamesGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  });
})();
