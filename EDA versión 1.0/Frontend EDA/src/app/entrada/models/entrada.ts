import {ItemEntrada} from './item-entrada';
import {Proveedor} from '../../proveedor/proveedor';

export class Entrada {
  id: number;
  descripcion: string;
  observacion: string;
  createAt: string;
  items: ItemEntrada[] = [];
  proveedor: Proveedor;
  total: number;

  calcularGranTotal(): number {
    this.total = 0;
    this.items.forEach((item: ItemEntrada) => {
      this.total += item.calcularImporte();
    });
    return this.total;
  }
}
