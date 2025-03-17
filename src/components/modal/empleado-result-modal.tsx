import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';

interface EmpleadoResultModalProps {
  open: boolean;
  onClose: () => void;
  isSuccess: boolean;
  errorMessage?: string;
  onReset: () => void;
}

export function EmpleadoResultModal({
  open,
  onClose,
  isSuccess,
  errorMessage,
  onReset,
}: EmpleadoResultModalProps): React.JSX.Element {
  const router = useRouter();

  const handleVerEmpleado = (): void => {
    router.push('/dashboard/empleados');
    onClose();
  };

  const handleNuevoEmpleado = (): void => {
    onReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isSuccess ? 'Empleado Registrado Exitosamente' : 'Error al registrar el empleado'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isSuccess
            ? 'Empleado registrado y guardado.'
            : `Error: ${errorMessage}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {isSuccess ? (
          <>
            <Button onClick={handleNuevoEmpleado} color="primary">
              Registrar otro empleado
            </Button>
            <Button onClick={handleVerEmpleado} variant="contained">
              Ver Empleados
            </Button>
          </>
        ) : (
          <Button onClick={onClose} color="primary">
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}