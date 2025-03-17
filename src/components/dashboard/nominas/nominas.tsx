'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { CaretDown, CaretUp } from '@phosphor-icons/react';

import type { Nomina } from '@/types/nominas';

import { useSelection } from '../../../hooks/use-selection';

interface NominasTableProps {
  count: number;
  page: number;
  rows: Nomina[];
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selected: Set<string>;
  onSelectedChange: (selected: Set<string>) => void;
}

function NominaRow({
  row,
  isSelected,
  onSelect,
}: {
  row: Nomina;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}): React.JSX.Element {
  const [open, setOpen] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(amount);
  };

  const formatNumberWithCommas = (numberString: string) => {
    // Eliminar caracteres no numéricos y puntos decimales
    const number = parseFloat(numberString.replace(/[^0-9.]/g, ''));
    if (isNaN(number)) {
      return numberString; // Devolver la cadena original si no es un número válido
    }
    return number.toLocaleString('es-CO'); // Formatear el número con comas
  };

  const recargos = row.recargos_y_valores
    ? row.recargos_y_valores.split('\n').map((recargo) => {
        const parts = recargo.split(' días $ ');
        if (parts.length === 2) {
          const [tipoDias, valor] = parts;
          const lastSpaceIndex = tipoDias.lastIndexOf(' ');
          if (lastSpaceIndex !== -1) {
            const tipo = tipoDias.substring(0, lastSpaceIndex);
            const dias = tipoDias.substring(lastSpaceIndex + 1);
            return { tipo, dias, valor: formatNumberWithCommas(valor) }; // Formatear el valor
          } 
            return { tipo: tipoDias, dias: '', valor: formatNumberWithCommas(parts[1]) }; // Formatear el valor
          
        } 
          return { tipo: recargo, dias: '', valor: '' };
        
      })
    : [];

  return (
    <React.Fragment>
      {/* Main Row */}
      <TableRow hover selected={isSelected}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={(event) => {
              onSelect(event.target.checked);
            }}
          />
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? <CaretUp /> : <CaretDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.cedula}</TableCell>
        <TableCell>{row.nombres}</TableCell>
        <TableCell>{row.apellidos}</TableCell>
        <TableCell>{row.telefono}</TableCell>
        <TableCell>{row.puesto_trabajo}</TableCell>
        <TableCell>{new Date(row.fecha_inicio).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(row.fecha_fin).toLocaleDateString()}</TableCell>
        <TableCell>{formatCurrency(row.total_pagado)}</TableCell>
      </TableRow>

      {/* Expanded Details */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Detalles de la nómina
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Descuentos</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Subsidios</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Tipo Recargo</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Días</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Valor Quincena</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recargos.map((recargo, index) => (
                    <TableRow key={index}>
                      {index === 0 && (
                        <>
                          <TableCell sx={{ whiteSpace: 'pre-wrap' }} rowSpan={recargos.length}>
                            {row.descuentos_aplicados || 'No hay descuentos aplicados'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'pre-wrap' }} rowSpan={recargos.length}>
                            {row.subsidios_aplicados || 'No hay subsidios aplicados'}
                          </TableCell>
                        </>
                      )}
                      <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{recargo.tipo}</TableCell>
                      <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{recargo.dias}</TableCell>
                      <TableCell sx={{ whiteSpace: 'pre-wrap' }}>$ {recargo.valor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function NominasTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  onPageChange,
  onRowsPerPageChange,
  selected,
  onSelectedChange,
}: NominasTableProps): React.JSX.Element {
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

  const selectedSome = selected.size > 0 && selected.size < rows.length;

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
                <strong>Fecha inicio</strong>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <strong>Fecha fin</strong>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap', py: 1 }}>
                <strong>Total pagado</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <NominaRow
                key={row.cedula}
                row={row}
                isSelected={selected.has(row.id.toString())}
                onSelect={(checked) => {
                  if (checked) {
                    selectOne(row.id.toString());
                  } else {
                    deselectOne(row.id.toString());
                  }
                }}
              />
            ))}
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
