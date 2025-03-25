'use client';

import * as React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { PencilSimpleLine as UpdateIcon } from '@phosphor-icons/react/dist/ssr/PencilSimpleLine';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { type Nomina } from '@/types/nominas';
import { paths } from '@/paths';
import { DeleteConfirmationModal } from '@/components/modal/nomina-delete-modal';

import { NominasTable } from '../../../components/dashboard/nominas/nominas';
import { NominasFilters } from '../../../components/dashboard/nominas/nominas-filters';
import { useNominas } from '../../../hooks/use-nomina';

export default function Page(): React.JSX.Element {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('id');
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const { nominas, deleteNominas, isLoading, fetchNominas } = useNominas();

  React.useEffect(() => {
    fetchNominas().catch((error: unknown) => {
      // TODO: Replace with proper error logging service
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch nominas: ${errorMessage}`);
    });
  }, [fetchNominas]);

  const handleDeleteConfirm = async (): Promise<void> => {
    const itemsToDelete = Array.from(selectedItems);
    const success = await deleteNominas(itemsToDelete);

    if (success) {
      setSelectedItems(new Set()); // Clear selection after successful deletion
    }

    setIsDeleteModalOpen(false);
  };

  const filteredNominas = React.useMemo(() => {
    return nominas.filter((nomina: Nomina) => {
      const value = String(nomina[searchField as keyof Nomina]).toLowerCase();
      return value.includes(searchTerm.toLowerCase());
    });
  }, [nominas, searchTerm, searchField]);

  const paginatedNominas = applyPagination(filteredNominas, page, rowsPerPage);

  const handleSearch = (newSearchTerm: string, newSearchField: string): void => {
    setSearchTerm(newSearchTerm);
    setSearchField(newSearchField);
    setPage(0);
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
          <Typography variant="h4">Reporte de nominas</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />} disabled>
              Importar
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />} disabled>
              Exportar
            </Button>
            {selectedItems.size === 1 && (
              <Button
                color="primary"
                startIcon={<UpdateIcon fontSize="var(--icon-fontSize-md)" />}
                component={Link}
                href={paths.dashboard.updateNomina.replace(':id', Array.from(selectedItems)[0])}
                disabled={isLoading}
              >
                Actualizar
              </Button>
            )}
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
          <Link href={paths.dashboard.newNomina} style={{ textDecoration: 'none' }}>
            <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
              Agregar
            </Button>
          </Link>
        </div>
      </Stack>
      <NominasFilters onSearch={handleSearch} />
      <NominasTable
        count={filteredNominas.length}
        page={page}
        rows={paginatedNominas}
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
