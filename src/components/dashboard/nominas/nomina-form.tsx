'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

import { type Empleado } from '@/types/empleados';
import { type QuincenaValorCreate, type ReporteNominaCreate } from '@/types/reporte-nominas';
import { tiposRecargos } from '@/types/tipos-recargos';
import { useEmpleados } from '@/hooks/use-empleados';
import { useNomina } from '@/hooks/use-reporte-nomina';
import { NominaResultModal } from '@/components/modal/nomina-result-modal';

export function NominaForm(): React.JSX.Element {
  const { empleados, isLoading: empleadosIsLoading, error: empleadosError, fetchEmpleados, setError } = useEmpleados();
  const [_empleado, setEmpleado] = useState<Empleado | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [tieneSubsidio, setTieneSubsidio] = useState<boolean>(false);
  const [quincenaValores, setQuincenaValores] = useState<QuincenaValorCreate[]>([]);
  const [selectedRecargos, setSelectedRecargos] = useState<number[]>([]);
  const [selectedDescuentos, _setSelectedDescuentos] = useState<number[]>([1, 2]); // IDs fijos para salud y pensión
  const [_selectedSubsidios, setSelectedSubsidios] = useState<number[]>([]);
  const { createNomina, isLoading, error } = useNomina();
  const errorMessage = error as Error | string | null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  useEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        await fetchEmpleados();
      } catch (fetchError) {
        setError("Error fetching empleados");
      }
    }
    fetchData().catch(() => {
      setError("Error en fetchData");
    });
  }, [fetchEmpleados, setError]);

  const resetForm = (): void => {
    setEmpleado(null);
    setFechaInicio(null);
    setFechaFin(null);
    setFormError(null);
    setTieneSubsidio(false);
    setQuincenaValores([]);
    setSelectedRecargos([]);
    setSelectedSubsidios([]);
  };

  const handleFechaInicioChange = (date: dayjs.Dayjs | null): void => {
    if (date) {
      // Set time to start of day (00:00:00)
      const startDate = date.startOf('day');
      setFechaInicio(startDate.toDate());
      // Set end date 15 days ahead, also at start of day
      setFechaFin(startDate.add(15, 'day').startOf('day').toDate());
    }
  };

  const handleSubsidioChange = (e: SelectChangeEvent): void => {
    const hasSubsidio = e.target.value === 'true';
    setTieneSubsidio(hasSubsidio);
    setSelectedSubsidios(hasSubsidio ? [1] : []); // ID 1 para subsidio de transporte
  };

  const handleRecargoChange = (recargoId: number, dias: number): void => {
    const updatedValores = [...quincenaValores];
    const index = updatedValores.findIndex((v) => v.tipo_recargo_id === recargoId);

    if (dias <= 0) {
      // Remueve el recargo si la cantidad de días es 0 o negativa
      if (index >= 0) {
        updatedValores.splice(index, 1);
        setQuincenaValores(updatedValores);
        // Remueve el recargo de la lista de seleccionados
        setSelectedRecargos(selectedRecargos.filter((id) => id !== recargoId));
      }
      return;
    }

    if (index >= 0) {
      updatedValores[index] = {
        ...updatedValores[index],
        cantidad_dias: dias,
      };
    } else {
      updatedValores.push({
        tipo_recargo_id: recargoId,
        cantidad_dias: dias,
        valor_quincena: 0.0,
      });
    }

    setQuincenaValores(updatedValores);
    setSelectedRecargos(Array.from(new Set([...selectedRecargos, recargoId])));
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    if (!_empleado) {
      setAlertMessage('Debe seleccionar un empleado');
      setAlertOpen(true);
      return false;
    }
    if (!fechaInicio || !fechaFin) {
      setAlertMessage('Debe seleccionar las fechas de inicio y fin');
      setAlertOpen(true);
      return false;
    }
    if (quincenaValores.length === 0) {
      setAlertMessage('Debe ingresar al menos un tipo de recargo');
      setAlertOpen(true);
      return false;
    }
    // Validar que los días estén dentro del rango permitido
    const invalidDias = quincenaValores.some((valor) => valor.cantidad_dias < 0 || valor.cantidad_dias > 31);
    if (invalidDias) {
      setAlertMessage('Los días deben estar entre 0 y 31');
      setAlertOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (!_empleado || !fechaInicio || !fechaFin) {
        throw new Error('Datos del formulario incompletos');
      }

      const nominaData: ReporteNominaCreate = {
        empleado_id: _empleado.id.toString(),
        cedula: _empleado.cedula.toString(),
        nombres: _empleado.nombres,
        apellidos: _empleado.apellidos,
        telefono: _empleado.telefono,
        puesto_trabajo: _empleado.puesto_trabajo,
        fecha_inicio: dayjs(fechaInicio).format('YYYY-MM-DD'),
        fecha_fin: dayjs(fechaFin).format('YYYY-MM-DD'),
        quincena_valores: quincenaValores.map((valor) => ({
          ...valor,
          valor_quincena: Number(valor.valor_quincena.toFixed(2)),
        })),
        recargos: selectedRecargos,
        descuentos: selectedDescuentos,
        subsidios: tieneSubsidio ? [1] : [],
      };

      const result = await createNomina(nominaData);
      if (result) {
        setFormError(null);
        setIsSuccess(true);
        setIsModalOpen(true);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al enviar el formulario');
      setIsSuccess(false);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader title="Crear Nómina" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              {/* Empleado Select */}
              <Grid xs={12} md={6}>
                {empleadosIsLoading ? ( // Mostrar un indicador de carga
                  <Typography>Cargando empleados...</Typography>
                ) : empleadosError ? ( // Mostrar un mensaje de error
                  <Typography color="error">{empleadosError}</Typography>
                ) : empleados.length > 0 ? (
                  <Autocomplete
                    options={empleados}
                    getOptionLabel={(option: Empleado) => `${option.cedula} - ${option.nombres} ${option.apellidos}`}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        setEmpleado(newValue);
                      } else {
                        setEmpleado(null);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Empleado"
                        placeholder="Buscar por cédula, nombre o apellido"
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        {option.cedula} - {option.nombres} {option.apellidos} - {option.puesto_trabajo}
                      </li>
                    )}
                    filterOptions={(options, { inputValue }) => {
                      const searchTerm = inputValue.toLowerCase();
                      return options.filter(
                        (option) =>
                          option.cedula.toString().includes(searchTerm) ||
                          option.nombres.toLowerCase().includes(searchTerm) ||
                          option.apellidos.toLowerCase().includes(searchTerm)
                      );
                    }}
                  />
                ) : (
                  <Typography variant="body2">No hay empleados registrados</Typography>
                )}
              </Grid>

              {/* Fecha Inicio */}
              <Grid xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha Inicio"
                    value={fechaInicio ? dayjs(fechaInicio) : null}
                    onChange={handleFechaInicioChange}
                    maxDate={fechaFin ? dayjs(fechaFin) : undefined}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Fecha Fin */}
              <Grid xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha Fin"
                    value={fechaFin ? dayjs(fechaFin) : null}
                    onChange={(date) => {
                      setFechaFin(date?.toDate() ?? null);
                    }}
                    minDate={fechaInicio ? dayjs(fechaInicio) : undefined}
                    disabled={!fechaInicio}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Tipos de Recargo */}
              {tiposRecargos.map((recargo) => (
                <Grid xs={12} md={6} key={recargo.id}>
                  <TextField
                    label={recargo.tipo_hora}
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 31 } }}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                      handleRecargoChange(recargo.id, value);
                    }}
                    fullWidth
                  />
                </Grid>
              ))}

              {/* Descuentos - Read only */}
              <Grid xs={12} md={6}>
                <TextField
                  label="Descuentos"
                  value="Salud y Pensión (Aplicados)"
                  disabled
                  fullWidth
                  helperText={`IDs: ${selectedDescuentos.join(', ')}`}
                />
              </Grid>

              {/* Subsidios */}
              <Grid xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Subsidios</InputLabel>
                  <Select
                    onChange={(e: SelectChangeEvent) => {
                      handleSubsidioChange(e);
                    }}
                  >
                    <MenuItem value="true">Si</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                  <FormHelperText>{tieneSubsidio ? 'Subsidio de transporte aplicado' : 'Sin subsidios'}</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => {
              setAlertOpen(false);
            }}
          >
            <Alert
              onClose={() => {
                setAlertOpen(false);
              }}
              severity="error"
              sx={{ width: '100%' }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button variant="contained" type="submit" disabled={isLoading || !_empleado || !fechaInicio || !fechaFin}>
              {isLoading ? 'Calculando...' : 'Calcular Nómina'}
            </Button>
          </CardActions>
        </Card>
      </form>
      <NominaResultModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        isSuccess={isSuccess}
        errorMessage={formError || errorMessage?.toString()}
        onReset={resetForm}
      />
    </>
  );
}