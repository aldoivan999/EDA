import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'paginatorProve-nav',
  templateUrl: './paginatorProve.component.html'
})
export class PaginatorProveComponent implements OnInit {

  @Input() paginador: any;
  paginas: number[];
  constructor() { }

  ngOnInit(): void {
    this.paginas = new Array(this.paginador.totalPages).fill(0).map(
      (_valor, indice) => indice +1);
  }


}
