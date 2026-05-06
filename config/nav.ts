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
  { label: 'Team', href: '/buyer/team', icon: 'UsersRound', section: 'main' },
  { label: 'RFPs', href: '/tenders', icon: 'FileText', section: 'main' },
  { label: 'Templates', href: '/evaluations', icon: 'ClipboardList', section: 'main' },
  { label: 'Library', href: '/buyer/library', icon: 'BookOpen', section: 'main' },
  { label: 'Suppliers', href: '/buyer/suppliers', icon: 'Users', section: 'main' },
  { label: 'Messages', href: '/messages', icon: 'Mail', section: 'main', badgeCount: 2 },
  { label: 'AI Copilot', href: '#', icon: 'MessageSquare', section: 'secondary', isChatTrigger: true },
  { label: 'Marketplace', href: '/marketplace', icon: 'Library', section: 'secondary' },
  { label: 'Settings', href: '/settings', icon: 'Settings', section: 'secondary' },
];

export const supplierNav: NavItem[] = [
  { label: 'Dashboard', href: '/supplier', icon: 'LayoutDashboard', section: 'main' },
  { label: 'Team', href: '/supplier/team', icon: 'UsersRound', section: 'main' },
  { label: 'RFPs', href: '/supplier/rfps', icon: 'FileText', section: 'main' },
  { label: 'Library', href: '/supplier/library', icon: 'BookOpen', section: 'main' },
  { label: 'Activity Log', href: '/supplier/activity', icon: 'ClipboardList', section: 'main' },
  { label: 'Messages', href: '/supplier/messages', icon: 'Mail', section: 'main' },
  { label: 'Marketplace', href: '/marketplace', icon: 'Library', section: 'secondary' },
  { label: 'Settings', href: '/settings', icon: 'Settings', section: 'secondary' },
];
