const PHOTO_FILES = [
  '90E8E1E8-BF4B-4439-84D3-1010A1312F70.jpg',
  'contact.jpg',
  'DAF09C96-7D74-464D-9EE9-49A72C235803.png',
  'dji_fly_20250827_145710_0036_1756328187471_aeb.jpg',
  'dji_fly_20250827_145754_0045_1756328183732_aeb.jpg',
  'dji_fly_20250827_150438_0071_1756328175283_photo.jpg',
  'dji_fly_20250827_180256_0016_1756336342681_photo.jpg',
  'dji_fly_20250827_180548_0026_1756336360797_photo.jpg',
  'dji_fly_20250827_180646_0033_1756336362014_photo.jpg',
  'dji_fly_20250828_140616_0012_1756443401928_aeb.jpg',
  'dji_fly_20250828_141320_0039_1756443395515_aeb.jpg',
  'dji_fly_20250828_141422_0044_1756443382758_aeb.jpg',
  'dji_fly_20250828_141432_0049_1756443382555_aeb.jpg',
  'dji_fly_20250828_141554_0056_1756443379860_aeb.jpg',
  'dji_fly_20250828_142016_0075_1756443373654_pano.jpg',
  'dji_fly_20250905_192416_0167_1757125954774_photo.jpg',
  'dji_fly_20250905_192628_0179_1757125880631_burst.jpg',
  'dji_fly_20250910_184942_0304_1757597093684_photo.jpg',
  'dji_fly_20250910_185346_0321_1757597042649_burst.jpg'
];

const DEFAULT_FAVORITES = [
  { name: 'The Red Bar', area: 'Grayton Beach', type: 'Dinner' },
  { name: 'Black Bear Bread Co.', area: 'Grayton Beach', type: 'Coffee + Breakfast' },
  { name: 'Shunk Gulley', area: 'Gulf Place', type: 'Sunset + Seafood' },
  { name: 'Louis Louis', area: 'Santa Rosa Beach', type: 'Casual Seafood' }
];

const DEFAULT_POSTS = [
  { title: 'Operating Calm, Coastal Life', area: 'Mindset', body: 'I like building systems that remove chaos and create momentum while keeping life grounded in place and people.' },
  { title: 'What I Actually Do', area: 'Work TL;DR', body: 'I step into noisy environments and make strategy executable: cleaner process, tighter team alignment, better outcomes.' }
];

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

const routes = {
  '/home': homeView,
  '/coastal-life': coastalLifeView,
  '/favorites': favoritesView,
  '/work': workView,
  '/journal': journalView,
  '/contact': contactView
};

function image(file, alt = '') {
  return `<img class="photo" src="./${file}" alt="${alt}" loading="lazy" onerror="this.classList.add('missing');this.setAttribute('aria-label','missing image')">`;
}

function homeView() {
  return `<section class="hero split reveal">
    <div>
      <p class="eyebrow">SANTA ROSA BEACH, FL</p>
      <h1>Not a resume.<br/>A sharp snapshot of who I am.</h1>
      <p class="lead">I’m Kolton — operator, advisor, and builder. I blend high-accountability execution with a deeply local Gulf Coast life.</p>
      <div class="chips"><span>30A</span><span>Sandestin</span><span>Miramar Beach</span><span>Destin</span><span>Panama City Beach</span></div>
    </div>
    <div class="hero-photo-wrap">${image(PHOTO_FILES[14], 'Santa Rosa Beach aerial')}</div>
  </section>

  <section class="bento reveal">
    <article class="card kpi"><p>Local Weather</p><h3 id="weatherTemp">Loading…</h3><p class="small" id="weatherMeta">Santa Rosa Beach</p></article>
    <article class="card kpi"><p>Current Focus</p><h3>Scale without noise</h3><p class="small">Process, clarity, execution.</p></article>
    <article class="card kpi"><p>Identity</p><h3>Coastal operator</h3><p class="small">People-first + systems-first.</p></article>
  </section>

  <section class="mosaic reveal">
    ${image(PHOTO_FILES[3], 'Coastline')}
    ${image(PHOTO_FILES[10], 'Beach neighborhoods')}
    ${image(PHOTO_FILES[17], 'Sunset water')}
  </section>`;
}

function coastalLifeView() {
  const regions = [
    ['30A', 'Design-forward communities, bikes, beach days, and local eats.'],
    ['Sandestin', 'Marina energy, golf rhythm, and resort convenience.'],
    ['Miramar Beach', 'Easy beach access and fast casual-to-upscale options.'],
    ['Destin', 'Harbor pulse, boats, and old-school Emerald Coast character.'],
    ['Panama City Beach', 'Wider shoreline, strong day-trip value, and sunset scale.']
  ];

  return `<section><h2>Coastal Life</h2><p class="lead">Where I spend time and what I recommend, organized like a local briefing.</p><div class="grid3">${regions.map((r, i) => `<article class="card reveal">${image(PHOTO_FILES[(i + 5) % PHOTO_FILES.length], r[0])}<h3>${r[0]}</h3><p>${r[1]}</p></article>`).join('')}</div></section>`;
}

