import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Obra } from '../../servicios/obra';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  productos: any[] = []; 

  constructor(private sobra: Obra, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.consulta();
  }

  consulta() {
    this.sobra.consulta().subscribe({
      next: (resultado: any) => {
        console.log("Obras recibidas de PHP:", resultado);
        this.productos = resultado;
        
        this.cdr.detectChanges(); 
      },
      error: (error: any) => {
        console.error("Error al conectar con PHP:", error);
      }
    });
  }
}