import {Producto} from '../facturas/models/producto';
import {Entrada} from '../entrada/models/entrada';

export class Proveedor {
  id: number;
  nombre: string;
  text: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  text6: string;
  text7: string;
  text8: string;
  text9: string;
  text10: string;
  text11: string;
  createAt: string;
  foto: string;
  entradas: Entrada[] = [];
}
