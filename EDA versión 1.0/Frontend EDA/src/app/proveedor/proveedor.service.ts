import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {Proveedor} from './proveedor';
import {URL_BACKEND} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private urlEndPoint:string = URL_BACKEND + '/api/provedores';

  constructor(
    private http: HttpClient,
    private router: Router) {}

  getProveedores(page: number): Observable<any>{
    return this.http.get(this.urlEndPoint+ '/page/' + page).pipe(
      tap( (response: any) => {
        (response.content as Proveedor[]).forEach(proveedor =>{
          console.log(proveedor.nombre);
        });
      }),
      map( (response: any) => {
        (response.content as Proveedor[]).map(proveedor => {
          proveedor.nombre = proveedor.nombre.toUpperCase();
          let datePipe = new DatePipe('es');
          proveedor.createAt = datePipe.transform(proveedor.createAt, 'dd, MMMM yyyy')
          return proveedor;
        });
        return response;
      })
    );
  }

  create(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post(this.urlEndPoint, proveedor).pipe(
      map((response: any) => response.proveedor as Proveedor),
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

  update(proveedor: Proveedor): Observable<Proveedor>{
    return this.http.put(`${this.urlEndPoint}/${proveedor.id}`, proveedor).pipe(
      map((response: any) => response.proveedor as Proveedor),
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getProveedor(id): Observable<Proveedor>{
    return this.http.get<Proveedor>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/provedores']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Proveedor>{
    return this.http.delete<Proveedor>(`${this.urlEndPoint}/${id}`).pipe(
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
    });
    return this.http.request(req);
  }

  getExamenes(): Observable<Proveedor[]>{
    return this.http.get<Proveedor[]>(this.urlEndPoint);
  }
}

