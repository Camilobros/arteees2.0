import { Component, OnInit } from '@angular/core'; // 1. Agregamos OnInit aquí
import { CommonModule } from '@angular/common'; // 2. Agregamos CommonModule por si usas *ngFor
import { Cliente } from '../../servicios/cliente';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule], // 3. Lo metemos en los imports
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit { // 4. Le decimos a la clase que implemente OnInit

  clientes: any; // Aquí se guardará el JSON que llegue de tu backend en PHP

  constructor(private scli: Cliente) {}

  ngOnInit(): void {
    this.consulta(); // 5. CORRECCIÓN: Llamamos a la función consulta, no a la variable
  }

consulta() {
    this.scli.consulta().subscribe({
      next: (resultado: any) => {
        console.log("Datos recibidos de PHP:", resultado); // <-- Esto nos dirá si llegan los datos
        this.clientes = resultado;
      },
      error: (error: any) => {
        console.error("Error al conectar con PHP:", error); // <-- Esto nos avisará si hay un fallo
      }
    });
  }
}