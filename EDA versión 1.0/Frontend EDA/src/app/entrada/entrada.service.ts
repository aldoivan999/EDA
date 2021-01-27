import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Producto} from '../facturas/models/producto';
import {Entrada} from './models/entrada';
import {URL_BACKEND} from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

  private urlEndPoint: string = URL_BACKEND + '/api/entradas';

  constructor(private httpClient: HttpClient) { }

  getEntrada(id: number): Observable<Entrada> {
    return this.httpClient.get<Entrada>(`${this.urlEndPoint}/${id}`);
  }

  create(entrada: Entrada): Observable<Entrada>{
    return this.httpClient.post<Entrada>(this.urlEndPoint, entrada);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(term: string): Observable<Producto[]> {
    return this.httpClient.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }
}
