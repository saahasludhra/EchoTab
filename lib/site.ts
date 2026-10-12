import {
  Home,
  Sparkles,
  PlayCircle,
  BookOpen,
  Download,
  Network,
  HelpCircle,
  GitBranch,
  Map,
  Shield,
  Mail,
  User,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Features', href: '/features', icon: Sparkles },
  { label: 'Live Demo', href: '/demo', icon: PlayCircle },
  { label: 'Docs', href: '/docs', icon: BookOpen },
  { label: 'Install', href: '/install', icon: Download },
  { label: 'Architecture', href: '/architecture', icon: Network },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'Roadmap', href: '/roadmap', icon: Map },
  { label: 'Changelog', href: '/changelog', icon: GitBranch },
  { label: 'Privacy', href: '/privacy', icon: Shield },
  { label: 'Creator', href: '/creator', icon: User },
  { label: 'Contact', href: '/contact', icon: Mail },
];

export const siteConfig = {
  name: 'EchoTab',
  tagline: 'AI-powered memory for your browser',
  description:
    'EchoTab turns your browser history, bookmarks, tabs, and notes into an intelligent searchable memory. Search naturally, organize automatically, and stay private.',
  url: 'https://echotab.app',
  downloadUrl: '/EchoTab.zip',
  version: '1.0.1',
  creator: {
    name: 'Saahas Ludhra',
    school: 'Army Public School, Wellington, Coonoor',
    role: 'Aspiring Computer Science Student',
  },
};
