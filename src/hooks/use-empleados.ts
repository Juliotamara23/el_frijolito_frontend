import { useState, useCallback } from 'react';
import { api } from "../lib/api/nomina";
import type { Empleado } from "../types/empleados";

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmpleados = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<Empleado[]>('/empleados');
      setEmpleados(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Error al obtener los empleados'); // Almacenar el mensaje de error en el estado
      setIsLoading(false);
    }
  }, []);

  const deleteEmpleados = async (ids: string[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Delete each Empleados individually using their IDs
      await Promise.all(
        ids.map(id => api.delete(`/empleados/${id}`))
      );

      await fetchEmpleados(); // Refresh list after deletion
      return true;
    } catch (err) {
      setError('Error al eliminar las nóminas'); // Almacenar el mensaje de error en el estado
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    empleados,
    deleteEmpleados,
    isLoading,
    error,
    fetchEmpleados,
    setError
  };
};