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
}

export function NominaResultModal({
  open,
  onClose,
  isSuccess,
  errorMessage
}: NominaResultModalProps): React.JSX.Element {
  const router = useRouter();

  const handleVolverNominas = (): void => {
    router.push('/dashboard/nominas');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isSuccess ? 'Nómina Actualizada Exitosamente' : 'Error al Actualizar Nómina'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isSuccess
            ? 'La nómina ha sido actualizada correctamente.'
            : `Error: ${errorMessage}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {isSuccess ? (
          <Button onClick={handleVolverNominas} variant="contained">
            Volver a Nóminas
          </Button>
        ) : (
          <Button onClick={onClose} color="primary">
            Cerrar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}