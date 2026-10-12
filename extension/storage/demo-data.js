// Realistic demo data used to seed EchoTab on first install so the extension
// feels alive immediately. Exposed as window.EchoTabDemoData.

var now = Date.now();
var day = 86400000;
var h = 3600000;

function uid(p) { return p + '_' + Math.random().toString(36).slice(2, 9); }

var demoPages = [
  {
    id: uid('pg'),
    url: 'https://react.dev/learn/thinking-in-react',
    title: 'Thinking in React',
    domain: 'react.dev',
    summary: "Step-by-step guide to React's component-based mental model: break UI into a component hierarchy, build a static version, then add state and data flow.",
    tags: ['react', 'frontend', 'components', 'state', 'tutorial'],
    collection: 'Frontend Fundamentals',
    visitedAt: now - day - 2 * h,
    visitCount: 3,
    readingTime: 720,
    favIcon: 'https://www.google.com/s2/favicons?domain=react.dev&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://threejs-journey.com/lessons/animation-system',
    title: 'The Animation System — Three.js Journey',
    domain: 'threejs-journey.com',
    summary: 'Deep dive into Three.js animation system: keyframes, animation clips, mixing actions, and easing with GSAP-style control.',
    tags: ['three.js', 'animation', 'webgl', 'tutorial', '3d'],
    collection: 'Graphics & Animation',
    visitedAt: now - 2 * day,
    visitCount: 5,
    readingTime: 1500,
    favIcon: 'https://www.google.com/s2/favicons?domain=threejs-journey.com&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://arxiv.org/abs/2304.03442',
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
    domain: 'arxiv.org',
    summary: 'Landmark AI research paper introducing DPO, a method to align language models with human preferences without a separate reward model or RLHF.',
    tags: ['ai', 'research', 'llm', 'alignment', 'paper'],
    collection: 'AI Research',
    visitedAt: now - 2 * h,
    visitCount: 2,
    readingTime: 2400,
    favIcon: 'https://www.google.com/s2/favicons?domain=arxiv.org&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    title: 'Operating Systems: Three Easy Pieces (OSTEP)',
    domain: 'pages.cs.wisc.edu',
    summary: 'Free online textbook covering operating systems via three conceptual pieces: virtualization, concurrency, and persistence.',
    tags: ['operating systems', 'cs', 'textbook', 'systems', 'course'],
    collection: 'CS Coursework',
    visitedAt: now - 3 * day - 4 * h,
    visitCount: 8,
    readingTime: 3600,
    favIcon: 'https://www.google.com/s2/favicons?domain=pages.cs.wisc.edu&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://openai.com/research/gpt-4',
    title: 'GPT-4 Technical Report',
    domain: 'openai.com',
    summary: 'OpenAI technical report on GPT-4 capabilities, evaluation across exams, and safety. AI research referencing large multimodal model benchmarks.',
    tags: ['ai', 'research', 'gpt-4', 'openai', 'paper'],
    collection: 'AI Research',
    visitedAt: now - 1 * h,
    visitCount: 4,
    readingTime: 1800,
    favIcon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://web.dev/learn/css/layout',
    title: 'Learn CSS: Layout',
    domain: 'web.dev',
    summary: 'web.dev guide to modern CSS layout: flexbox, grid, container queries, and responsive design patterns.',
    tags: ['css', 'frontend', 'layout', 'flexbox', 'grid'],
    collection: 'Frontend Fundamentals',
    visitedAt: now - 4 * day,
    visitCount: 6,
    readingTime: 900,
    favIcon: 'https://www.google.com/s2/favicons?domain=web.dev&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://developer.chrome.com/docs/extensions/mv3/intro/',
    title: 'Extensions architecture — Chrome Developers',
    domain: 'developer.chrome.com',
    summary: 'Official docs on Manifest V3 extension architecture: service workers, content scripts, action popup, and the messaging bridge between them.',
    tags: ['chrome', 'extensions', 'mv3', 'tutorial', 'reference'],
    collection: 'Browser Engineering',
    visitedAt: now - 5 * day,
    visitCount: 7,
    readingTime: 1200,
    favIcon: 'https://www.google.com/s2/favicons?domain=developer.chrome.com&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://basics.robertcooper.me/charles-babbage',
    title: 'Charles Babbage and the Analytical Engine',
    domain: 'basics.robertcooper.me',
    summary: 'Article on Charles Babbage, the Analytical Engine, and the origins of general-purpose computing.',
    tags: ['history', 'computing', 'reading'],
    collection: 'CS Coursework',
    visitedAt: now - 6 * day,
    visitCount: 1,
    readingTime: 600,
    favIcon: 'https://www.google.com/s2/favicons?domain=basics.robertcooper.me&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
    title: 'TypeScript in 5 minutes',
    domain: 'typescriptlang.org',
    summary: 'Quick tour of TypeScript types, interfaces, and structural typing.',
    tags: ['typescript', 'frontend', 'types', 'reference'],
    collection: 'Frontend Fundamentals',
    visitedAt: now - 7 * day,
    visitCount: 9,
    readingTime: 300,
    favIcon: 'https://www.google.com/s2/favicons?domain=typescriptlang.org&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://www.freecodecamp.org/news/how-to-build-a-todo-app-with-react/',
    title: 'How to Build a Todo App with React',
    domain: 'freecodecamp.org',
    summary: 'Beginner React tutorial building a todo app with hooks: useState, useReducer, and component composition.',
    tags: ['react', 'tutorial', 'frontend', 'hooks', 'project'],
    collection: 'Frontend Fundamentals',
    visitedAt: now - day + 1 * h,
    visitCount: 2,
    readingTime: 900,
    favIcon: 'https://www.google.com/s2/favicons?domain=freecodecamp.org&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://huggingface.co/blog/rlhf',
    title: 'Illustrating Reinforcement Learning from Human Feedback (RLHF)',
    domain: 'huggingface.co',
    summary: 'Visual explainer of RLHF: reward modeling, policy optimization, and alignment of language models.',
    tags: ['ai', 'research', 'rlhf', 'alignment', 'llm'],
    collection: 'AI Research',
    visitedAt: now - 8 * h,
    visitCount: 3,
    readingTime: 1200,
    favIcon: 'https://www.google.com/s2/favicons?domain=huggingface.co&sz=64',
  },
  {
    id: uid('pg'),
    url: 'https://github.com/mrdoob/three.js',
    title: 'mrdoob/three.js: JavaScript 3D Library',
    domain: 'github.com',
    summary: 'Three.js GitHub repository — the JavaScript 3D library used for WebGL scenes, animation, and shaders.',
    tags: ['three.js', 'webgl', '3d', 'github', 'reference'],
    collection: 'Graphics & Animation',
    visitedAt: now - 3 * day,
    visitCount: 4,
    readingTime: 600,
    favIcon: 'https://www.google.com/s2/favicons?domain=github.com&sz=64',
  },
];

