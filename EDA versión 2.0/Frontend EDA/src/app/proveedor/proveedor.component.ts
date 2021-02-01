import {Component, Input, OnInit} from '@angular/core';
import {Proveedor} from './proveedor';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../usuarios/auth.service';
import {ProveedorService} from './proveedor.service';
import {tap} from 'rxjs/operators';
import Swal from "sweetalert2";
import {ModalProveedorService} from './detalleProveedor/modal-proveedor.service';
import {URL_BACKEND} from '../config/config';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html'
})
export class ProveedorComponent implements OnInit {

  proveedores: Proveedor[];
  paginador: any;
  proveedorSeleccionado: Proveedor;
  urlBackend: string = URL_BACKEND;

  constructor(private proveedorService: ProveedorService,
              private activatedRoute: ActivatedRoute,
              public authService: AuthService,
              public modalProveedorService: ModalProveedorService ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.proveedorService.getProveedores(page).pipe(
        tap(response => {
          console.log('UserComponent: tap 3');
          (response.content as Proveedor[]).forEach(proveedor => {
            console.log(proveedor.nombre);
          });
        })
      ).subscribe(response => {
        this.proveedores = response.content as Proveedor[];
        this.paginador = response;
      });
    });
    this.modalProveedorService.notificarUpload.subscribe(proveedor =>{
      this.proveedores = this.proveedores.map(proveedorOriginal => {
        if (proveedor.id == proveedorOriginal.id) {
          proveedorOriginal.foto = proveedor.foto;
        }
        return proveedorOriginal;
      })
    })
    this.proveedorService.getExamenes()
  .subscribe( response => {
    this.proveedores = response as Proveedor[];

  });
  }

  delete(proveedor: Proveedor): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: `¿Seguro que desea eliminar el proveedor ${proveedor.nombre} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.delete(proveedor.id).subscribe(
          response => {
            this.proveedores = this.proveedores.filter(pv => pv !== proveedor);
            swalWithBootstrapButtons.fire(
              'Proveedor Eliminado!',
              `proveedor ${proveedor.nombre} eliminado con éxito.`,
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
          `proveedor ${proveedor.nombre} no ha sido eliminado.`,
          'error'
        )
      }
    })
  }

  abrirModal(proveedor: Proveedor){
    this.proveedorSeleccionado = proveedor;
    this.modalProveedorService.abrirModal();
  }
}
