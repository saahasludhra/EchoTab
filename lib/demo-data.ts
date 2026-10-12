// Shared demo data for the website (Home preview + Live Demo page).
// Mirrors the extension's demo data so the on-site demo feels consistent.

const now = Date.now();
const day = 86_400_000;
const h = 3_600_000;

export type DemoPage = {
  id: string;
  url: string;
  title: string;
  domain: string;
  summary: string;
  tags: string[];
  collection: string;
  visitedAt: number;
  visitCount: number;
  readingTime: number;
  favIcon: string;
};

export const demoPages: DemoPage[] = [
  {
    id: 'pg1',
    url: 'https://react.dev/learn/thinking-in-react',
    title: 'Thinking in React',
    domain: 'react.dev',
    summary:
      "Step-by-step guide to React's component-based mental model: break UI into a component hierarchy, build a static version, then add state and data flow.",
    tags: ['react', 'frontend', 'components', 'state', 'tutorial'],
    collection: 'Frontend Fundamentals',
    visitedAt: now - day - 2 * h,
    visitCount: 3,
    readingTime: 720,
    favIcon: 'https://www.google.com/s2/favicons?domain=react.dev&sz=64',
  },
  {
    id: 'pg2',
    url: 'https://threejs-journey.com/lessons/animation-system',
    title: 'The Animation System — Three.js Journey',
    domain: 'threejs-journey.com',
    summary:
      'Deep dive into Three.js animation system: keyframes, animation clips, mixing actions, and easing with GSAP-style control.',
    tags: ['three.js', 'animation', 'webgl', 'tutorial', '3d'],
    collection: 'Graphics & Animation',
    visitedAt: now - 2 * day,
    visitCount: 5,
    readingTime: 1500,
    favIcon: 'https://www.google.com/s2/favicons?domain=threejs-journey.com&sz=64',
  },
  {
    id: 'pg3',
    url: 'https://arxiv.org/abs/2304.03442',
    title: 'Direct Preference Optimization: Your Language Model is Secretly a Reward Model',
    domain: 'arxiv.org',
    summary:
      'Landmark AI research paper introducing DPO, a method to align language models with human preferences without a separate reward model or RLHF.',
    tags: ['ai', 'research', 'llm', 'alignment', 'paper'],
    collection: 'AI Research',
    visitedAt: now - 2 * h,
    visitCount: 2,
    readingTime: 2400,
    favIcon: 'https://www.google.com/s2/favicons?domain=arxiv.org&sz=64',
  },
  {
    id: 'pg4',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    title: 'Operating Systems: Three Easy Pieces (OSTEP)',
    domain: 'pages.cs.wisc.edu',
    summary:
      'Free online textbook covering operating systems via three conceptual pieces: virtualization, concurrency, and persistence.',
    tags: ['operating systems', 'cs', 'textbook', 'systems', 'course'],
    collection: 'CS Coursework',
    visitedAt: now - 3 * day - 4 * h,
    visitCount: 8,
    readingTime: 3600,
    favIcon: 'https://www.google.com/s2/favicons?domain=pages.cs.wisc.edu&sz=64',
  },
  {
    id: 'pg5',
    url: 'https://openai.com/research/gpt-4',
    title: 'GPT-4 Technical Report',
    domain: 'openai.com',
    summary:
      'OpenAI technical report on GPT-4 capabilities, evaluation across exams, and safety. References large multimodal model benchmarks.',
    tags: ['ai', 'research', 'gpt-4', 'openai', 'paper'],
    collection: 'AI Research',
    visitedAt: now - 1 * h,
    visitCount: 4,
    readingTime: 1800,
    favIcon: 'https://www.google.com/s2/favicons?domain=openai.com&sz=64',
  },
  {
    id: 'pg6',
    url: 'https://web.dev/learn/css/layout',
    title: 'Learn CSS: Layout',
    domain: 'web.dev',
    summary:
      'web.dev guide to modern CSS layout: flexbox, grid, container queries, and responsive design patterns.',
    tags: ['css', 'frontend', 'layout', 'flexbox', 'grid'],
    collection: 'Frontend Fundamentals',
    visitedAt: now - 4 * day,
    visitCount: 6,
    readingTime: 900,
    favIcon: 'https://www.google.com/s2/favicons?domain=web.dev&sz=64',
  },
  {
    id: 'pg7',
    url: 'https://developer.chrome.com/docs/extensions/mv3/intro/',
    title: 'Extensions architecture — Chrome Developers',
    domain: 'developer.chrome.com',
    summary:
      'Official docs on Manifest V3 extension architecture: service workers, content scripts, action popup, and the messaging bridge between them.',
    tags: ['chrome', 'extensions', 'mv3', 'tutorial', 'reference'],
    collection: 'Browser Engineering',
    visitedAt: now - 5 * day,
    visitCount: 7,
    readingTime: 1200,
    favIcon: 'https://www.google.com/s2/favicons?domain=developer.chrome.com&sz=64',
  },
  {
    id: 'pg8',
    url: 'https://huggingface.co/blog/rlhf',
    title: 'Illustrating Reinforcement Learning from Human Feedback (RLHF)',
    domain: 'huggingface.co',
    summary:
      'Visual explainer of RLHF: reward modeling, policy optimization, and alignment of language models.',
    tags: ['ai', 'research', 'rlhf', 'alignment', 'llm'],
    collection: 'AI Research',
    visitedAt: now - 8 * h,
    visitCount: 3,
    readingTime: 1200,
    favIcon: 'https://www.google.com/s2/favicons?domain=huggingface.co&sz=64',
  },
  {
    id: 'pg9',
    url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html',
    title: 'TypeScript in 5 minutes',
    domain: 'typescriptlang.org',
    summary:
      'Quick tour of TypeScript types, interfaces, and structural typing — a frontend fundamentals reference.',
    tags: ['typescript', 'frontend', 'types', 'reference'],
    collection: 'Frontend Fundamentals',
    visitedAt: now - 7 * day,
    visitCount: 9,
    readingTime: 300,
    favIcon: 'https://www.google.com/s2/favicons?domain=typescriptlang.org&sz=64',
  },
  {
    id: 'pg10',
    url: 'https://www.freecodecamp.org/news/how-to-build-a-todo-app-with-react/',
    title: 'How to Build a Todo App with React',
    domain: 'freecodecamp.org',
    summary:
      'Beginner React tutorial building a todo app with hooks: useState, useReducer, and component composition.',
    tags: ['react', 'tutorial', 'frontend', 'hooks', 'project'],
    collection: 'Frontend Fundamentals',
    visitedAt: now - day + 1 * h,
    visitCount: 2,
    readingTime: 900,
    favIcon: 'https://www.google.com/s2/favicons?domain=freecodecamp.org&sz=64',
  },
];

