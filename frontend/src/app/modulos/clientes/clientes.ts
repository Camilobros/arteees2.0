import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../servicios/cliente';
import { ChangeDetectorRef } from '@angular/core'; 

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {

  clientes: any[] = []; 

  
  constructor(private scli: Cliente, private cdr: ChangeDetectorRef) {} 

  ngOnInit(): void {
    this.consulta(); 
  }

  consulta() {
    this.scli.consulta().subscribe({
      next: (resultado: any) => {
        console.log("Datos recibidos de PHP:", resultado); 
        this.clientes = resultado; 
        
        this.cdr.detectChanges(); 
      },
      error: (error: any) => {
        console.error("Error al conectar con PHP:", error); 
      }
    });
  }
}