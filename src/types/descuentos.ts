export interface Descuento {
    id: number;
    tipo: 'SALUD' & 'PENSION';
    valor: number;
}

export type Descuentos = Descuento[];