export type DemoCollection = {
  id: string;
  name: string;
  label: string;
  color: string;
  icon: string;
};

export const demoCollections: DemoCollection[] = [
  { id: 'col1', name: 'Frontend Fundamentals', label: 'frontend', color: '#3b82f6', icon: 'code' },
  { id: 'col2', name: 'AI Research', label: 'ai', color: '#06b6d4', icon: 'brain' },
  { id: 'col3', name: 'Graphics & Animation', label: 'graphics', color: '#a855f7', icon: 'box' },
  { id: 'col4', name: 'CS Coursework', label: 'course', color: '#22c55e', icon: 'graduation' },
  { id: 'col5', name: 'Browser Engineering', label: 'browser', color: '#f59e0b', icon: 'globe' },
];

export const demoSessions = [
  {
    id: 'sess1',
    title: 'React component patterns deep dive',
    label: 'Frontend Fundamentals',
    startedAt: now - day,
    endedAt: now - day + 2 * h,
    pageIds: ['pg1', 'pg10'],
    tabCount: 6,
    summary:
      'Explored composition, state lifting, and hooks patterns across the React docs and a todo app tutorial.',
  },
  {
    id: 'sess2',
    title: 'AI alignment reading marathon',
    label: 'AI Research',
    startedAt: now - 4 * h,
    endedAt: now - 1 * h,
    pageIds: ['pg3', 'pg5', 'pg8'],
    tabCount: 9,
    summary:
      'Read DPO, GPT-4 report, and RLHF explainer back-to-back to understand modern alignment techniques.',
  },
  {
    id: 'sess3',
    title: 'Three.js animation build session',
    label: 'Graphics & Animation',
    startedAt: now - 2 * day,
    endedAt: now - 2 * day + 3 * h,
    pageIds: ['pg2'],
    tabCount: 4,
    summary:
      'Followed the Three.js Journey animation lesson and cross-referenced the GitHub repo for API examples.',
  },
];

export const demoNotes = [
  {
    id: 'note1',
    pageId: 'pg1',
    title: 'Key React principles',
    body: '1. Single source of truth for state.\n2. State flows down, events flow up.\n3. Lift state only when siblings need it.\n4. Think in components, render with data.',
    tags: ['react', 'state'],
    createdAt: now - day,
  },
  {
    id: 'note2',
    pageId: 'pg3',
    title: 'DPO one-liner',
    body: 'DPO removes the need for a separate reward model — the LM itself becomes the reward model via a preference classification objective.',
    tags: ['ai', 'dpo'],
    createdAt: now - 2 * h,
  },
  {
    id: 'note3',
    pageId: 'pg4',
    title: 'OS three pieces',
    body: 'Virtualization (CPU/memory), Concurrency (threads/locks), Persistence (filesystem/RAID). Map every OS topic onto one of these.',
    tags: ['os', 'course'],
    createdAt: now - 3 * day,
  },
];

export function timeAgo(ts: number): string {
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export const searchExamples = [
  'React article I read yesterday',
  'Three.js animation tutorial',
  'AI research this week',
  'website about operating systems',
];
