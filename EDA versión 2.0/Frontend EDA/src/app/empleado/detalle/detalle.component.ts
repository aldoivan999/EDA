import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { User } from '../user';
import { UserService } from '../user.service';
import { ModalService } from './modal.service';
import {URL_BACKEND} from '../../config/config';

@Component({
  selector: 'detalle-user',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() user: User;
  titulo = 'Detalle del usuario';
  private fotoSeleccionada: File;
  progreso = 0;
  urlBackend: string = URL_BACKEND;

  constructor(
  private userService: UserService,
  public authService: AuthService,
  public modalService: ModalService) { }

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
    this.userService.subirFoto(this.fotoSeleccionada, this.user.id)
    .subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progreso = Math.round((event.loaded / event.total) * 100);
      }else if (event.type === HttpEventType.Response){
        const response: any = event.body;
        this.user = response.user as User;

        this.modalService.notificarUpload.emit(this.user);
        Swal.fire('La foto se ha subido completamente', response.mensaje, 'success' );
      }
      // this.empleado = empleado;
    });
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }


  }



