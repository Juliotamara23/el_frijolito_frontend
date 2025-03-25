import { useState, useCallback } from 'react';
import { api } from '../lib/api/nomina';
import type { Nomina } from '@/types/nominas';

export const useNominas = (): {
  nominas: Nomina[];
  deleteNominas: (ids: string[]) => Promise<boolean>;
  updateNomina: (id: string, data: Partial<Nomina>) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  fetchNominas: () => Promise<void>;
} => {
  const [nominas, setNominas] = useState<Nomina[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNominas = useCallback(async () => {
    try {
      const response = await api.get<Nomina[]>('/nominas');
      setNominas(response.data);
    } catch (err) {
      setError('Error al obtener las nóminas');
    }
  }, []);

  const updateNomina = async (id: string, data: Partial<Nomina>): Promise<boolean> => { 
    setIsLoading(true);
    setError(null);

    try {
      await api.put(`/nominas/${id}`, data);
      await fetchNominas(); // Refresh list after update
      return true;
    } catch (err) {
      setError('Error al actualizar la nómina');
      return false;
    } finally {
      setIsLoading(false);
    }
  };    

  const deleteNominas = async (ids: string[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
  
    try {
      // Delete each nomina individually using their IDs
      await Promise.all(
        ids.map(id => api.delete(`/nominas/${id}`))
      );
      
      await fetchNominas(); // Refresh list after deletion
      return true;
    } catch (err) {
      setError('Error al eliminar las nóminas');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    nominas, 
    deleteNominas,
    updateNomina,
    isLoading, 
    error,
    fetchNominas,
  };
};