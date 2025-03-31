/* eslint-disable no-console -- Temporarily log API errors for debugging during development */
import { useCallback, useState } from 'react';
import { api } from '../lib/api/nomina';
import type { NominaUpdate } from '@/types/nominas';

interface UseNominaById {
  nomina: NominaUpdate | null;
  isLoading: boolean;
  error: string | null;
  getNominaById: (id: string) => Promise<void>;
}

export const useNominaById = (): UseNominaById => {
  const [nomina, setNomina] = useState<NominaUpdate | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getNominaById = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<NominaUpdate>(`/nominas/${id}`);
      console.log('API Response:', response);
      
      if (response.status === 200 && response.data) {
        setNomina(response.data);
      } else {
        throw new Error('No se encontraron datos de la nómina');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la nómina');
      setNomina(null);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed for getNominaById

  return { nomina, isLoading, error, getNominaById };
};