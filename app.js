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

const defaultFavorites = [
  { name: 'The Red Bar', area: 'Grayton Beach', type: 'Dinner' },
  { name: 'Black Bear Bread Co.', area: 'Grayton Beach', type: 'Coffee + Breakfast' },
  { name: 'Shunk Gulley', area: 'Gulf Place', type: 'Sunset + Seafood' }
];

const defaultPosts = [
  { title: 'TL;DR: What I build', area: 'Ops + GTM', body: 'I build practical systems that help teams execute faster, cleaner, and with less noise.' }
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
  return `<img class="photo" src="./${file}" alt="${alt}" loading="lazy" onerror="this.classList.add('missing')">`;
}

function homeView() {
  return `
  <section class="hero reveal">
    <p class="eyebrow">SANTA ROSA BEACH, FL</p>
    <h1>A local coastal life.<br/>A high-output operator mindset.</h1>
    <p class="lead">TL;DR: I'm Kolton. I help teams and businesses scale operations while living deeply rooted in the Gulf Coast lifestyle.</p>
  </section>

  <section class="kpis grid3 reveal">
    <article class="card"><h3>Who I Am</h3><p>Operator + builder + advisor.</p></article>
    <article class="card"><h3>Where I’m Rooted</h3><p>Santa Rosa Beach and the broader Emerald Coast.</p></article>
    <article class="card weather" id="weatherCard"><h3>Local Weather</h3><p>Loading current weather…</p></article>
  </section>

  <section class="gallery grid3 reveal">
    ${image(PHOTO_FILES[3], 'Emerald coast aerial')}
    ${image(PHOTO_FILES[10], 'Coastline and neighborhoods')}
    ${image(PHOTO_FILES[14], 'Panoramic shoreline')}
  </section>`;
}

function coastalLifeView() {
  const regions = ['30A', 'Sandestin', 'Miramar Beach', 'Destin', 'Panama City Beach'];
  return `<section><h2>Coastal Life</h2><p class="lead">A living map of where I spend time, what I love, and what I recommend.</p><div class="grid3">${regions.map((r, i) => `<article class="card reveal">${image(PHOTO_FILES[(i + 5) % PHOTO_FILES.length], r)}<h3>${r}</h3><p>Food, movement, beach rhythm, and local texture.</p></article>`).join('')}</div></section>`;
}

function favoritesView() {
  const favorites = store.get('favorites', defaultFavorites);
  return `<section><h2>Local Favorites</h2><p class="small">Easy to update below. Add places anytime.</p><div class="grid2">${favorites.map(f => `<article class="card reveal"><h3>${f.name}</h3><p>${f.area}</p><p class="small">${f.type}</p></article>`).join('')}</div>${adminPanel()}</section>`;
}

function workView() {
  return `<section><h2>Work TL;DR</h2><div class="grid2"><article class="card reveal"><h3>Core Strength</h3><p>Turning complexity into clean operating systems across sales, GTM, and delivery.</p></article><article class="card reveal"><h3>Operating Style</h3><p>People-first, execution-heavy, and calm under pressure.</p></article><article class="card reveal"><h3>Career Arc</h3><p>Frontline hospitality and retail foundations to SaaS and strategic ops leadership.</p></article><article class="card reveal">${image(PHOTO_FILES[0], 'Local visual')}<p class="small">Professional clarity with coastal grounding.</p></article></div></section>`;
}

function journalView() {
  const posts = store.get('posts', defaultPosts);
  return `<section><h2>Journal</h2><p class="lead">A blog for ideas on coastal living, work systems, and lifestyle design.</p><div class="stack">${posts.map(p => `<article class="card reveal"><h3>${p.title}</h3><p class="small">${p.area}</p><p>${p.body}</p></article>`).join('')}</div>${adminPanel(true)}</section>`;
}

function contactView() {
  return `<section><h2>Contact</h2><div class="grid2"><article class="card reveal"><p>Instagram</p><h3>@ok.kolt</h3><h3>@koltagram</h3><p>Email: <a href="mailto:hello@kolton.net">hello@kolton.net</a></p></article><article class="card reveal">${image('contact.jpg', 'Contact visual')}</article></div></section>`;
}

function adminPanel(includePosts = false) {
  return `<section class="card admin reveal"><h3>Quick Admin (Browser-Local)</h3><p class="small">Add local favorites and journal posts without editing code. Data saves in your browser.</p><div class="grid2"><form id="favoriteForm"><input class="input" name="name" placeholder="Place name" required><input class="input" name="area" placeholder="Area (e.g., 30A)"><input class="input" name="type" placeholder="Type (e.g., brunch)"><button class="btn">Add Favorite</button></form>${includePosts ? '<form id="postForm"><input class="input" name="title" placeholder="Post title" required><input class="input" name="area" placeholder="Category/Area"><textarea class="input" name="body" rows="4" placeholder="Write post" required></textarea><button class="btn">Add Post</button></form>' : '<div class="small">Go to Journal to add new blog posts.</div>'}</div></section>`;
}

function render() {
  const path = location.hash.replace('#', '') || '/home';
  const view = routes[path] || routes['/home'];
  document.getElementById('app').innerHTML = view();
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${path}`));
  bindForms();
  initReveal();
  if (path === '/home') loadWeather();
}

async function loadWeather() {
  const card = document.getElementById('weatherCard');
  if (!card) return;
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=30.3960&longitude=-86.2288&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    const data = await res.json();
    const c = data.current;
    card.innerHTML = `<h3>Local Weather</h3><p>${c.temperature_2m}°F (feels like ${c.apparent_temperature}°F)</p><p class="small">Wind ${c.wind_speed_10m} mph · Santa Rosa Beach</p>`;
  } catch {
    card.innerHTML = '<h3>Local Weather</h3><p class="small">Weather unavailable right now.</p>';
  }
}

function bindForms() {
  const favoriteForm = document.getElementById('favoriteForm');
  if (favoriteForm) {
    favoriteForm.onsubmit = (e) => {
      e.preventDefault();
      const favorites = store.get('favorites', defaultFavorites);
      favorites.unshift(Object.fromEntries(new FormData(favoriteForm).entries()));
      store.set('favorites', favorites);
      render();
    };
  }

  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.onsubmit = (e) => {
      e.preventDefault();
      const posts = store.get('posts', defaultPosts);
      posts.unshift(Object.fromEntries(new FormData(postForm).entries()));
      store.set('posts', posts);
      render();
    };
  }
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

document.getElementById('navToggle').onclick = () => document.getElementById('nav').classList.toggle('open');
window.addEventListener('hashchange', render);
render();
