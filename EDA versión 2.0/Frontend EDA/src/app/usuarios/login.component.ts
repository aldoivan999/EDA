import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  tittle: string = 'Iniciar sesion';
  usuario: Usuario;

  constructor(private authService: AuthService,
              private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: `Hola ${this.authService.usuario.nombres}`,
        text: 'ya has iniciado sesión'
      });
      this.router.navigate(['/empleados'])
    }
  }

  login(): void{
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire({
        icon: 'error',
        title: 'Error Login',
        text: 'Error al iniciar sesion'
      })
    }
    this.authService.login(this.usuario).subscribe(
      response => {
        console.log(response);

        this.authService.saveUser(response.access_token);
        this.authService.saveToken(response.access_token);
        let usuario = this.authService.usuario;
        this.router.navigate(['/empleados']);
        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `${usuario.username}, has iniciado sesión con éxito`
        });
      }, err => {
        if (err.status == 400) {
          Swal.fire({
            icon: 'error',
            title: 'Datos incorrectos',
            text: "Error al inicar sesión"
          });
        }
      }
    );
  }
}
