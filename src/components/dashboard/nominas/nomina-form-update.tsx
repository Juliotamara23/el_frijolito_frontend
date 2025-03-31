'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Alert from '@mui/material/Alert';
// import Autocomplete from '@mui/material/Autocomplete';
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

import { useUpdateNomina } from '@/hooks/use-update-nomina';

// import { useEmpleados } from '../../../hooks/use-empleados';
import { useNominaById } from '../../../hooks/use-update-nomina-form';
// import { type Empleado } from '../../../types/empleados';
import { type QuincenaValorCreate, type ReporteNominaUpdate } from '../../../types/reporte-nominas';
import { tiposRecargos } from '../../../types/tipos-recargos';
import { NominaResultModal } from '../../modal/nomina-update-modal';

export function NominaUpdateForm(): React.JSX.Element {
  const params = useParams();
  const nominaId = params.id as string;
  // const { empleados, isLoading: empleadosIsLoading, error: empleadosError } = useEmpleados();
  const { getNominaById, isLoading: _nominaIsLoading, nomina } = useNominaById();
  const { updateNomina, isLoading: _isUpdating, error } = useUpdateNomina();

  const [empleado, setEmpleado] = useState<{
    id: string;
    cedula: string;
    nombres: string;
    apellidos: string;
  } | null>(null);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [tieneSubsidio, setTieneSubsidio] = useState<boolean>(false);
  const [quincenaValores, setQuincenaValores] = useState<QuincenaValorCreate[]>([]);
  const [selectedRecargos, setSelectedRecargos] = useState<number[]>([]);
  const [selectedDescuentos, _setSelectedDescuentos] = useState<number[]>([1, 2]);
  const [_selectedSubsidios, setSelectedSubsidios] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Primer useEffect - Solo para cargar datos iniciales
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        await getNominaById(nominaId);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Error al cargar la nómina');
      } finally {
        setIsLoading(false);
      }
    };

    void loadData();
  }, [nominaId]);

  // Segundo useEffect - Para procesar los datos una vez recibidos
  useEffect(() => {
    if (!nomina) {
      return;
    }

    try {
      // Establecer empleado
      setEmpleado({
        id: nomina.empleado_id,
        cedula: nomina.cedula || '',
        nombres: nomina.nombres || '',
        apellidos: nomina.apellidos || '',
      });

      // Establecer fechas
      if (nomina.fecha_inicio && nomina.fecha_fin) {
        setFechaInicio(dayjs(nomina.fecha_inicio).toDate());
        setFechaFin(dayjs(nomina.fecha_fin).toDate());
      }

      // Procesar recargos y valores de quincena
      if (nomina.quincena_valores && Array.isArray(nomina.quincena_valores)) {
        const valores = nomina.quincena_valores.map((valor) => ({
          tipo_recargo_id: Number(valor.tipo_recargo_id),
          cantidad_dias: Number(valor.cantidad_dias),
          valor_quincena: Number(valor.valor_quincena),
        }));

        setQuincenaValores(valores);
        setSelectedRecargos(valores.map((v) => v.tipo_recargo_id));
      }

      // Procesar subsidios
      if (nomina?.subsidios) {
        let subsidioArray: number[] = [];
    
        if (Array.isArray(nomina.subsidios)) {
          subsidioArray = nomina.subsidios.map(Number);
        } else if (typeof nomina.subsidios === 'string') {
          subsidioArray = nomina.subsidios.split(',').map(Number);
        } else if (typeof nomina.subsidios === 'number') {
          subsidioArray = [nomina.subsidios];
        }
    
        const hasSubsidio = subsidioArray.includes(1);
    
        setTieneSubsidio(hasSubsidio);
        setSelectedSubsidios(hasSubsidio ? [1] : []);
      } else {
        setTieneSubsidio(false);
        setSelectedSubsidios([]);
      }
    } catch (err) {
      setFormError('Error al procesar los datos de la nómina');
    }
  }, [nomina]);

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
    if (!empleado) {
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
      if (!empleado || !fechaInicio || !fechaFin) {
        throw new Error('Datos del formulario incompletos');
      }

      const updateData: ReporteNominaUpdate = {
        empleado_id: empleado.id.toString(),
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

      const result = await updateNomina(nominaId, updateData);
      if (result) {
        setFormError(null);
        setIsSuccess(true);
        setIsModalOpen(true);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al actualizar el formulario');
      setIsSuccess(false);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {isLoading ? (
        <Card>
          <CardContent>
            <Typography>Cargando información de la nómina...</Typography>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </Card>
      ) : !nomina ? (
        <Card>
          <CardContent>
            <Typography>No se encontraron datos de la nómina</Typography>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader title="Actualizar Nómina" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                {/* Empleado - Read only */}
                <Grid xs={12} md={6}>
                  <TextField
                    label="Empleado"
                    value={empleado ? `${empleado.cedula} - ${empleado.nombres} ${empleado.apellidos}` : ''}
                    disabled
                    fullWidth
                    helperText="No se puede modificar el empleado"
                  />
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

                {tiposRecargos.map((recargo) => {
                  const valorActual = quincenaValores.find((v) => v.tipo_recargo_id === recargo.id);

                  return (
                    <Grid xs={12} md={6} key={recargo.id}>
                      <TextField
                        label={recargo.tipo_hora}
                        type="number"
                        // Cambiar el valor por defecto de 0 a una cadena vacía
                        value={valorActual?.cantidad_dias ?? ''}
                        InputProps={{
                          inputProps: {
                            min: 0,
                            max: 31,
                          },
                        }}
                        onChange={(e) => {
                          const value = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                          if (value > 0) {
                            handleRecargoChange(recargo.id, value);
                          } else {
                            // Si el valor es 0 o negativo, eliminar el recargo
                            const updatedValores = quincenaValores.filter((v) => v.tipo_recargo_id !== recargo.id);
                            setQuincenaValores(updatedValores);
                            setSelectedRecargos(selectedRecargos.filter((id) => id !== recargo.id));
                          }
                        }}
                        fullWidth
                        helperText={
                          valorActual ? `Valor actual: ${valorActual.cantidad_dias} días` : 'Sin horas registradas'
                        }
                      />
                    </Grid>
                  );
                })}

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
                    <Select value={String(tieneSubsidio)} onChange={handleSubsidioChange}>
                      <MenuItem value="true">Si</MenuItem>
                      <MenuItem value="false">No</MenuItem>
                    </Select>
                    <FormHelperText>
                      {tieneSubsidio ? 'Subsidio de transporte aplicado' : 'Sin subsidios'}
                    </FormHelperText>
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
              <Button variant="contained" type="submit" disabled={isLoading || !fechaInicio || !fechaFin}>
                {isLoading ? 'Recalculando...' : 'Actualizar Nómina'}
              </Button>
            </CardActions>
          </Card>
        </form>
      )}
      <NominaResultModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        isSuccess={isSuccess}
        errorMessage={formError || (error ? String(error) : undefined)}
      />
    </>
  );
}
