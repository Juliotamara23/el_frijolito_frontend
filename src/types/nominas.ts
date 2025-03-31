export interface Nomina {
  id: string;
  empleado_id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  puesto_trabajo: string;
  fecha_inicio: string;
  fecha_fin: string;
  descuentos_aplicados?: string;
  subsidios_aplicados?: string;
  recargos_y_valores?: string; // Columna combinada
  total_pagado: number;
}

export interface NominaUpdate {
  id: string;
  empleado_id: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  fecha_inicio: string;
  fecha_fin: string;
  quincena_valores: {
    tipo_recargo_id: number;
    cantidad_dias: number;
    valor_quincena: number;
  }[];
  descuentos?: number[] | string | number;
  subsidios?: number[] | string | number;
  total_pagado: number;
}