import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {Proveedor} from '../proveedor';
import {ProveedorService} from '../proveedor.service';

@Component({
  selector: 'app-form',
  templateUrl: './formProve.component.html'
})
export class FormProveComponent implements OnInit {

  proveedor: Proveedor = new  Proveedor();
  title = 'Crear Proveedor';

  constructor(private proveedorService: ProveedorService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.proveedorService.getProveedor(id).subscribe((proveedor) => this.proveedor = proveedor)
      }
    })
  }

  create(): void{
    this.proveedorService.create(this.proveedor)
    .subscribe(proveedor => {
      this.router.navigate(['/proveedores']);
      Swal.fire('Nuevo proveedor', `El proveedor ${this.proveedor.nombre} ha sido creado con éxito`, 'success')
    });
  }

  update(): void{
    this.proveedorService.update(this.proveedor)
    .subscribe( proveedor => {
      this.router.navigate(['/proveedores']);
      Swal.fire({
        icon: 'success',
        title: 'Actualizar Proveedor',
        text: `El proveedor ${this.proveedor.nombre} actualizado con exito!`
      })
    })
  }
}
