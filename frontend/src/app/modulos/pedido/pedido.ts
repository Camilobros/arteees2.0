import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompraService } from '../../servicios/compra';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
})
export class Pedido implements OnInit {
  // Datos de la sesión activa
  nombreSesion: string = '';
  correoSesion: string = '';
  rolSesion: string = '';

  // Pestaña activa: 'compras' (lo que yo compré) | 'ventas' (lo que me compraron como artista)
  tabActiva: 'compras' | 'ventas' = 'compras';

  listaMisCompras: any[] = [];
  listaMisVentas: any[] = [];
  filtroBusqueda: string = '';

  constructor(
    private sCompra: CompraService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.nombreSesion = sessionStorage.getItem('nombre') || 'Usuario';
    this.correoSesion = sessionStorage.getItem('correo') || '';
    this.rolSesion = sessionStorage.getItem('rol') || 'cliente';

    // Si es artista o admin, abrimos primero la tabla de Ventas recibidas; si es cliente, Mis Compras
    if (this.rolSesion === 'artista' || this.rolSesion === 'admin') {
      this.tabActiva = 'ventas';
    } else {
      this.tabActiva = 'compras';
    }

    this.cargarDatosAutomaticos();
  }

  cargarDatosAutomaticos(): void {
    if (!this.correoSesion) return;

    // 1. Cargamos las compras hechas por este usuario
    this.sCompra.misCompras(this.correoSesion).subscribe({
      next: (res: any) => {
        this.listaMisCompras = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error cargando mis compras:', err)
    });

    // 2. Si es Artista, cargamos las ventas de sus obras; si es Admin, todas las ventas
    if (this.rolSesion === 'artista') {
      this.sCompra.misVentas(this.correoSesion).subscribe({
        next: (res: any) => {
          this.listaMisVentas = Array.isArray(res) ? res : [];
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Error cargando ventas del artista:', err)
      });
    } else if (this.rolSesion === 'admin') {
      this.sCompra.consultaGeneral().subscribe({
        next: (res: any) => {
          this.listaMisVentas = Array.isArray(res) ? res : [];
          this.cdr.detectChanges();
        }
      });
    }
  }

  cambiarTab(tab: 'compras' | 'ventas'): void {
    this.tabActiva = tab;
  }

  // Lista filtrada según la pestaña activa y el buscador
  get registrosActuales(): any[] {
    const base = this.tabActiva === 'compras' ? this.listaMisCompras : this.listaMisVentas;
    const q = this.filtroBusqueda.toLowerCase().trim();
    if (!q) return base;

    return base.filter(item =>
      (item.titulo_obra && item.titulo_obra.toLowerCase().includes(q)) ||
      (item.nombre_comprador && item.nombre_comprador.toLowerCase().includes(q)) ||
      (item.correo_comprador && item.correo_comprador.toLowerCase().includes(q)) ||
      (item.nombre_artista && item.nombre_artista.toLowerCase().includes(q)) ||
      String(item.id_compra).includes(q)
    );
  }

  get totalDineroCompras(): number {
    return this.listaMisCompras.reduce((acc, item) => acc + Number(item.total || 0), 0);
  }

  get totalDineroVentas(): number {
    return this.listaMisVentas.reduce((acc, item) => acc + Number(item.total || 0), 0);
  }

  // Muestra el certificado SHA-256 de la compra/venta
  verCertificado(item: any): void {
    Swal.fire({
      title: `Certificado #OP-${item.id_compra}`,
      html: `
        <div style="text-align: left; font-size: 13px; line-height: 1.6;">
          <p><strong>Obra:</strong> ${item.titulo_obra}</p>
          <p><strong>Artista Creador:</strong> ${item.nombre_artista}</p>
          <p><strong>Comprador:</strong> ${item.nombre_comprador} (${item.correo_comprador})</p>
          <p><strong>Cantidad:</strong> ${item.cantidad} ud.</p>
          <p><strong>Total Liquidado:</strong> $${Number(item.total).toLocaleString('es-CO')} COP</p>
          <p><strong>Fecha:</strong> ${item.fecha}</p>
          <p style="margin-top:8px;"><strong>Firma Criptográfica SHA-256:</strong></p>
          <code style="display:block; padding:6px; background:#f5f3ef; font-size:10px; word-break:break-all;">
            ${item.hash_transaccion}
          </code>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#000000',
      confirmButtonText: 'Cerrar Certificado'
    });
  }
}