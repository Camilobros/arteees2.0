import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Pedidoservice } from '../../servicios/pedidoservice';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pedido',
  imports: [CommonModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
})
export class Pedido {

  ventas: any;
  modal = false;
  productos: any;
  total: any;

  constructor(private router: Router, private spedido: Pedidoservice,private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.consulta();

  }

  consulta() {
    this.spedido.consulta().subscribe((result: any) => {
      this.ventas = result;

      this.cdr.detectChanges();

    });

  }

  consultap(id:number){
    this.spedido.consultap(id).subscribe((result: any) => {
      this.productos = result;

      this.total = 0;

      for(let i=0;i<this.productos.length;i++){
        this.total = this.total + this.productos[i][4];
      }

      this.cdr.detectChanges();

    });

  }


  insertar(){
    this.router.navigate(['pedidoins']);

  }

  mostrar_modal(dato:any, id:number){
    switch(dato){
      case 0:
        this.modal = false;
        break;
        
      case 1:
        this.modal = true;
        this.consultap(id);
        break;  
    }
  }





}
