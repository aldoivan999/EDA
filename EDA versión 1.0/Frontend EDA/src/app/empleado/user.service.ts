import { Injectable } from '@angular/core';
import { formatDate, DatePipe} from '@angular/common';
import { Observable, throwError } from 'rxjs';
import { User } from './user';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators'
import { Router } from '@angular/router';
import {URL_BACKEND} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlEndPoint:string = URL_BACKEND + '/api/empleados';

  //private HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'})

  constructor(
    private http: HttpClient,
    private router: Router) {}

  /* private addAuthorizationHeader(){
    let token = this.authService.token;
    if (token != null) {
      return this.HttpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.HttpHeaders;
  } */

  getUsers(page: number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint+ '/page/' + page).pipe(
      tap( (response: any) => {
        console.log('UserService: tap 1');
        (response.content as User[]).forEach(user =>{
          console.log(user.nombres);
        });
      }),
      map( (response: any) => {
        (response.content as User[]).map(user => {
          user.nombres = user.nombres.toUpperCase();
          user.puesto = user.puesto.toUpperCase();
          let datePipe = new DatePipe('es');
          user.createAt = datePipe.transform(user.createAt, 'dd, MMMM yyyy')
          user.fechaNa = datePipe.transform(user.fechaNa, 'dd, MMMM yyyy')

          return user;
        });
        return response;
      })
    );
  }

  create(user: User): Observable<User> {
    return this.http.post(this.urlEndPoint, user).pipe(
      map((response: any) => response.user as User),
      catchError(e => {

        if (e.status == 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(user: User): Observable<User>{
    return this.http.put(`${this.urlEndPoint}/${user.id}`, user).pipe(
      map((response: any) => response.user as User),
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getUser(id): Observable<User>{
    return this.http.get<User>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/empleados']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<User>{
    return this.http.delete<User>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    })

    return this.http.request(req);
  }

  getEmpleados(): Observable<User[]>{
    return this.http.get<User[]>(this.urlEndPoint);
  }


}


