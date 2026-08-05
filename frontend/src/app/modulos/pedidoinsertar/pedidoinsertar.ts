import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Obra } from '../../servicios/obra';
import { Cliente } from '../../servicios/cliente';
import { Pedidoservice } from '../../servicios/pedidoservice';
import { CommonModule } from '@angular/common';  
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pedidoinsertar',
  imports: [CommonModule,FormsModule],
  templateUrl: './pedidoinsertar.html',
  styleUrl: './pedidoinsertar.css',
})
export class Pedidoinsertar {

  obras:any;
  cliente:any;
  ident_cliete = "";
  nombre_cliente = "";


  constructor(private router: Router, private sobra: Obra, private scliente: Cliente, private spedido : Pedidoservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.consulta_obra();
  }

  consulta_obra(){
    this.sobra.consulta().subscribe((result:any)=>{
      this.obras = result;

      this.cdr.detectChanges();
    })

  }

  consulta_cliente(){
    this.scliente.ccliente(this.ident_cliete).subscribe((result:any)=>{
      this.cliente=result;
      this.nombre_cliente = this.cliente[0].nombre;
      console.log(this.cliente);
      
    }) 
  }

}
