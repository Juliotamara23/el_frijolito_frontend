'use client';

import * as React from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from '@/paths';
import { useEmpleados } from '@/hooks/use-empleados';
import { DeleteConfirmationModal } from '@/components/modal/nomina-delete-modal';

import { EmpleadosTable } from '../../../components/dashboard/empleados/empleados';
import { EmpleadosFilters } from '../../../components/dashboard/empleados/empleados-filters';

export default function Page(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('cedula');
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const { empleados, deleteEmpleados, isLoading, fetchEmpleados } = useEmpleados();

  React.useEffect(() => {
    fetchEmpleados().catch((error: unknown) => {
      // TODO: Replace with proper error logging service
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch empleados: ${errorMessage}`);
    });
  }, [fetchEmpleados]);

  const handleDeleteConfirm = async () => {
    const itemsToDelete = Array.from(selectedItems);
    const success = await deleteEmpleados(itemsToDelete);

    if (success) {
      setSelectedItems(new Set()); // Clear selection after successful deletion
    }

    setIsDeleteModalOpen(false);
  };

  const filteredEmpleados = React.useMemo(() => {
    return empleados.filter((empleado) => {
      if (!searchTerm) return true;

      const value = String(empleado[searchField as keyof typeof empleado])
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const term = searchTerm
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      return value.includes(term);
    });
  }, [empleados, searchTerm, searchField]);

  const paginatedEmpleado = applyPagination(filteredEmpleados, page, rowsPerPage);

  const handleSearch = (newSearchTerm: string, newSearchField: string) => {
    setSearchTerm(newSearchTerm);
    setSearchField(newSearchField);
    setPage(0); // Reset page when search changes
  };

  const handlePageChange = (_event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Empleados</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Importar
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Exportar
            </Button>
            {selectedItems.size > 0 && (
              <Button
                color="error"
                startIcon={<TrashIcon fontSize="var(--icon-fontSize-md)" />}
                onClick={() => {
                  setIsDeleteModalOpen(true);
                }}
                disabled={isLoading}
              >
                Eliminar ({selectedItems.size})
              </Button>
            )}
          </Stack>
        </Stack>
        <div>
          <Link href={paths.dashboard.newEmpleado} style={{ textDecoration: 'none' }}>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
              Agregar
            </Button>
          </Link>
        </div>
      </Stack>
      <EmpleadosFilters onSearch={handleSearch} />
      <EmpleadosTable
        count={filteredEmpleados.length}
        page={page}
        rows={paginatedEmpleado}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        selected={selectedItems}
        onSelectedChange={setSelectedItems}
      />
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteConfirm}
        count={selectedItems.size}
      />
    </Stack>
  );
}

function applyPagination<T>(rows: T[], page: number, rowsPerPage: number): T[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
