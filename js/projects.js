// projects.js
// This file hardcodes your projects array.
// To rearrange or edit projects, change the order or fields below.

// Each project object:
// {
//   id: 'unique-id',
//   title: 'Project Name',
//   desc: 'Short description',
//   img: 'image url',
//   tags: ['tech','type'],
//   url: 'link to open (optional)',
//   code: 'link to repo (optional)',
//   year: 2024
// }

const projects = [
  // primary list based on your memory/context (rearrange by changing order)
  { id:'anipaca', title:'AniPaca (anipaca)', desc:'Anime discovery & listing frontend + API integration.', img:'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1200', tags:['anime','web','api'], url:'https://anipaca2.vercel.app/', code:'https://github.com/VoidX3D/anipaca' , year:2024 },
  { id:'aniwave', title:'AniWave', desc:'Streaming frontend and media player for anime content.', img:'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1200', tags:['anime','player'], url:'https://aniwave.free.nf', code:'https://github.com/VoidX3D/AniWave', year:2023 },
  { id:'heroic-spirit', title:'Heroic Spirit', desc:'Curated anime list (Heroic Spirit) web app.', img:'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1200', tags:['anime','list'], url:'https://heroic-spirit-production.up.railway.app/', code:'https://github.com/VoidX3D/heroic-spirit', year:2023 },
  { id:'anipacaapi', title:'AniPaca API', desc:'Anime data API powering AniPaca frontends.', img:'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200', tags:['api','backend'], url:'#', code:'https://github.com/VoidX3D/anipacaapi', year:2023 },
  { id:'aniwatch-api', title:'AniWatch API', desc:'Streaming indexer & proxy APIs.', img:'https://images.unsplash.com/photo-1558981403-c5f9893a43f0?q=80&w=1200', tags:['api','proxy'], url:'#', code:'https://github.com/VoidX3D/aniwatch-api', year:2023 },
  { id:'instagram-clone', title:'Instagram Clone', desc:'Small fullstack Instagram clone demo.', img:'https://images.unsplash.com/photo-1517263904808-5dc0f1e3a6c9?q=80&w=1200', tags:['fullstack','clone'], url:'#', code:'https://github.com/VoidX3D/instagram-clone', year:2022 },
  { id:'quest-for-the-core', title:'Quest For The Core (Roblox)', desc:'Sky islands map & elemental powers Roblox game scaffold.', img:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200', tags:['roblox','game'], url:'#', code:'https://github.com/VoidX3D/quest-for-the-core', year:2025 },
  { id:'facialrec', title:'FacialRec Project', desc:'Webcam facial expression detection app (demo).', img:'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200', tags:['ml','computer-vision'], url:'#', code:'https://github.com/VoidX3D/Project_FacialRec', year:2025 },
  { id:'proxy-m3u8', title:'proxy-m3u8', desc:'m3u8 proxy for streaming playlists.', img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200', tags:['streaming','proxy'], url:'#', code:'https://github.com/VoidX3D/proxy-m3u8', year:2024 },
  { id:'kitsune', title:'Kitsune', desc:'Utility toolkit & microservices collection.', img:'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200', tags:['tools','backend'], url:'#', code:'https://github.com/VoidX3D/kitsune', year:2024 },
  { id:'anisora', title:'AniSora', desc:'Small anime discovery project with UI polish.', img:'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200', tags:['anime','frontend'], url:'#', code:'https://github.com/VoidX3D/anisora', year:2023 },
  { id:'anilist-real', title:'AniList-Real', desc:'AniList-style tracker and UI demo.', img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200', tags:['tracker','web'], url:'#', code:'https://github.com/VoidX3D/anilist-real', year:2024 },
  { id:'ani-track-central', title:'AniTrack Central', desc:'Anime tracking dashboard and tools.', img:'https://images.unsplash.com/photo-1531498860507-7b8a0b1c3d96?q=80&w=1200', tags:['dashboard','tools'], url:'#', code:'https://github.com/VoidX3D/ani-track-central', year:2024 },
  { id:'wave-anime-hub', title:'Wave Anime Hub', desc:'Custom anime portal with responsive layouts.', img:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200', tags:['frontend','ui'], url:'#', code:'https://github.com/VoidX3D/wave-anime-hub', year:2023 },
  { id:'heroic-spirit-production', title:'Heroic Spirit (prod)', desc:'Hosted production endpoint for Heroic Spirit.', img:'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200', tags:['hosting','prod'], url:'https://heroic-spirit-production.up.railway.app/', code:'#', year:2023 },
  { id:'sincere-web-architect', title:'Sincere Web Architect', desc:'Portfolio & web architecture templates.', img:'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200', tags:['portfolio','template'], url:'https://voidx3d.netlify.app', code:'https://github.com/VoidX3D/sincere-web-architect', year:2024 },
  { id:'instagram-clone-old', title:'Instagram (old)', desc:'Legacy Instagram experiment', img:'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200', tags:['legacy'], url:'#', code:'#', year:2022 },
  { id:'revise-my-script', title:'Revise My Script', desc:'A script revision helper and formatter.', img:'https://images.unsplash.com/photo-1517433456452-f9633a875f6f?q=80&w=1200', tags:['tools'], url:'#', code:'https://github.com/VoidX3D/revise-my-script', year:2024 },
  { id:'anime-api-others', title:'Other Anime APIs', desc:'Collection of small anime APIs and proxies.', img:'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200', tags:['api'], url:'#', code:'#', year:2023 },
  { id:'instagram-clone-2', title:'Instagram Clone 2', desc:'Improved Instagram clone with auth.', img:'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200', tags:['fullstack','auth'], url:'#', code:'#', year:2024 },
  { id:'aniwave2', title:'AniWave 2', desc:'Next iteration of AniWave UI and performance improvements.', img:'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=1200', tags:['ui','perf'], url:'#', code:'#', year:2024 },
  { id:'instagram-clone-3', title:'Instagram Clone 3', desc:'Experimental social features.', img:'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200', tags:['social','experimental'], url:'#', code:'#', year:2025 }
];

// ---------- rendering logic ----------
const container = document.getElementById('projectsGrid');
const emptyState = document.getElementById('emptyState');

const state = {
  view: 'grid', // 'grid' | 'list'
  query: '',
  sort: 'order'
};

// helpers
function createCardHTML(p){
  // create container
  const el = document.createElement('article');
  el.className = 'project-card';
  el.dataset.id = p.id;

  // image (with lazy loading)
  const img = document.createElement('img');
  img.className = 'project-thumb';
  img.loading = 'lazy';
  img.alt = p.title + ' thumbnail';
  img.src = p.img;

  // body
  const body = document.createElement('div');
  body.className = 'project-body';

  const title = document.createElement('div');
  title.className = 'project-title';
  title.textContent = p.title;

  const desc = document.createElement('div');
  desc.className = 'project-desc';
  desc.textContent = p.desc;

  const meta = document.createElement('div');
  meta.className = 'project-meta';

  // tags
  p.tags && p.tags.slice(0,3).forEach(t=>{
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = t;
    meta.appendChild(tag);
  });

  // year
  const yr = document.createElement('div');
  yr.className = 'small';
  yr.style.marginLeft = '8px';
  yr.textContent = p.year || '';
  meta.appendChild(yr);

  // actions
  const actions = document.createElement('div');
  actions.className = 'project-actions';

  if(p.url && p.url !== '#'){
    const a = document.createElement('a');
    a.className = 'btn-mini btn-open';
    a.textContent = 'Open';
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    actions.appendChild(a);
  }

  if(p.code && p.code !== '#'){
    const c = document.createElement('a');
    c.className = 'btn-mini btn-code';
    c.textContent = 'Code';
    c.href = p.code;
    c.target = '_blank';
    c.rel = 'noopener noreferrer';
    actions.appendChild(c);
  }

  // assemble
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(meta);
  body.appendChild(actions);

  el.appendChild(img);
  el.appendChild(body);

  return el;
}

// render function (applies filters + sort)
function renderProjects(){
  // apply search filter
  const q = state.query.trim().toLowerCase();
  let list = projects.slice();

  if(q.length){
    list = list.filter(p=>{
      return p.title.toLowerCase().includes(q) ||
             p.desc.toLowerCase().includes(q) ||
             (p.tags && p.tags.join(' ').toLowerCase().includes(q));
    });
  }

  // sort
  if(state.sort === 'alpha'){
    list.sort((a,b)=> a.title.localeCompare(b.title));
  } else if(state.sort === 'alpha-desc'){
    list.sort((a,b)=> b.title.localeCompare(a.title));
  } else if(state.sort === 'new'){
    list.sort((a,b)=> (b.year||0) - (a.year||0));
  } // default keeps array order

  // clear
  container.innerHTML = '';

  if(list.length === 0){
    emptyState.hidden = false;
    container.setAttribute('aria-busy', 'false');
    return;
  }
  emptyState.hidden = true;

  // layout class
  if(state.view === 'list'){
    container.classList.remove('grid');
    container.classList.add('list');
  } else {
    container.classList.remove('list');
    container.classList.add('grid');
  }

  // append
  const fragment = document.createDocumentFragment();
  list.forEach(p=> fragment.appendChild(createCardHTML(p)));
  container.appendChild(fragment);

  // small entrance animation with GSAP if available
  if(window.gsap){
    gsap.from(container.querySelectorAll('.project-card'), {opacity:0, y:20, stagger:0.04, duration:0.5, ease:'power2.out'});
  }
  container.setAttribute('aria-busy', 'false');
}

// ---------- UI bindings ----------
document.addEventListener('DOMContentLoaded', function(){
  // initial render
  renderProjects();

  // view toggles
  const btnGrid = document.getElementById('btnGrid');
  const btnList = document.getElementById('btnList');
  btnGrid.addEventListener('click', function(){
    state.view = 'grid';
    btnGrid.classList.add('active'); btnList.classList.remove('active');
    btnGrid.setAttribute('aria-pressed','true'); btnList.setAttribute('aria-pressed','false');
    renderProjects();
  });
  btnList.addEventListener('click', function(){
    state.view = 'list';
    btnList.classList.add('active'); btnGrid.classList.remove('active');
    btnList.setAttribute('aria-pressed','true'); btnGrid.setAttribute('aria-pressed','false');
    renderProjects();
  });

  // search
  const searchInput = document.getElementById('searchInput');
  let searchTimeout = null;
  searchInput.addEventListener('input', function(e){
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(()=>{
      state.query = e.target.value;
      renderProjects();
    }, 160);
  });

  // sort select
  const sortSelect = document.getElementById('sortSelect');
  sortSelect.addEventListener('change', function(){
    state.sort = this.value;
    renderProjects();
  });

  // keyboard accessibility: press 'g' for grid, 'l' for list
  window.addEventListener('keydown', function(e){
    if(e.key === 'g'){ document.getElementById('btnGrid').click(); }
    if(e.key === 'l'){ document.getElementById('btnList').click(); }
  });
});
