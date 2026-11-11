import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  nombre: any = '';
  rol: any = '';
  correo: any = '';
  isDrawerOpen: boolean = false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Cada vez que cambies de pantalla (ej. al entrar a Ventas y Pedidos),
    // recarga la sesión, asegura que el menú quede destrabado y despierta a Angular
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.cargarSesion();
        this.isDrawerOpen = false;
        document.body.style.overflow = '';
        this.cdr.detectChanges();
      });
  }

  ngOnInit(): void {
    this.cargarSesion();
  }

  cargarSesion(): void {
    this.nombre = sessionStorage.getItem('nombre');
    this.rol = sessionStorage.getItem('rol');
    this.correo = sessionStorage.getItem('correo');
  }

  // Abre el menú hamburguesa forzando el redibujado inmediato
  openDrawer(): void {
    this.cargarSesion();
    this.isDrawerOpen = true;
    this.cdr.detectChanges();
  }

  // Cierra el menú hamburguesa forzando el redibujado inmediato
  closeDrawer(): void {
    this.isDrawerOpen = false;
    document.body.style.overflow = '';
    this.cdr.detectChanges();
  }

  // Tu función irA() intacta pero asegurada con el despertador de Angular
  irA(ruta: string): void {
    this.isDrawerOpen = false;
    document.body.style.overflow = '';
    this.cdr.detectChanges();
    this.router.navigate(['/' + ruta.replace(/^\//, '')]);
  }

  // Detecta en qué sección está el usuario para subrayarla en el menú
  isActive(ruta: string): boolean {
    return this.router.url ? this.router.url.includes(ruta) : false;
  }

  cerrar(): void {
    sessionStorage.clear();
    this.nombre = null;
    this.rol = null;
    this.correo = null;
    this.isDrawerOpen = false;
    document.body.style.overflow = '';
    this.cdr.detectChanges();
    this.router.navigate(['/login']);
  }
}