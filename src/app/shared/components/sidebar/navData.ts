export interface NavItem {
  routeLink: string;
  icon: string;
  label: string;
  roles: string[];
}

export const navbarData: NavItem[] = [
  {
    routeLink: '/Dashboard/Staff',
    icon: 'group',
    label: 'Staff',
    roles: ['Admin'],
  },
  {
    routeLink: '/Dashboard/Categories',
    icon: 'category',
    label: 'Menu',
    roles: ['Admin'],
  },
  {
    routeLink: '/Dashboard/Dishes',
    icon: 'restaurant_menu',
    label: 'Dishes',
    roles: ['Admin'],
  },
  {
    routeLink: '/Dashboard/Orders',
    icon: 'receipt_long',
    label: 'Orders',
    roles: ['Admin', 'Chef'],
  },
];
