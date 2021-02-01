import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {Producto} from './producto';
import {URL_BACKEND} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private urlEndPoint:string = URL_BACKEND + '/api/productos';

  constructor(
    private http: HttpClient,
    private router: Router) {}

  getProductos(page: number): Observable<any>{
    return this.http.get(this.urlEndPoint+ '/page/' + page).pipe(
      tap( (response: any) => {
        console.log('UserService: tap 1');
        (response.content as Producto[]).forEach(producto =>{
          console.log(producto.nombre);
        });
      }),
      map( (response: any) => {
        (response.content as Producto[]).map(producto => {
          producto.nombre = producto.nombre.toUpperCase();
          producto.estatus = producto.estatus.toUpperCase();
          let datePipe = new DatePipe('es');
          producto.createAt = datePipe.transform(producto.createAt, 'dd, MMMM yyyy');
          return producto;
        });
        return response;
      })
    );
  }

  create(producto: Producto): Observable<Producto> {
    return this.http.post(this.urlEndPoint, producto).pipe(
      map((response: any) => response.producto as Producto),
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

  update(producto: Producto): Observable<Producto>{
    return this.http.put(`${this.urlEndPoint}/${producto.id}`, producto).pipe(
      map((response: any) => response.producto as Producto),
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getProducto(id): Observable<Producto>{
    return this.http.get<Producto>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/productos']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Producto>{
    return this.http.delete<Producto>(`${this.urlEndPoint}/${id}`).pipe(
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
  getSolcitudes(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.urlEndPoint);
  }
}
