export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    newNomina: '/dashboard/nominas/newNomina',
    newEmpleado: '/dashboard/empleados/newEmpleado',
    empleados: '/dashboard/empleados',
    nominas: '/dashboard/nominas',
    updateNomina: '/dashboard/nominas/updateNomina',
    updateEmpleado: '/dashboard/empleados/updateEmpleado',
    confguraciones: '/dashboard/configuraciones',
  },
  errors: { notFound: '/errors/not-found' },
} as const;