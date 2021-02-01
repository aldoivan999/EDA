import {Component, Input, OnInit} from '@angular/core';
import {Producto} from '../producto';
import {AuthService} from '../../usuarios/auth.service';
import {ProductoService} from '../producto.service';
import {ModalProductoService} from './modal-producto.service';
import Swal from "sweetalert2";
import {HttpEventType} from '@angular/common/http';
import {URL_BACKEND} from '../../config/config';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {

  @Input() producto: Producto;
  title = 'Detalle del producto';
  private fotoSeleccionada: File;
  progreso = 0;
  urlBackend: string = URL_BACKEND;

  constructor(private productoService: ProductoService,
              public authService: AuthService,
              public modalProductoService: ModalProductoService) { }

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
      this.productoService.subirFoto(this.fotoSeleccionada, this.producto.id)
        .subscribe( event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100);
          }else if (event.type === HttpEventType.Response){
            const response: any = event.body;
            this.producto = response.producto as Producto;

            this.modalProductoService.notificarUpload.emit(this.producto);
            Swal.fire('La foto se ha subido completamente', response.mensaje, 'success' );
          }
        });
    }
  }

  cerrarModal(){
    this.modalProductoService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
