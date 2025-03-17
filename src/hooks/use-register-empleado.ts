import { useState } from "react";
import { api } from "../lib/api/nomina";
import type { Empleado } from "../types/empleados"; // Importa el tipo Empleado
import { AxiosError } from "axios";

interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

interface ApiError {
  detail: string | ValidationError[] | Record<string, string | string[]>;
}

export const useEmpleado = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEmpleado = async (empleadoData: Omit<Empleado, 'id'>): Promise<Empleado | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<Empleado>('/empleados', empleadoData);
      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiError;

        if (Array.isArray(apiError.detail)) {
          const errors = apiError.detail
            .map(
              (validationError) =>
                `${validationError.loc.join('.')}: ${validationError.msg}`
            )
            .join('\n'); // Usamos \n para los saltos de línea
          setError(errors);
        } else if (typeof apiError.detail === 'string') {
          setError(apiError.detail);
        } else {
          const errors = Object.entries(apiError.detail)
            .map(([field, messages]) => {
              const messageText = Array.isArray(messages)
                ? messages.join(', ')
                : messages;
              return `${field}: ${messageText}`;
            })
            .join('\n'); // Usamos \n para los saltos de línea
          setError(errors);
        }
      } else {
        setError('Error al registrar el empleado'); // Mensaje de error específico
      }

      // Remove debug logging in production
      // eslint-disable-next-line no-console -- Temporarily log API errors for debugging during development
      console.error(
        'Error details:',
        err instanceof AxiosError ? err.response?.data : err
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createEmpleado,
    isLoading,
    error,
  };
};