function favoritesView() {
  const favorites = store.get('favorites', DEFAULT_FAVORITES);
  return `<section><h2>Local Favorites</h2><p class="small">Add/edit your running hit list instantly.</p><div class="grid2">${favorites.map(f => `<article class="card reveal"><h3>${f.name}</h3><p>${f.area}</p><p class="small">${f.type}</p></article>`).join('')}</div>${adminPanel({ includePosts: false })}</section>`;
}

function workView() {
  return `<section><h2>Work TL;DR</h2><div class="grid2">
    <article class="card reveal"><h3>What I’m good at</h3><p>Turning ambiguity into operating cadence: cleaner handoffs, clearer ownership, better outcomes.</p></article>
    <article class="card reveal"><h3>How I lead</h3><p>Direct, calm, practical. I care about team trust as much as output.</p></article>
    <article class="card reveal"><h3>Where I’ve worked</h3><p>From hospitality and retail foundations to strategic GTM and SaaS operations.</p></article>
    <article class="card reveal">${image(PHOTO_FILES[0], 'Coastal reference')}<p class="small">Personal roots + professional intensity.</p></article>
  </div></section>`;
}

function journalView() {
  const posts = store.get('posts', DEFAULT_POSTS);
  return `<section><h2>Journal</h2><p class="lead">For coastal living, systems thinking, and what I’m learning in public.</p><div class="stack">${posts.map(p => `<article class="card reveal"><h3>${p.title}</h3><p class="small">${p.area}</p><p>${p.body}</p></article>`).join('')}</div>${adminPanel({ includePosts: true })}</section>`;
}

function contactView() {
  return `<section><h2>Contact</h2><div class="split">
    <article class="card reveal"><p class="small">Primary</p><h3>@ok.kolt</h3><p class="small">Visual / Secondary</p><h3>@koltagram</h3><p>Email: <a href="mailto:hello@kolton.net">hello@kolton.net</a></p></article>
    <article class="card reveal">${image('contact.jpg', 'Contact')}</article>
  </div></section>`;
}

function adminPanel({ includePosts }) {
  return `<section class="card admin reveal"><h3>Quick Admin (browser-local)</h3><p class="small">Fast edits now. For true multi-device admin, connect this UI to WordPress/Headless CMS later.</p><div class="grid2"><form id="favoriteForm"><input class="input" name="name" placeholder="Place name" required><input class="input" name="area" placeholder="Area"><input class="input" name="type" placeholder="Type"><button class="btn">Add Favorite</button></form>${includePosts ? '<form id="postForm"><input class="input" name="title" placeholder="Post title" required><input class="input" name="area" placeholder="Category"><textarea class="input" name="body" rows="4" placeholder="Post body" required></textarea><button class="btn">Add Post</button></form>' : '<div class="small">Go to Journal to add blog posts.</div>'}</div></section>`;
}

function render() {
  const path = location.hash.replace('#', '') || '/home';
  const view = routes[path] || routes['/home'];
  document.getElementById('app').innerHTML = view();
  document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${path}`));
  bindForms();
  initReveal();
  if (path === '/home') loadWeather();
}

async function loadWeather() {
  const temp = document.getElementById('weatherTemp');
  const meta = document.getElementById('weatherMeta');
  if (!temp || !meta) return;

  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=30.3960&longitude=-86.2288&current=temperature_2m,apparent_temperature,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph');
    if (!res.ok) throw new Error('bad weather response');
    const data = await res.json();
    temp.textContent = `${data.current.temperature_2m}°F`;
    meta.textContent = `Feels like ${data.current.apparent_temperature}°F · Wind ${data.current.wind_speed_10m} mph`;
  } catch {
    temp.textContent = 'Unavailable';
    meta.textContent = 'Weather feed unavailable right now.';
  }
}

function bindForms() {
  const favoriteForm = document.getElementById('favoriteForm');
  if (favoriteForm) {
    favoriteForm.onsubmit = (event) => {
      event.preventDefault();
      const favorites = store.get('favorites', DEFAULT_FAVORITES);
      favorites.unshift(Object.fromEntries(new FormData(favoriteForm).entries()));
      store.set('favorites', favorites);
      render();
    };
  }

  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.onsubmit = (event) => {
      event.preventDefault();
      const posts = store.get('posts', DEFAULT_POSTS);
      posts.unshift(Object.fromEntries(new FormData(postForm).entries()));
      store.set('posts', posts);
      render();
    };
  }
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

document.getElementById('navToggle').onclick = () => document.getElementById('nav').classList.toggle('open');
window.addEventListener('hashchange', render);
render();
