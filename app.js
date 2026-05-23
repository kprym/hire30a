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

function reveal(){
  const io = new IntersectionObserver((entries)=>entries.forEach(e=> e.isIntersecting && e.target.classList.add('show')), {threshold: .12});
  document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));
}

document.getElementById('navToggle').onclick = () => document.getElementById('nav').classList.toggle('open');
window.addEventListener('hashchange', render);
render();
