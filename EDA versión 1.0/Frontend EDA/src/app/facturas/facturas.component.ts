import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, flatMap} from 'rxjs/operators';
import {Factura} from './models/factura';
import {UserService} from '../empleado/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FacturaService} from './services/factura.service';
import {Producto} from './models/producto';
import { MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ItemFactura} from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  title: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private empleadoService: UserService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private facturaService: FacturaService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let empleadoId = +params.get('empleadoId');
      this.empleadoService.getUser(empleadoId).subscribe(empleado => this.factura.empleado = empleado);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof  value === 'string' ? value : value.nombre),
        flatMap(value => value ?  this._filter(value) : [])
      );
  }
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return  producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;

    if (this.existeItem(producto.id)) {
      this.incrementarCantidad(producto.id);
    } else {
      let newItem = new ItemFactura();
      newItem.producto = producto;
      this.factura.items.push(newItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any) {
    let cantidad: number = event.target.value as number;

    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementarCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item ;
    });
  }

  create(): void {
    this.facturaService.create(this.factura).subscribe(factura => {
      Swal.fire({
        icon: 'success',
        title: this.title,
        text: `Factura ${factura.descripcion} creada con éxito!`});
      this.router.navigate(['/empleados']);
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }
}
