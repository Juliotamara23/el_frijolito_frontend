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