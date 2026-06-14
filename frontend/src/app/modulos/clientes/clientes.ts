import { Component } from '@angular/core';
import { Cliente } from '../../servicios/cliente';

@Component({
  selector: 'app-clientes',
  imports: [],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {

  clientes: any;

  constructor(private scli:Cliente){}

  ngOnInit(): void{
    this.clientes();
  }

  consulta(){
    this.scli.consulta().subscribe((resultado:any) => {this.clientes = resultado;})
  }


}
