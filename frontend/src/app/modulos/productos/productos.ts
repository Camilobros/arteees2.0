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
  validar_id_artista=true;
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


  validar(){
    if(this.obj_producto.titulo == ""){
      this.validar_titulo=false;
    }else{
      this.validar_titulo=true;
    }

    if(this.obj_producto.descripcion == ""){
      this.validar_descripcion=false;
    }else{
      this.validar_descripcion=true;
    }

    if(this.obj_producto.precio == 0){
      this.validar_precio=false;
    }else{
      this.validar_precio=true;
    }

    if(this.obj_producto.estado == ""){
      this.validar_estado=false;
    }else{
      this.validar_estado=true;
    }

    if(this.obj_producto.id_artista == 0){
      this.validar_id_artista=false;
    }else{
      this.validar_id_artista=true;
    }

    if(this.obj_producto.stock == 0){
      this.validar_stock=false;
    }else{
      this.validar_stock=true;
    }

  }
}