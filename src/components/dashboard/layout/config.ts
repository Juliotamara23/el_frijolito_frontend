import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'empleados', title: 'Empleados', href: paths.dashboard.empleados, icon: 'users' },
  { key: 'nominas', title: 'Reporte de nominas', href: paths.dashboard.nominas, icon: 'chart-pie' },
  { key: 'configuraciones', title: 'Configuraciones', href: paths.dashboard.confguraciones, icon: 'gear-six' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
