export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    newNomina: '/dashboard/nominas/newNomina',
    newEmpleado: '/dashboard/empleados/newEmpleado',
    empleados: '/dashboard/empleados',
    nominas: '/dashboard/nominas',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
} as const;