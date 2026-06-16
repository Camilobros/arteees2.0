import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venta } from '../../servicios/venta'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  ventas: any[] = []; 
  

  totalVentas: number = 0;
  totalIngresos: number = 0;

  constructor(private sVenta: Venta, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.consultaVentas();
  }

  consultaVentas() {
    this.sVenta.consulta().subscribe({
      next: (resultado: any) => {
        console.log("Ventas recibidas de PHP:", resultado);
        this.ventas = resultado;
        
        
        this.totalVentas = this.ventas.length; 
        
        
        this.totalIngresos = this.ventas.reduce((sum, venta) => sum + parseFloat(venta.total || 0), 0);

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error("Error al conectar con PHP (Ventas):", error);
      }
    });
  }
}