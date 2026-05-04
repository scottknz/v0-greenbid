export interface NavItem {
  label: string;
  href: string;
  icon: string;
  section: 'main' | 'secondary';
  badge?: boolean;
  isChatTrigger?: boolean;
}

export const buyerNav: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard', section: 'main' },
  { label: 'New Tender', href: '/tenders/new', icon: 'FileText', section: 'main', badge: true },
  { label: 'Evaluate Tender', href: '/evaluate', icon: 'ClipboardList', section: 'main' },
  { label: 'Audit History', href: '/audit', icon: 'Shield', section: 'main' },
  { label: 'AI Copilot', href: '#', icon: 'MessageSquare', section: 'secondary', isChatTrigger: true },
  { label: 'Marketplace', href: '/marketplace', icon: 'Library', section: 'secondary' },
  { label: 'Settings', href: '/settings', icon: 'Settings', section: 'secondary' },
];

export const supplierNav: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard', section: 'main' },
  { label: 'Open Tenders', href: '/tenders', icon: 'FolderOpen', section: 'main' },
  { label: 'My Submissions', href: '/submissions', icon: 'Upload', section: 'main' },
  { label: 'Saved Tenders', href: '/saved', icon: 'Star', section: 'main' },
  { label: 'AI Copilot', href: '#', icon: 'MessageSquare', section: 'secondary', isChatTrigger: true },
  { label: 'Notifications', href: '/notifications', icon: 'Bell', section: 'secondary' },
  { label: 'Settings', href: '/settings', icon: 'Settings', section: 'secondary' },
];
