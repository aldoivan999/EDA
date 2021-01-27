import { Component, OnInit } from '@angular/core';
import {Producto} from './producto';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../usuarios/auth.service';
import {ProductoService} from './producto.service';
import {ModalProductoService} from './detalle-producto/modal-producto.service';
import {tap} from 'rxjs/operators';
import Swal from "sweetalert2";
import {ItemEntrada} from '../entrada/models/item-entrada';
import {ItemFactura} from '../facturas/models/item-factura';
import {Entrada} from '../entrada/models/entrada';
import {Factura} from '../facturas/models/factura';
import {URL_BACKEND} from '../config/config';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html'
})
export class ProductoComponent implements OnInit {

  productos: Producto[];
  entrada: Entrada;
  factura : Factura;
  itemEntrada: ItemEntrada;
  itemFactura: ItemFactura;
  paginador: any;
  productoSeleccionado: Producto;
  urlBackend: string = URL_BACKEND;

  constructor(private productoService: ProductoService,
              private activatedRoute: ActivatedRoute,
              public authService: AuthService,
              public modalProductoService: ModalProductoService ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }

      this.productoService.getProductos(page).pipe(
        tap(response => {
          console.log('UserComponent: tap 3');
          (response.content as Producto[]).forEach(producto => {
            console.log(producto.nombre);
          });
        })
      ).subscribe(response => {
        this.productos = response.content as Producto[];
        this.paginador = response;
      });
    });
    this.modalProductoService.notificarUpload.subscribe(user =>{
      this.productos = this.productos.map(userOriginal => {
        if (user.id == userOriginal.id) {
          userOriginal.foto = user.foto;
        }
        return userOriginal;
      })
    })
    this.productoService.getSolcitudes()
    .subscribe( response => {
      this.productos= response as Producto[];

    });
  }

  delete(producto: Producto): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: `¿Seguro que desea eliminar el producto ${producto.nombre} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.delete(producto.id).subscribe(
          response => {
            this.productos = this.productos.filter(pd => pd !== producto);
            swalWithBootstrapButtons.fire(
              'Producto Eliminado!',
              `Producto ${producto.nombre} eliminado con éxito.`,
              'success'
            )
          }
        )
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          `Producto ${producto.nombre} no ha sido eliminado.`,
          'error'
        )
      }
    })
  }

  abrirModal(producto: Producto){
    this.productoSeleccionado = producto;
    this.modalProductoService.abrirModal();
  }

}
