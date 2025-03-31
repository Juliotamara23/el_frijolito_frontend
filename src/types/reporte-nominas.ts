export interface ReporteNomina {
    id: string;
    empleado_id: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    puesto_trabajo: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    descuentos_aplicados?: string;
    subsidios_aplicados?: string;
    tipo_recargo?: string;
    cantidad_dias?: string;
    valor_quincena?: string;
    total_pagado: number;
  }
  
  export interface ReporteNominaCreate {
    empleado_id: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    puesto_trabajo: string;
    fecha_inicio: string;
    fecha_fin: string;
    quincena_valores: QuincenaValorCreate[];
    recargos: number[];
    descuentos: number[];
    subsidios?: number[];
    total_pagado?: number;
  }

  export interface ReporteNominaResponse {
    id: number;
    empleado_id: string;
    total_nomina: number;
    fecha_inicio: Date;
    fecha_fin: Date;
  }
  
  export interface QuincenaValorCreate {
    tipo_recargo_id: number;
    cantidad_dias: number;  // Se validará entre 0-31 en el backend
    valor_quincena: number; // Decimal con máximo 10 dígitos, 2 decimales
  }
  
  export interface QuincenaValor extends QuincenaValorCreate {
    id: string;  // UUID
    reporte_nomina_id: string;  // UUID
  }

export interface ReporteNominaUpdate {
  empleado_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  total_pagado?: number;
  quincena_valores?: QuincenaValorCreate[];
  recargos?: number[];
  descuentos?: number[];
  subsidios?: number[];
}