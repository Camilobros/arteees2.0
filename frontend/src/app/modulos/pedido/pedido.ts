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





}
