import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categoria.html',
  styleUrl: './categoria.css',
})
export class Categoria implements OnInit {
  coleccion: any[] = [];
  filtroOrigen: 'all' | 'human' | 'ai' = 'all';
  nombreUsuarioActual: string = '';

  ngOnInit(): void {
    this.nombreUsuarioActual = sessionStorage.getItem('nombre') || 'Visitante';
    // Limpiamos la clave global antigua para que no queden rastros mezclados
    localStorage.removeItem('coleccion_opera');
    this.cargarColeccion();
  }

  // Genera exactamente la misma clave única por usuario que el Dashboard
  private obtenerClaveColeccion(): string {
    const idUsuario = sessionStorage.getItem('id') || '';
    const nombreUsuario = sessionStorage.getItem('nombre') || '';
    const correoUsuario = sessionStorage.getItem('correo') || '';

    const identificador = (idUsuario + '_' + nombreUsuario + '_' + correoUsuario)
      .toLowerCase()
      .replace(/\s+/g, '');

    return identificador !== '__' ? `coleccion_opera_${identificador}` : 'coleccion_opera_visitante';
  }

  // Carga exclusivamente los favoritos de la cuenta actual
  cargarColeccion(): void {
    const claveUsuario = this.obtenerClaveColeccion();
    const guardadosTexto = localStorage.getItem(claveUsuario);
    this.coleccion = guardadosTexto ? JSON.parse(guardadosTexto) : [];
  }

  get coleccionFiltrada(): any[] {
    if (this.filtroOrigen === 'all') {
      return this.coleccion;
    }
    return this.coleccion.filter(obra => obra.origin === this.filtroOrigen);
  }

  get totalHumano(): number {
    return this.coleccion.filter(obra => obra.origin === 'human').length;
  }

  get totalIA(): number {
    return this.coleccion.filter(obra => obra.origin === 'ai').length;
  }

  cambiarFiltro(origen: 'all' | 'human' | 'ai'): void {
    this.filtroOrigen = origen;
  }

  // Quita una obra solo de la colección del usuario actual
  quitarDeColeccion(idObra: number): void {
    const claveUsuario = this.obtenerClaveColeccion();
    this.coleccion = this.coleccion.filter(obra => obra.id !== idObra);
    localStorage.setItem(claveUsuario, JSON.stringify(this.coleccion));
  }

  // Vacía solo la colección del usuario actual
  vaciarColeccion(): void {
    const claveUsuario = this.obtenerClaveColeccion();
    this.coleccion = [];
    localStorage.removeItem(claveUsuario);
  }
}