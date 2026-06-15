import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../servicios/cliente';
import { ChangeDetectorRef } from '@angular/core'; // 1. Importamos el "despertador"

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {

  clientes: any[] = []; 

  // 2. Inyectamos la herramienta cdr en el constructor
  constructor(private scli: Cliente, private cdr: ChangeDetectorRef) {} 

  ngOnInit(): void {
    this.consulta(); 
  }

  consulta() {
    this.scli.consulta().subscribe({
      next: (resultado: any) => {
        console.log("Datos recibidos de PHP:", resultado); 
        this.clientes = resultado; 
        
        this.cdr.detectChanges(); // 3. ¡EL DESPERTADOR! Fuerza a Angular a actualizar la pantalla instantáneamente
      },
      error: (error: any) => {
        console.error("Error al conectar con PHP:", error); 
      }
    });
  }
}