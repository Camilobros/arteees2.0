import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  // Tus variables originales de sesión
  nombre: any;
  rol: any;

  // Variable nueva para controlar si el menú hamburguesa está abierto o cerrado
  isDrawerOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nombre = sessionStorage.getItem("nombre");
    this.rol = sessionStorage.getItem("rol");
  }

  // Abre el menú lateral y actualiza los datos de sesión por si acaban de loguearse
  openDrawer(): void {
    this.nombre = sessionStorage.getItem("nombre");
    this.rol = sessionStorage.getItem("rol");
    this.isDrawerOpen = true;
    document.body.style.overflow = 'hidden';
  }

  // Cierra el menú lateral
  closeDrawer(): void {
    this.isDrawerOpen = false;
    document.body.style.overflow = '';
  }

  // Cierra el menú si presionas la tecla Escape
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isDrawerOpen) {
      this.closeDrawer();
    }
  }

  // Navega a la ruta que elijas en el menú y cierra el panel lateral
  irA(ruta: string): void {
    this.closeDrawer();
    this.router.navigate([ruta]);
  }

  // Tu función  cerrar sesión 
  cerrar() {
    this.closeDrawer();
    sessionStorage.setItem("id", "");
    sessionStorage.setItem("correo", "");
    sessionStorage.setItem("nombre", "");
    sessionStorage.setItem("rol", "");
    this.nombre = "";
    this.rol = "";
    this.router.navigate(['login']);
  }
}