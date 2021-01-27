import {Factura} from '../facturas/models/factura';

export class User {
  id: number;
  nombres: string;
  fechaNa: string;
  telefono: string;
  escolar: string;
  puesto: string;
  area: string;
  createAt: string;
  foto: string;
  facturas: Factura[] = [];
}
