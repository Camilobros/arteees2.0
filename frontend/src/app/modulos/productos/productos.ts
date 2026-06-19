import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Obra } from '../../servicios/obra';
import { Artista } from '../../servicios/artista';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  productos: any[] = []; 
  obra:any;
  artista:any;
  obj_producto = {
    titulo: "",
    descripcion: "",
    precio: 0,
    estado: "",
    id_artista: 0,
    stock: 0
  }
  validar_titulo=true;
  validar_descripcion=true;
  validar_precio=true;
  validar_estado=true;
  validar_artista=true;
  validar_stock=true;
  mform=false;
  constructor(private sobra: Obra, private cdr: ChangeDetectorRef, private sartis:Artista) {}

  ngOnInit(): void {
    this.consulta();
    this.consulta_ar();
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


  consulta_ar(){
    this.sartis.consulta().subscribe((resultado:any) => {
      this.artista = resultado;
    })
  }

  mostrar_form(dato: any){
    switch(dato){
      case "ver":
        this.mform = true
        break
      case "no ver":
        this.mform = false
        break
    }

  }
}