import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.authService.isAuthenticated()) {
        if (this.isTokenExpired()) {
          this.authService.logout();
          this.router.navigate(['/login'])
          return false;
        }
        return true;
      }
      Swal.fire({
        icon: 'warning',
        title: 'Acceso denegado',
        text: "Hola no has iniciado sesión"
      })
      this.router.navigate(['/login']);
    return false;
  }

  isTokenExpired(): boolean{
    let token = this.authService.token;
    let payload = this.authService.getDataToken(token);
    let now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }

}
