import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Producto} from '../producto';
import {ProductoService} from '../producto.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html'
})
export class FormProductoComponent implements OnInit {

  producto: Producto = new  Producto();
  title = 'Crear Producto';

  constructor(private productoService: ProductoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadProducto()
  }

  loadProducto(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.productoService.getProducto(id).subscribe((producto) => this.producto = producto)
      }
    })
  }

  create(): void{
    this.productoService.create(this.producto)
      .subscribe(producto => {
          this.router.navigate(['/productos']);
          Swal.fire('Nuevo producto', `El producto ${this.producto.nombre} ha sido creado con éxito`, 'success')
        }
      );
  }

  update(): void{
    this.productoService.update(this.producto)
      .subscribe( producto => {
        this.router.navigate(['/productos']);
        Swal.fire({
          icon: 'success',
          title: 'Actualizar producto',
          text: `El producto ${this.producto.nombre} actualizado con exito!`
        })
      })
  }
}
