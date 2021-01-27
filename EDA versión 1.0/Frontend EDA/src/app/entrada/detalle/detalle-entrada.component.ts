import { Component, OnInit } from '@angular/core';
import {Entrada} from '../models/entrada';
import {ActivatedRoute} from '@angular/router';
import {EntradaService} from '../entrada.service';

@Component({
  selector: 'app-detalle-entrada',
  templateUrl: './detalle-entrada.component.html'
})
export class DetalleEntradaComponent implements OnInit {

  entrada: Entrada;
  title: string = 'Entrada';

  constructor(private entradaService: EntradaService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      this.entradaService.getEntrada(id).subscribe(entrada => {
        this.entrada = entrada;
      });
    });
  }
}
