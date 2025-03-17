import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';

interface NominaResultModalProps {
  open: boolean;
  onClose: () => void;
  isSuccess: boolean;
  errorMessage?: string;
  onReset: () => void;
}

export function NominaResultModal({
  open,
  onClose,
  isSuccess,
  errorMessage,
  onReset,
}: NominaResultModalProps): React.JSX.Element {
  const router = useRouter();

  const handleVerNominas = (): void => {
    router.push('/dashboard/nominas');
    onClose();
  };

  const handleNuevaNomina = (): void => {
    onReset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isSuccess ? 'Nómina Calculada Exitosamente' : 'Error al Calcular Nómina'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isSuccess
            ? 'La nómina ha sido calculada y guardada correctamente.'
            : `Error: ${errorMessage}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {isSuccess ? (
          <>
            <Button onClick={handleNuevaNomina} color="primary">
              Crear Nueva Nómina
            </Button>
            <Button onClick={handleVerNominas} variant="contained">
              Ver Nóminas
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