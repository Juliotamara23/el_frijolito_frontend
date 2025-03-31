import { useState } from "react";
import { api } from "../lib/api/nomina";
import type { ReporteNominaUpdate, ReporteNominaResponse } from "../types/reporte-nominas";
import { AxiosError } from "axios";

interface ValidationError {
  loc: string[];
  msg: string;
  type: string;
}

interface ApiError {
  detail: string | ValidationError[] | Record<string, string | string[]>;
}

export const useUpdateNomina = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateNomina = async (id: string, nominaData: ReporteNominaUpdate): Promise<ReporteNominaResponse | null> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.put<ReporteNominaResponse>(`/nominas/${id}`, nominaData);
            return response.data;
        } catch (err) {
            if (err instanceof AxiosError && err.response?.data) {
                const apiError = err.response.data as ApiError;
                
                if (Array.isArray(apiError.detail)) {
                    const errors = apiError.detail
                        .map(validationError => `${validationError.loc.join('.')}: ${validationError.msg}`)
                        .join('\n');
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
                        .join('\n');
                    setError(errors);
                }
            } else {
                setError('Error al actualizar la nómina');
            }
            
            // Remove debug logging in production
            // eslint-disable-next-line no-console -- Temporarily log API errors for debugging during development
            console.error('Error details:', err instanceof AxiosError ? err.response?.data : err);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        updateNomina,
        isLoading,
        error
    };
};