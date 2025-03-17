'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useSelection } from '@/hooks/use-selection';
import type { Empleado } from '../../../types/empleados';

interface EmpleadosTableProps {
  count?: number;
  page?: number;
  rows?: Empleado[];
  rowsPerPage?: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selected: Set<string>;
  onSelectedChange: (selected: Set<string>) => void;
}

export function EmpleadosTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
  selected,
  onSelectedChange,
}: EmpleadosTableProps): React.JSX.Element {
  const {
    selectAll,
    deselectAll,
    selectOne,
    deselectOne,
    selectedAll: isAllSelected,
  } = useSelection({
    keys: rows.map((row) => row.id.toString()),
    selected,
    onSelectedChange,
  });

  const selectedSome = selected?.size > 0 && selected?.size < rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px', whiteSpace: 'nowrap' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{ width: 48 }} />
              <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <strong>Cédula</strong>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <strong>Nombres</strong>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <strong>Apellidos</strong>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <strong>Teléfono</strong>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <strong>Puesto de trabajo</strong>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <strong>Salario base</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id.toString());
              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox" sx={{ whiteSpace: 'nowrap', py: 1 }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id.toString());
                        } else {
                          deselectOne(row.id.toString());
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ width: 48 }} />
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>{row.cedula}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Typography variant="subtitle2">{row.nombres}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>{row.apellidos}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>{row.telefono}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>{row.puesto_trabajo}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                    {new Intl.NumberFormat('es-CO', {
                      style: 'currency',
                      currency: 'COP',
                    }).format(row.salario_base)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}