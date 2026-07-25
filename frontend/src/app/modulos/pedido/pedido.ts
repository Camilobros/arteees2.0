import { Component, OnInit } from '@angular/core'; // 👈 1. Importamos OnInit
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Pedidoservice } from '../../servicios/pedidoservice';


@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
})
export class Pedido implements OnInit { // 👈 2. Le decimos que implemente OnInit

  venta: any = []; // 👈 3. Le ponemos = [] para que la tabla no se rompa al cargar vacía

  constructor(private router: Router, private spedido: Pedidoservice ){}

  ngOnInit(): void {
    this.consulta();
  }

  consulta(){
    this.spedido.consulta().subscribe({
      next: (result: any) => {
        // 👈 4. ESTA ES LA CLAVE: Vamos a ver exactamente qué nos manda PHP
        console.log("📥 Datos que llegaron de PHP:", result); 
        this.venta = result;
      },
      error: (error: any) => {
        console.error("❌ Error de conexión con PHP:", error);
      }
    });
  }

}