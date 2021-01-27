import {ItemFactura} from './item-factura';
import {User} from '../../empleado/user';

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  createAt: string;
  items: ItemFactura[] = [];
  empleado: User;
  total: number;

  calcularGranTotal(): number {
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      this.total += item.calcularImporte();
    });
    return this.total;
  }
}
