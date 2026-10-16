import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Obra } from '../../servicios/obra';
import { Artista } from '../../servicios/artista';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  productos: any[] = [];
  obra: any;
  artista: any[] = [];
  id_producto: any;

  // Ahora obj_producto incluye origen, disciplina e imagen
  obj_producto = {
    titulo: '',
    descripcion: '',
    precio: 0,
    estado: '',
    id_artista: 0,
    stock: 0,
    origen: 'human',
    disciplina: 'sculpture',
    imagen: ''
  };

  // Variables de validación
  validar_titulo = true;
  validar_descripcion = true;
  validar_precio = true;
  validar_estado = true;
  validar_artista = true;
  validar_stock = true;
  validar_id_artista = true;

  mform = false;
  botones_form = false;

  // Variables de filtros de la tabla
  filtroTexto: string = '';
  filtroEstado: string = 'todos';
  filtroOrigen: string = 'todos';
  nombreArchivoSubido: string = 'Ningún archivo seleccionado';
  hashActual: string = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  // Imágenes de respaldo por si una obra antigua no tiene foto guardada
  imagenesGaleria: string[] = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC_md2-LsZLmDFT-K_B9K7519heevKq48h_VTELCtfMzoM1AoDPbqJtesrDAxlc1wVgYT29QH4cHaAJYcDC7nani45cy1-WgNx1A7iV-iyoZo_ES3LeauKDJr23ctBumboiuGDvmrGwSTJFmNgTIZdxTRpN14hfIYZp6vvmgA5kM-GsgVWIvCvIsakR4nYbv_kc8BfOP75XephZMfms17iqWv17yhHUgR9VAxU0Oz941vWyRVKZlu_dPQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDkaejT-LakJdjbS6n1xldAilNe-52Qaquz71olcX1Ymj-pfmCKXhtCjz4fPq9vziyanaymLPi08qEpnJ1FHkX_G4e5dgE9fRJnWVh5NH9oqF77L6d5MzTAbNAXiSMi8-QFAIhhbutRd6yTed_KF1IfYIwpM46VJ5JSZv49tNicvWcJtU3AfdhCiB0owsaYrTmQNU3_OvimGeXdwSRu1gjHH1AjcqGgazBr_Sd9_QxHj54Z0VW6zDFdfA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA65ahsOvDT5uzIp9f9a3hbZ-cgDBmye9pLFD9wbT_LbfBUNoEpyPNpcDIPgWnEDxaIZclKDk1rkZSinIqOCSt-TqN_ro8L_tQ0nZxXMXF2q2Qa381lf3kmg_zv0kPl6HcVlOR2cRBCSeD1ETiGFykFeBB0_C6wAYdqLVsFh4Imr06M5Ypbwj6fSYdUgfFTEltUFK91jvNNSZOO7I777gjyKznRRE8CwiaKqpdoRxO7M6rPu_4H3M9gAw',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAska6oNMWiKEHc4xKQVfIS4TTCP_nwE_D7KtOWfGKKTU9MmzCxVYj_sivlba3rHACx1nwcMYxl7NCkhokJULtIUCMN_PEN2nWkhEI-4z0TV_Ql-lfGDWD3zHMApORU1qqFBDdvc-e4GccX-ITqj-Pxp7xpouhIUKhQYYCweCoRgS6Zd5UmhRg7LgFhMNA9P26qMXPYUXOjA8g6Wyz0GrWTzny9VxlhOwY6kQRLPN44QfLu-tuo9l3Lhw'
  ];

  constructor(
    private sobra: Obra,
    private cdr: ChangeDetectorRef,
    private sartis: Artista
  ) {}

  ngOnInit(): void {
    this.consulta();
    this.consulta_ar();
  }

  consulta(): void {
    this.sobra.consulta().subscribe({
      next: (resultado: any) => {
        this.productos = Array.isArray(resultado) ? resultado : [];
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error al conectar con PHP:', error);
      },
    });
  }

  consulta_ar(): void {
    this.sartis.consulta().subscribe((resultado: any) => {
      this.artista = Array.isArray(resultado) ? resultado : [];
      this.cdr.detectChanges();
    });
  }

  // Contadores dinámicos para las tarjetas superiores
  get totalHumanos(): number {
    return this.productos.filter(p => (p.origen || 'human') === 'human').length;
  }

  get totalIA(): number {
    return this.productos.filter(p => p.origen === 'ai').length;
  }

  // Filtro en tiempo real por texto, estado y régimen (Humano / IA)
  get productosFiltrados(): any[] {
    return this.productos.filter((item) => {
      const texto = this.filtroTexto.toLowerCase().trim();
      const coincideTexto =
        !texto ||
        (item.titulo && item.titulo.toLowerCase().includes(texto)) ||
        (item.artista && item.artista.toLowerCase().includes(texto)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(texto));

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (item.estado && item.estado.toLowerCase() === this.filtroEstado.toLowerCase());

      const origenItem = item.origen || 'human';
      const coincideOrigen =
        this.filtroOrigen === 'todos' || origenItem === this.filtroOrigen;

      return coincideTexto && coincideEstado && coincideOrigen;
    });
  }

  mostrar_form(dato: any): void {
    switch (dato) {
      case 'ver':
        this.mform = true;
        setTimeout(() => {
          const el = document.getElementById('registration-container');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        break;
      case 'no ver':
        this.mform = false;
        this.botones_form = false;
        this.limpiar();
        break;
    }
  }

  limpiar(): void {
    this.obj_producto = {
      titulo: '',
      descripcion: '',
      precio: 0,
      estado: '',
      id_artista: 0,
      stock: 0,
      origen: 'human',
      disciplina: 'sculpture',
      imagen: ''
    };
    this.nombreArchivoSubido = 'Ningún archivo seleccionado';
    this.validar_titulo = true;
    this.validar_descripcion = true;
    this.validar_precio = true;
    this.validar_estado = true;
    this.validar_id_artista = true;
    this.validar_stock = true;
  }

  // Selecciona entre Humano ('human') e IA ('ai') y lo guarda en obj_producto.origen
  setOriginType(type: 'human' | 'ai'): void {
    this.obj_producto.origen = type;
  }

  // Lee la foto que el usuario selecciona desde su PC
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.nombreArchivoSubido = `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
      const reader = new FileReader();
      reader.onload = () => {
        this.obj_producto.imagen = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  validar(funcion: any): void {
    this.validar_titulo = this.obj_producto.titulo.trim() !== '';
    this.validar_descripcion = this.obj_producto.descripcion.trim() !== '';
    this.validar_precio = Number(this.obj_producto.precio) > 0;
    this.validar_estado = this.obj_producto.estado !== '';
    this.validar_id_artista = Number(this.obj_producto.id_artista) > 0;
    this.validar_stock = Number(this.obj_producto.stock) > 0;

    if (
      this.validar_titulo &&
      this.validar_descripcion &&
      this.validar_precio &&
      this.validar_estado &&
      this.validar_id_artista &&
      this.validar_stock
    ) {
      if (funcion === 'guardar') {
        this.guardar();
      } else if (funcion === 'editar') {
        this.editar();
      }
    }
  }

  guardar(): void {
    this.sobra.insertar(this.obj_producto).subscribe({
      next: (datos: any) => {
        if (datos['resultado'] === 'OK' || datos['resultado'] === 'ok') {
          Swal.fire({
            title: '¡Obra publicada!',
            text: 'La obra, su régimen y su imagen han sido guardados.',
            icon: 'success',
          });
          this.consulta();
        }
      },
      error: (error: any) => {
        console.error('Error al insertar en la Base de Datos:', error);
      },
    });
    this.limpiar();
    this.mostrar_form('no ver');
  }

  cargar_datos(items: any, id: number): void {
    this.obj_producto = {
      titulo: items.titulo,
      descripcion: items.descripcion,
      precio: items.precio,
      estado: items.estado,
      id_artista: items.id_artista,
      stock: items.stock,
      origen: items.origen || 'human',
      disciplina: items.disciplina || 'sculpture',
      imagen: items.imagen || ''
    };
    this.nombreArchivoSubido = items.imagen ? 'Imagen registrada en catálogo' : 'Ningún archivo seleccionado';
    this.id_producto = id;
    this.botones_form = true;
    this.mostrar_form('ver');
  }

  editar(): void {
    this.sobra.editar(this.id_producto, this.obj_producto).subscribe((datos: any) => {
      if (datos && (datos['resultado'] === 'OK' || datos['resultado'] === 'ok')) {
        Swal.fire({
          title: '¡Registro actualizado!',
          text: 'La ficha técnica se actualizó correctamente.',
          icon: 'success',
        });
        this.consulta();
      }
    });
    this.limpiar();
    this.mostrar_form('no ver');
  }

  eliminar(id: number): void {
    Swal.fire({
      title: '¿Retirar obra del catálogo?',
      text: 'Esta acción eliminará el registro de la base de datos.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000000',
      cancelButtonColor: '#aa361e',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sobra.eliminar(id).subscribe((datos: any) => {
          if (datos['resultado'] === 'OK' || datos['resultado'] === 'ok') {
            this.consulta();
            Swal.fire({
              title: '¡Obra eliminada!',
              text: 'El registro ha sido retirado del catálogo.',
              icon: 'success',
            });
          }
        });
      }
    });
  }

  regenerarHash(): void {
    const chars = '0123456789abcdef';
    let nuevo = '';
    for (let i = 0; i < 64; i++) {
      nuevo += chars[Math.floor(Math.random() * chars.length)];
    }
    this.hashActual = nuevo;
  }

  // Muestra la foto real subida por el usuario o una de respaldo si está vacía
  obtenerImagenObra(item: any, index: number): string {
    if (item.imagen && item.imagen.trim() !== '') {
      return item.imagen;
    }
    return this.imagenesGaleria[index % this.imagenesGaleria.length];
  }
}