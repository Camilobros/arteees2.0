import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Obra } from '../../servicios/obra';
import { Artista } from '../../servicios/artista';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  productos: any[] = [];
  obra: any;
  artista: any;
  id_producto: any
  obj_producto = {
    titulo: "",
    descripcion: "",
    precio: 0,
    estado: "",
    id_artista: 0,
    stock: 0
  }
  validar_titulo = true;
  validar_descripcion = true;
  validar_precio = true;
  validar_estado = true;
  validar_artista = true;
  validar_stock = true;
  validar_id_artista = true;
  mform = false;
  botones_form = false;
  constructor(private sobra: Obra, private cdr: ChangeDetectorRef, private sartis: Artista) { }

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


  consulta_ar() {
    this.sartis.consulta().subscribe((resultado: any) => {
      this.artista = resultado;
    })
  }

  mostrar_form(dato: any) {
    switch (dato) {
      case "ver":
        this.mform = true
        break;
      case "no ver":
        this.mform = false;
        this.botones_form = false;
        break;
    }

  }

  limpiar() {
    this.obj_producto = {
      titulo: "",
      descripcion: "",
      precio: 0,
      estado: "",
      id_artista: 0,
      stock: 0
    }
  }



  validar(funcion: any) {
    if (this.obj_producto.titulo == "") {
      this.validar_titulo = false;
    } else {
      this.validar_titulo = true;
    }

    if (this.obj_producto.descripcion == "") {
      this.validar_descripcion = false;
    } else {
      this.validar_descripcion = true;
    }

    if (this.obj_producto.precio == 0 || this.obj_producto.precio == 0) {
      this.validar_precio = false;
    } else {
      this.validar_precio = true;
    }

    if (this.obj_producto.estado == "") {
      this.validar_estado = false;
    } else {
      this.validar_estado = true;
    }

    if (this.obj_producto.id_artista == 0 || this.obj_producto.id_artista == 0) {
      this.validar_id_artista = false;
    } else {
      this.validar_id_artista = true;
    }

    if (this.obj_producto.stock == 0 || this.obj_producto.stock == 0) {
      this.validar_stock = false;
    } else {
      this.validar_stock = true;
    }


    if (this.validar_titulo && this.validar_descripcion && this.validar_precio && this.validar_estado && this.validar_id_artista && this.validar_stock && funcion == 'guardar') {
      this.guardar();
    }

    if (this.validar_titulo && this.validar_descripcion && this.validar_precio && this.validar_estado && this.validar_id_artista && this.validar_stock && funcion == 'editar') {
      this.editar();
    }

  }

  guardar() {
    console.log(" Enviando estos datos a PHP:", this.obj_producto);

    this.sobra.insertar(this.obj_producto).subscribe({
      next: (datos: any) => {
        console.log(" Respuesta recibida de PHP:", datos);


        if (datos['resultado'] == 'OK' || datos['resultado'] == 'ok') {
          this.consulta();
        }
      },
      error: (error: any) => {
        console.error(" Falló la conexión con PHP o hubo un error en la Base de Datos:", error);
      }
    });

    this.limpiar();
    this.mostrar_form("no ver");
  }

  eliminar(id: number) {
    Swal.fire({
      title: "¿Estas seguro de eliminar?",
      text: "El proceso no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        ////////


        this.sobra.eliminar(id).subscribe((datos: any) => {
          if (datos['resultado'] == 'OK') {
            this.consulta();
          }
        })



        //////////





        Swal.fire({
          title: "Producto eliminado!",
          text: "El producto a sido eliminado.",
          icon: "success"
        });
      }
    });






  };


  cargar_datos(items: any, id: number) {

    this.obj_producto = {
      titulo: items.titulo,
      descripcion: items.descripcion,
      precio: items.precio,
      estado: items.estado,
      id_artista: items.id_artista,
      stock: items.stock
    };

    this.id_producto = items.id_obra; 


    this.botones_form = true;
    this.mostrar_form('ver');
  }


  editar(){
    this.sobra.editar(this.id_producto, this.obj_producto).subscribe((datos:any) => {
      if(datos['resultado']=="OK"){
        this.consulta();
      }
    });
    this.limpiar();
    this.mostrar_form("no ver");

  }



}