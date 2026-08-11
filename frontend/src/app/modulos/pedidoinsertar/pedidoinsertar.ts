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
  matriz_producto: any = [];
  arreglo_productos: any = [];
  total: any;


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



  seleccionar(valores:any, id:number){
    let cantidad = Number(prompt("Ingrese la cantidad a llevar"));
    this.arreglo_productos = [valores.id_obra, valores.titulo, Number(valores.precio),cantidad,cantidad * Number(valores.precio)];
    this.matriz_producto.push(this.arreglo_productos);

    let largo = this.matriz_producto.length;
    this.total = 0;
    for(let i=0; i<largo; i++){
      this.total = this.total + this.matriz_producto[i][4];
    } 
    console.log(this.matriz_producto);


    
  }

}
