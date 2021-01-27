import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Producto} from '../facturas/models/producto';
import {ActivatedRoute, Router} from '@angular/router';
import {flatMap, map} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {ItemFactura} from '../facturas/models/item-factura';
import Swal from "sweetalert2";
import {Entrada} from './models/entrada';
import {ProveedorService} from '../proveedor/proveedor.service';
import {EntradaService} from './entrada.service';
import {ItemEntrada} from './models/item-entrada';

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html'
})
export class EntradaComponent implements OnInit {

  title: string = 'Nueva Entrada';
  entrada: Entrada = new Entrada();

  autocompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private proveedorService: ProveedorService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private entradaService: EntradaService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let proveedorId = +params.get('proveedorId');
      this.proveedorService.getProveedor(proveedorId).subscribe(proveedor => this.entrada.proveedor = proveedor);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof  value === 'string' ? value : value.nombre),
        flatMap(value => value ?  this._filter(value) : [])
      );
  }
  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.entradaService.filtrarProductos(filterValue);
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
      this.entrada.items.push(newItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any) {
    let cantidad: number = event.target.value as number;

    if (cantidad == 0) {
      return this.eliminarItemEntrada(id);
    }

    this.entrada.items = this.entrada.items.map((item: ItemEntrada) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.entrada.items.forEach((item: ItemEntrada) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementarCantidad(id: number): void {
    this.entrada.items = this.entrada.items.map((item: ItemEntrada) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item ;
    });
  }

  create(): void {
    this.entradaService.create(this.entrada).subscribe(entrada => {
      Swal.fire({
        icon: 'success',
        title: this.title,
        text: `Entrada ${entrada.descripcion} creada con éxito!`});
      this.router.navigate(['/proveedores']);
    });
  }

  eliminarItemEntrada(id: number): void {
    this.entrada.items = this.entrada.items.filter((item: ItemEntrada) => id !== item.producto.id);
  }
}
