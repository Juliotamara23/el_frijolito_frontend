import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '../../../../config';
import { EmpleadoForm } from '../../../../components/dashboard/empleados/empleado-form';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Nuevo empleado</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={20} md={6} xs={12}>
          <EmpleadoForm />
        </Grid>
      </Grid>
    </Stack>
  );
}
