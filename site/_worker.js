const TWITCH_CHANNEL = 'ljubexxxgamingtv';
const KICK_CHANNEL = 'LjubexxxGamingTV';
const YOUTUBE_HANDLE = 'Ljubexxx';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=30, s-maxage=30',
    'X-Content-Type-Options': 'nosniff'
  }
});

async function fetchWithTimeout(url, options = {}, timeoutMs = 7000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function checkTwitch() {
  const url = `https://decapi.me/twitch/uptime/${encodeURIComponent(TWITCH_CHANNEL)}?offline_msg=offline`;
  const response = await fetchWithTimeout(url, {
    headers: { 'Accept': 'text/plain' }
  });
  if (!response.ok) throw new Error(`Twitch status ${response.status}`);
  const text = (await response.text()).trim().toLowerCase();
  if (!text) return false;
  return !text.includes('offline') && !text.includes('not live') && !text.includes('error');
}

async function checkKick() {
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (compatible; LjubeXXXGaming-LiveStatus/1.0)'
  };

  const urls = [
    `https://kick.com/api/v2/channels/${encodeURIComponent(KICK_CHANNEL)}`,
    `https://kick.com/api/v2/channels/${encodeURIComponent(KICK_CHANNEL)}/livestream`
  ];

  for (const url of urls) {
    try {
      const response = await fetchWithTimeout(url, { headers });
      if (!response.ok) continue;
      const data = await response.json();

      if (url.endsWith('/livestream')) {
        if (data == null) return false;
        if (typeof data === 'object') {
          if ('livestream' in data) return Boolean(data.livestream);
          if ('data' in data) return Boolean(data.data);
          return Object.keys(data).length > 0;
        }
      }

      if (data && typeof data === 'object' && 'livestream' in data) {
        return Boolean(data.livestream);
      }
    } catch (_) {
      // Try the fallback endpoint.
    }
  }

  throw new Error('Kick status unavailable');
}

async function checkYouTube() {
  const url = `https://www.youtube.com/@${encodeURIComponent(YOUTUBE_HANDLE)}/live`;
  const response = await fetchWithTimeout(url, {
    redirect: 'follow',
    headers: {
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (compatible; LjubeXXXGaming-LiveStatus/1.0)'
    }
  });
  if (!response.ok) throw new Error(`YouTube status ${response.status}`);

  const html = await response.text();
  return html.includes('"isLiveNow":true') ||
         html.includes('"isLiveBroadcast":true') ||
         html.includes('"isLive":true');
}

async function getLiveStatus() {
  const checks = await Promise.allSettled([
    checkTwitch(),
    checkYouTube(),
    checkKick()
  ]);

  const names = ['twitch', 'youtube', 'kick'];
  const live = {};
  const available = {};

  checks.forEach((result, index) => {
    const name = names[index];
    if (result.status === 'fulfilled') {
      live[name] = result.value === true;
      available[name] = true;
    } else {
      live[name] = false;
      available[name] = false;
    }
  });

  return { live, available, checkedAt: new Date().toISOString() };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/live-status') {
      try {
        return json(await getLiveStatus());
      } catch (_) {
        return json({
          live: { twitch: false, youtube: false, kick: false },
          available: { twitch: false, youtube: false, kick: false },
          checkedAt: new Date().toISOString()
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
