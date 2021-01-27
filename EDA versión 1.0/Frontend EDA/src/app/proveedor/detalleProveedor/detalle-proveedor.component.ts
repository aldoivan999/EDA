import {Component, Input, OnInit} from '@angular/core';
import {Proveedor} from '../proveedor';
import {AuthService} from '../../usuarios/auth.service';
import Swal from "sweetalert2";
import {Entrada} from '../../entrada/models/entrada';
import {EntradaService} from '../../entrada/entrada.service';
import {HttpEventType} from '@angular/common/http';
import {ProveedorService} from '../proveedor.service';
import {ModalProveedorService} from './modal-proveedor.service';
import {URL_BACKEND} from '../../config/config';

@Component({
  selector: 'detalle-proveedor',
  templateUrl: './detalle-proveedor.component.html',
  styleUrls: ['./detalle-proveedor.component.css']
})
export class DetalleProveedorComponent implements OnInit {

  @Input() proveedor: Proveedor;
  title = 'Detalle del proveedor';
  private fotoSeleccionada: File;
  progreso = 0;
  urlBackend: string = URL_BACKEND;

  constructor(private proveedorService: ProveedorService,
              public authService: AuthService,
              public modalProveedorService: ModalProveedorService,
              private entradaService: EntradaService) { }

  ngOnInit(): void {
  }

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire('Error seleccionar imagen', 'El archivo debe de ser del tipo imagen', 'error' );
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if (!this.fotoSeleccionada) {
      Swal.fire('Error', 'Debe seleccionar una foto', 'error' );
    }else{
      this.proveedorService.subirFoto(this.fotoSeleccionada, this.proveedor.id)
        .subscribe( event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          }else if (event.type === HttpEventType.Response){
            const response: any = event.body;
            this.proveedor = response.user as Proveedor;

            this.modalProveedorService.notificarUpload.emit(this.proveedor);
            Swal.fire('La foto se ha subido completamente', response.mensaje, 'success' );
          }
          // this.empleado = empleado;
        });
    }
  }

  cerrarModal(){
    this.modalProveedorService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(entrada: Entrada): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: `¿Seguro que desea eliminar la entrada ${entrada.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.entradaService.delete(entrada.id).subscribe(
          response => {
            this.proveedor.entradas = this.proveedor.entradas.filter(e => e !== entrada);
            swalWithBootstrapButtons.fire(
              'Entrada Eliminada!',
              `entrada ${entrada.descripcion} eliminada con éxito.`,
              'success'
            );
          }
        );
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          `entrada ${entrada.descripcion}  no ha sido eliminada.`,
          'error'
        );
      }
    });
  }
}