function pagesWithTag(tag) {
  return demoPages.filter(function (p) { return p.tags.indexOf(tag) !== -1; }).map(function (p) { return p.id; });
}

function pagesInCollection(name) {
  return demoPages.filter(function (p) { return p.collection === name; }).map(function (p) { return p.id; });
}

var demoSessions = [
  {
    id: uid('sess'),
    title: 'React component patterns deep dive',
    label: 'Frontend Fundamentals',
    startedAt: now - day,
    endedAt: now - day + 2 * h,
    pageIds: pagesWithTag('react'),
    tabCount: 6,
    summary: 'Explored composition, state lifting, and hooks patterns across the React docs and a todo app tutorial.',
  },
  {
    id: uid('sess'),
    title: 'AI alignment reading marathon',
    label: 'AI Research',
    startedAt: now - 4 * h,
    endedAt: now - 1 * h,
    pageIds: pagesInCollection('AI Research'),
    tabCount: 9,
    summary: 'Read DPO, GPT-4 report, and RLHF explainer back-to-back to understand modern alignment techniques.',
  },
  {
    id: uid('sess'),
    title: 'Three.js animation build session',
    label: 'Graphics & Animation',
    startedAt: now - 2 * day,
    endedAt: now - 2 * day + 3 * h,
    pageIds: pagesWithTag('three.js'),
    tabCount: 4,
    summary: 'Followed the Three.js Journey animation lesson and cross-referenced the GitHub repo for API examples.',
  },
];

var demoNotes = [
  {
    id: uid('note'),
    pageId: demoPages[0].id,
    title: 'Key React principles',
    body: '1. Single source of truth for state.\n2. State flows down, events flow up.\n3. Lift state only when siblings need it.\n4. Think in components, render with data.',
    tags: ['react', 'state', 'notes'],
    createdAt: now - day,
    updatedAt: now - day,
  },
  {
    id: uid('note'),
    pageId: demoPages[2].id,
    title: 'DPO one-liner',
    body: 'DPO removes the need for a separate reward model — the LM itself becomes the reward model via a preference classification objective.',
    tags: ['ai', 'dpo', 'research'],
    createdAt: now - 2 * h,
    updatedAt: now - 2 * h,
  },
  {
    id: uid('note'),
    pageId: demoPages[3].id,
    title: 'OS three pieces',
    body: 'Virtualization (CPU/memory), Concurrency (threads/locks), Persistence (filesystem/RAID). Map every OS topic onto one of these.',
    tags: ['os', 'course'],
    createdAt: now - 3 * day,
    updatedAt: now - 3 * day,
  },
];

var demoCollections = [
  { id: uid('col'), name: 'Frontend Fundamentals', label: 'frontend', createdAt: now - 7 * day, color: '#3b82f6', icon: 'code' },
  { id: uid('col'), name: 'AI Research', label: 'ai', createdAt: now - 6 * day, color: '#06b6d4', icon: 'brain' },
  { id: uid('col'), name: 'Graphics & Animation', label: 'graphics', createdAt: now - 5 * day, color: '#a855f7', icon: 'box' },
  { id: uid('col'), name: 'CS Coursework', label: 'course', createdAt: now - 4 * day, color: '#22c55e', icon: 'graduation' },
  { id: uid('col'), name: 'Browser Engineering', label: 'browser', createdAt: now - 3 * day, color: '#f59e0b', icon: 'globe' },
];

var demoSearchHistory = [
  { id: uid('sh'), query: 'React article I read yesterday', createdAt: now - 2 * h, resultsCount: 5 },
  { id: uid('sh'), query: 'Three.js animation tutorial', createdAt: now - 5 * h, resultsCount: 3 },
  { id: uid('sh'), query: 'AI research this week', createdAt: now - day, resultsCount: 4 },
  { id: uid('sh'), query: 'website about operating systems', createdAt: now - 2 * day, resultsCount: 2 },
];

var EchoTabDemoData = {
  demoPages: demoPages,
  demoSessions: demoSessions,
  demoNotes: demoNotes,
  demoCollections: demoCollections,
  demoSearchHistory: demoSearchHistory,
};
