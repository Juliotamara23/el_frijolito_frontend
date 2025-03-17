'use client';

import * as React from 'react';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';

import { useEmpleado } from '../../../hooks/use-register-empleado';
import { EmpleadoResultModal } from '../../modal/empleado-result-modal';

export function EmpleadoForm(): React.JSX.Element {
  const [formError, setFormError] = useState<string | null>(null);
  const [cedula, setCedula] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [puestoTrabajo, setPuestoTrabajo] = useState('');
  const [salarioBase, setSalarioBase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const { createEmpleado, error } = useEmpleado();
  const errorMessage = error as Error | string | null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const resetForm = (): void => {
    setCedula('');
    setNombres('');
    setApellidos('');
    setTelefono('');
    setPuestoTrabajo('');
    setSalarioBase('');
    setFormError(null);
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    if (!cedula) {
      setAlertMessage('Debe ingresar la cédula del empleado');
      setAlertOpen(true);
      return false;
    }
    if (!nombres) {
      setAlertMessage('Debe ingresar los nombres del empleado');
      setAlertOpen(true);
      return false;
    }
    if (!puestoTrabajo) {
      setAlertMessage('Debe ingresar el puesto de trabajo del empleado');
      setAlertOpen(true);
      return false;
    }
    if (!salarioBase) {
      setAlertMessage('Debe ingresar el salario base del empleado');
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

    setIsLoading(true);
    try {
      const empleadoData = {
        cedula: cedula.toString(),
        nombres,
        apellidos,
        telefono,
        puesto_trabajo: puestoTrabajo,
        salario_base: parseFloat(salarioBase),
      };
      const result = await createEmpleado(empleadoData);
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
          <CardHeader title="Registrar Empleado" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  label="Cédula"
                  value={cedula}
                  onChange={(e) => {
                    //  Solo permite números y controla que no sea vacío
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setCedula(value);
                    }
                  }}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  label="Nombres"
                  value={nombres}
                  onChange={(e) => {
                    setNombres(e.target.value);
                  }}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  label="Apellidos"
                  value={apellidos}
                  onChange={(e) => {
                    setApellidos(e.target.value);
                  }}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  label="Teléfono"
                  value={telefono}
                  onChange={(e) => {
                    setTelefono(e.target.value);
                  }}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  label="Puesto de Trabajo"
                  value={puestoTrabajo}
                  onChange={(e) => {
                    setPuestoTrabajo(e.target.value);
                  }}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  label="Salario Base"
                  value={salarioBase}
                  onChange={(e) => {
                    setSalarioBase(e.target.value);
                  }}
                  fullWidth
                  type="number"
                />
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
            <Button variant="contained" type="submit" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar Empleado'}
            </Button>
          </CardActions>
        </Card>
      </form>
      <EmpleadoResultModal
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
