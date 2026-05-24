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
const photoNames = [
  'srb-dune-lake.jpg','srb-shoreline.jpg','30a-palm.jpg','seaside-evening.jpg','grayton-beach.jpg','miramar-sunset.jpg','sandestin-marina.jpg','destin-harbor.jpg','pcb-coastline.jpg'
];

const defaultPosts = [
  { title: 'Morning Systems, Evening Salt Air', body: 'How I run executive operations like a playbook while keeping life rooted in coastal rhythm.', area: 'Santa Rosa Beach' },
  { title: 'Where to Eat This Week on 30A', body: 'A rotating local hit list: casual, iconic, and worth the wait.', area: '30A' }
];

const defaultSpots = [
  { name: 'The Red Bar', area: 'Grayton Beach', note: 'A classic for energy and atmosphere.' },
  { name: 'Shunk Gulley', area: 'Gulf Place', note: 'Great sunset and people watching.' },
  { name: 'Black Bear Bread Co.', area: 'Grayton Beach', note: 'Morning staple for coffee + pastries.' }
];

const store = {
  get(k, fallback){ try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } },
  set(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
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
  '/coast': coastView,
  '/journal': journalView,
  '/work': workView,
  '/contact': contactView,
};

function photo(name, alt){ return `<img class="photo" src="./${name}" alt="${alt}" loading="lazy" onerror="this.style.opacity='.35';this.title='Missing local file: ${name}'">`; }

function homeView(){
  return `<section class="hero fade-up"><h1>Built on Gulf light.<br>Scaled with operator discipline.</h1><p class="lead">This is a personal + professional homebase: Santa Rosa Beach lifestyle, regional coastal recommendations, and proven leadership across hospitality, retail, and SaaS operations.</p></section>
  <section class="grid grid-3 fade-up">${photo(photoNames[0],'Dune lake')} ${photo(photoNames[2],'Palm and coastal view')} ${photo(photoNames[1],'Santa Rosa Beach shoreline')}</section>
  <section class="grid grid-2 fade-up"><div class="card"><h2>What this site is</h2><p>Part portfolio, part living coastal guide, part journal. It is intentionally easy to update so content can evolve every week.</p><div class="tags"><span class="tag">30A</span><span class="tag">Sandestin</span><span class="tag">Miramar</span><span class="tag">Destin</span><span class="tag">Panama City Beach</span></div></div><div class="card"><h2>Instagram</h2><p><strong>@ok.kolt</strong> for lifestyle and travel moments.</p><p><strong>@koltagram</strong> for visual storytelling and coastal creative.</p></div></section>`;
}
function coastView(){
  const areas = [
    ['30A','Neighborhood character, food, and design-forward spots.'],
    ['Sandestin','Marina views, golf, and family-friendly options.'],
    ['Miramar Beach','Beach access convenience and evening dining.'],
    ['Destin','Harbor energy, boats, and classic Emerald Coast feel.'],
    ['Panama City Beach','Wider beaches and daytrip-friendly options.']
  ];
  return `<section><h1>The Coast</h1><p class='lead'>A living local guide that blends personal recommendations with practical planning.</p><div class="grid grid-3">${areas.map((a,i)=>`<article class='card fade-up'>${photo(photoNames[(i+3)%photoNames.length],a[0])}<h3>${a[0]}</h3><p>${a[1]}</p></article>`).join('')}</div></section>`;
}
function journalView(){
  const posts = store.get('posts', defaultPosts);
  return `<section><h1>Field Notes Journal</h1><p class='small'>Blog-ready and editable from the in-browser admin panel below.</p><div class='grid'>${posts.map(p=>`<article class='card fade-up'><h3>${p.title}</h3><p class='small'>${p.area}</p><p>${p.body}</p></article>`).join('')}</div>${adminPanel()}</section>`;
}
function workView(){
  return `<section><h1>The Work</h1><p class='lead'>Operations leadership with cross-sector depth—hospitality to enterprise SaaS—with a people-first execution style.</p><div class='timeline'>
  <article class='fade-up'><h3>Executive GTM & Revenue Operations</h3><p>Built scalable systems, aligned teams, and drove measurable outcomes.</p></article>
  <article class='fade-up'><h3>Hospitality & Retail Foundations</h3><p>Frontline leadership that shaped practical service and process instincts.</p></article>
  <article class='fade-up'><h3>Local Consulting</h3><p>Helping coastal businesses simplify operations and grow with consistency.</p></article>
  </div></section>`;
}
function contactView(){
  return `<section><h1>Contact</h1><div class='card'><p>Want advisory support, collaboration, or a local feature?</p><p>Email: <a href='mailto:hello@kolton.net'>hello@kolton.net</a></p><p>Instagram: <a href='https://instagram.com/ok.kolt' target='_blank'>@ok.kolt</a></p></div></section>`;
}

function adminPanel(){
  return `<section class='card fade-up'><h2>Content Admin (Local)</h2><p class='small'>Use this to quickly add restaurants or blog posts. Data saves to this browser via localStorage. For full login-based admin, connect to WordPress/Headless CMS later.</p>
  <div class='grid grid-2'>
    <form id='postForm'><h3>Add Journal Post</h3><input class='input' name='title' placeholder='Title' required><input class='input' name='area' placeholder='Area'><textarea class='input' name='body' rows='4' placeholder='Post body' required></textarea><button class='button'>Save Post</button></form>
    <form id='spotForm'><h3>Add Restaurant/Spot</h3><input class='input' name='name' placeholder='Name' required><input class='input' name='area' placeholder='Area'><textarea class='input' name='note' rows='3' placeholder='Notes'></textarea><button class='button'>Save Spot</button><div id='spotsList' class='small' style='margin-top:.8rem'></div></form>
  </div></section>`;
}

function render(){
  const path = location.hash.replace('#','') || '/home';
  const view = routes[path] || routes['/home'];
  document.getElementById('app').innerHTML = view();
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href')===`#${path}`));
  bindForms();
  reveal();
}

function bindForms(){
  const postForm = document.getElementById('postForm');
  if(postForm){
    postForm.onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(postForm);
      const posts = store.get('posts', defaultPosts);
      posts.unshift(Object.fromEntries(fd.entries()));
      store.set('posts', posts);
      location.hash = '/journal';
      render();
    };
  }
  const spotForm = document.getElementById('spotForm');
  if(spotForm){
    const list = document.getElementById('spotsList');
    const spots = store.get('spots', defaultSpots);
    list.innerHTML = spots.map(s=>`• ${s.name} (${s.area})`).join('<br>');
    spotForm.onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(spotForm);
      const next = store.get('spots', defaultSpots);
      next.unshift(Object.fromEntries(fd.entries()));
      store.set('spots', next);
      render();
    };
  }
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('show'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
function reveal(){
  const io = new IntersectionObserver((entries)=>entries.forEach(e=> e.isIntersecting && e.target.classList.add('show')), {threshold: .12});
  document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));
}

document.getElementById('navToggle').onclick = () => document.getElementById('nav').classList.toggle('open');
window.addEventListener('hashchange', render);
render();
