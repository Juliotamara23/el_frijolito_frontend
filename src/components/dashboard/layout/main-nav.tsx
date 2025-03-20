'use client';

import * as React from 'react';
import Link from 'next/link';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { paths } from '@/paths';
import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false); // Estado para mostrar u ocultar el campo de búsqueda
  const [searchTerm, setSearchTerm] = React.useState<string>(''); // Estado del texto ingresado en búsqueda
  const userPopover = usePopover<HTMLDivElement>();

  // Opciones de la aplicación
  const options = React.useMemo(
    () => [
      { label: 'Dashboard', path: paths.dashboard.overview },
      { label: 'Empleados', path: paths.dashboard.empleados },
      { label: 'Nóminas', path: paths.dashboard.nominas },
      { label: 'Nueva Nómina', path: paths.dashboard.newNomina },
      { label: 'Nuevo Empleado', path: paths.dashboard.newEmpleado },
      { label: 'Configuraciones', path: paths.dashboard.confguraciones },
    ],
    []
  );

  // Filtrar opciones según el término de búsqueda
  const filteredOptions = React.useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  );

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={() => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>

            {/* Botón de búsqueda */}
            <Tooltip title="Search">
              <IconButton
                onClick={() => {
                  setSearchOpen((prev) => !prev);
                }}
              >
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>

            {/* Input de búsqueda (aparece cuando se activa) */}
            {searchOpen ? (
              <TextField
                size="small"
                variant="outlined"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                sx={{ ml: 2, width: 200 }}
              />
            ) : null}
          </Stack>

          {/* Notificaciones y usuario */}
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/auth-widgets.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>

        {/* Resultados de búsqueda */}
        {searchOpen && searchTerm !== '' ? (
          <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 1, boxShadow: 2 }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Box key={option.label} sx={{ padding: 1 }}>
                  <Link href={option.path} passHref style={{ textDecoration: 'none' }}>
                    <Box
                      sx={{
                        cursor: 'pointer',
                        color: 'text.primary',
                      }}
                    >
                      <Typography variant="h6">{option.label}</Typography>
                    </Box>
                  </Link>
                </Box>
              ))
            ) : (
              <Box sx={{ padding: 1, color: 'gray' }}>No se encontraron resultados</Box>
            )}
          </Box>
        ) : null}
      </Box>

      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={() => {
          userPopover.handleClose();
        }}
        open={userPopover.open}
      />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
