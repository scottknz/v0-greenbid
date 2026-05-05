export interface NavItem {
  label: string;
  href: string;
  icon: string;
  section: 'main' | 'secondary';
  badge?: boolean;
  badgeCount?: number;
  isChatTrigger?: boolean;
}

export const buyerNav: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard', section: 'main' },
  { label: 'RFPs', href: '/tenders', icon: 'FileText', section: 'main' },
  { label: 'Suppliers', href: '/suppliers', icon: 'Users', section: 'main' },
  { label: 'Messages', href: '/messages', icon: 'Mail', section: 'main', badgeCount: 2 },
  { label: 'Evaluations', href: '/evaluations', icon: 'ClipboardList', section: 'main' },
  { label: 'AI Copilot', href: '#', icon: 'MessageSquare', section: 'secondary', isChatTrigger: true },
  { label: 'Marketplace', href: '/marketplace', icon: 'Library', section: 'secondary' },
  { label: 'Settings', href: '/settings', icon: 'Settings', section: 'secondary' },
];

export const supplierNav: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard', section: 'main' },
  { label: 'Open RFPs', href: '/tenders', icon: 'FolderOpen', section: 'main' },
  { label: 'My Proposals', href: '/submissions', icon: 'Upload', section: 'main' },
  { label: 'Saved RFPs', href: '/saved', icon: 'Star', section: 'main' },
  { label: 'AI Copilot', href: '#', icon: 'MessageSquare', section: 'secondary', isChatTrigger: true },
  { label: 'Notifications', href: '/notifications', icon: 'Bell', section: 'secondary' },
  { label: 'Settings', href: '/settings', icon: 'Settings', section: 'secondary' },
];
