import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from './user';
import { UserService } from './user.service';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';
import {URL_BACKEND} from '../config/config';

@Component({
  selector: 'app-users',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

  users: User[];
  paginador: any;
  userSeleccionado: User;
  empleados: User[]
  urlBackend: string = URL_BACKEND;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              public authService: AuthService,
              public modalService: ModalService ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }

      this.userService.getUsers(page).pipe(
        tap(response => {
          console.log('UserComponent: tap 3');
          (response.content as User[]).forEach(user => {
            console.log(user.nombres);
          });
        })
      ).subscribe(response => {
        this.users = response.content as User[];
        this.paginador = response;
      });

    });
    this.modalService.notificarUpload.subscribe(producto =>{
      this.users = this.users.map(productoOriginal => {
        if (producto.id == productoOriginal.id) {
          productoOriginal.foto = producto.foto;
        }
        return productoOriginal;
      })

    })

  this.userService.getEmpleados()
  .subscribe( response => {
    this.empleados = response as User[];

  });

  }

  delete(user: User): void{
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estas seguro?',
      text: `¿Seguro que desea eliminar el usuario ${user.nombres} ${user.puesto}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(user.id).subscribe(
          response => {
            this.users = this.users.filter(us => us !== user)
            swalWithBootstrapButtons.fire(
              'Usuario Eliminado!',
              `Usuario ${user.nombres} ${user.puesto} eliminado con éxito.`,
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
          `Usuario ${user.nombres} ${user.puesto} no ha sido eliminado.`,
          'error'
        )
      }
    })
  }

  abrirModal(user: User){
    this.userSeleccionado = user;
    this.modalService.abrirModal();
  }



}
