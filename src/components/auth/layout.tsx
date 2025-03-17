import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
// import { DynamicLogo } from '@/components/core/logo';

export interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100%',
      }}
    >
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
        <Box sx={{ p: 3 }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
            {/* <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} /> */}
          </Box>
        </Box>
        <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center', p: 3 }}>
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%,rgb(82, 42, 2) 0%,rgb(172, 147, 115) 100%)', // Marrón más oscuro y beige medio
          color: 'var(--mui-palette-common-white)',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography
              color="#FFD700"
              sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center', fontWeight: 'bold' }}
              variant="h1"
            >
              Bienvenido a{' '}
              <Box component="span" sx={{ color: '#FFA500', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}>
                sistema de nomina
              </Box>
            </Typography>
            <Typography
              align="center"
              variant="subtitle1"
              sx={{ color: '#EEE8AA', fontWeight: '600', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)' }}
            >
              El frijolito
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component="img"
              alt="Widgets"
              src="/assets/auth-widgets.png"
              sx={{ height: 'auto', width: '100%', maxWidth: '600px' }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
