import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from './user';
import { UserService } from './user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public user: User = new  User();
  title = 'Crear Usuario';

  constructor(
  private userService: UserService,
  private router: Router,
  private activatedRoute: ActivatedRoute
) { }

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if (id) {
        this.userService.getUser(id).subscribe((user) => this.user = user)
      }
    })
  }

  create(): void{
    this.userService.create(this.user)
    .subscribe(user => {
      this.router.navigate(['/empleados']);
      Swal.fire('Nuevo usuario', `El usuario ${this.user.nombres} ha sido creado con éxito`, 'success')
    }
  );
  }

  update(): void{
    this.userService.update(this.user)
    .subscribe( user => {
      this.router.navigate(['/empleados'])
      Swal.fire({
        icon: 'success',
        title: 'Actualizar Usuario',
        text: `El usuario ${this.user.nombres} actualizado con exito!`
      })
    })
  }

}
