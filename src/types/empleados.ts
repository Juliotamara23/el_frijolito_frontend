export interface Empleado {
    id: string;
    cedula: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    puesto_trabajo: string;
    salario_base?: number;
  }