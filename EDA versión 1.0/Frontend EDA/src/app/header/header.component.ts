import{Component} from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  title:String = 'App Desing';

  constructor(
    public authService: AuthService,
    private router: Router,){}

  logout(): void{
    Swal.fire({
      icon: 'success',
      title: `Adiós ${this.authService.usuario.nombres}`,
      text: 'Has cerrado sesión con éxito!'
    });
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
