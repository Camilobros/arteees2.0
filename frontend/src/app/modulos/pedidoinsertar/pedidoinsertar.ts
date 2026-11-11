import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Obra } from '../../servicios/obra';
import { Cliente } from '../../servicios/cliente';
import { Pedidoservice } from '../../servicios/pedidoservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidoinsertar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pedidoinsertar.html',
  styleUrl: './pedidoinsertar.css',
})
export class Pedidoinsertar implements OnInit {
  obras: any[] = [];
  listaClientes: any[] = [];
  filtroObra: string = '';

  // Datos automáticos tomados de la sesión activa (Comprador o Artista)
  nombreSesion: string = '';
  correoSesion: string = '';
  rolSesion: string = '';
  idClienteComprador: number = 0;
  idArtistaVendedor: number = 1;

  // Estructura de matriz para PHP: [id_obra, titulo, precio, cantidad, subtotal]
  matriz_producto: any[] = [];
  arreglo_productos: any[] = [];
  total: number = 0;

  pedido = {
    fecha: '',
    id_cliente: 0,
    productos: [] as any[],
    subtotal: 0,
    total: 0,
    id_artista: 1
  };

  constructor(
    private router: Router,
    private sobra: Obra,
    private scliente: Cliente,
    private spedido: Pedidoservice,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatosSesion();
    this.consulta_obra();
    this.vincularCompradorConSesion();
  }

  // 1. Lee automáticamente quién está logueado en el navegador
  cargarDatosSesion(): void {
    this.nombreSesion = sessionStorage.getItem('nombre') || 'Usuario Galería';
    this.correoSesion = sessionStorage.getItem('correo') || '';
    this.rolSesion = sessionStorage.getItem('rol') || 'cliente';
  }

  // 2. Busca el id_cliente correspondiente al usuario con sesión iniciada
  vincularCompradorConSesion(): void {
    this.scliente.consulta().subscribe({
      next: (result: any) => {
        this.listaClientes = Array.isArray(result) ? result : [];

        // Buscamos si el correo o nombre de la sesión ya tiene ficha en la tabla 'cliente'
        const clienteEncontrado = this.listaClientes.find(
          c =>
            (c.correo && c.correo.toLowerCase() === this.correoSesion.toLowerCase()) ||
            (c.nombre && c.nombre.toLowerCase() === this.nombreSesion.toLowerCase())
        );

        if (clienteEncontrado) {
          this.idClienteComprador = Number(clienteEncontrado.id_cliente);
        } else {
          // Si es un Artista o Admin que aún no está en la tabla 'cliente', lo dejamos en 0
          // para crearle su perfil de comprador automáticamente al confirmar el pedido
          this.idClienteComprador = 0;
        }
        this.cdr.detectChanges();
      }
    });
  }

  consulta_obra(): void {
    this.sobra.consulta().subscribe({
      next: (result: any) => {
        this.obras = Array.isArray(result) ? result : [];
        this.cdr.detectChanges();
      }
    });
  }

  get obrasFiltradas(): any[] {
    const q = this.filtroObra.toLowerCase().trim();
    if (!q) return this.obras;
    return this.obras.filter(o =>
      (o.titulo && o.titulo.toLowerCase().includes(q)) ||
      (o.artista && o.artista.toLowerCase().includes(q)) ||
      String(o.id_obra).includes(q)
    );
  }

  // Agrega obra al carrito y asigna automáticamente el id_artista dueño de la obra
  seleccionar(valores: any, id: number): void {
    const stockMax = Number(valores.stock || 0);
    if (stockMax <= 0) {
      Swal.fire('Sin stock', 'Esta obra no tiene unidades disponibles.', 'warning');
      return;
    }

    // Tomamos automáticamente el id_artista creador de la obra
    if (valores.id_artista) {
      this.idArtistaVendedor = Number(valores.id_artista);
    }

    const indiceExistente = this.matriz_producto.findIndex(item => Number(item[0]) === Number(valores.id_obra));

    if (indiceExistente !== -1) {
      const cantActual = Number(this.matriz_producto[indiceExistente][3]);
      if (cantActual + 1 > stockMax) {
        Swal.fire('Stock límite alcanzado', `Solo hay ${stockMax} unidades disponibles de "${valores.titulo}".`, 'info');
        return;
      }
      this.matriz_producto[indiceExistente][3] = cantActual + 1;
      this.matriz_producto[indiceExistente][4] = this.matriz_producto[indiceExistente][3] * Number(valores.precio);
    } else {
      const precio = Number(valores.precio);
      this.arreglo_productos = [valores.id_obra, valores.titulo, precio, 1, precio];
      this.matriz_producto.push(this.arreglo_productos);
    }

    this.recalcularTotal();
  }

  cambiarCantidad(index: number, delta: number): void {
    const item = this.matriz_producto[index];
    const obraOriginal = this.obras.find(o => Number(o.id_obra) === Number(item[0]));
    const stockMax = obraOriginal ? Number(obraOriginal.stock) : 999;

    const nuevaCantidad = Number(item[3]) + delta;

    if (nuevaCantidad <= 0) {
      this.eliminarDelCarrito(index);
      return;
    }

    if (nuevaCantidad > stockMax) {
      Swal.fire('Límite de stock', `Máximo disponible: ${stockMax} unidades.`, 'info');
      return;
    }

    item[3] = nuevaCantidad;
    item[4] = nuevaCantidad * Number(item[2]);
    this.recalcularTotal();
  }

  eliminarDelCarrito(index: number): void {
    this.matriz_producto.splice(index, 1);
    this.recalcularTotal();
  }

  recalcularTotal(): void {
    this.total = 0;
    for (let i = 0; i < this.matriz_producto.length; i++) {
      this.total += Number(this.matriz_producto[i][4]);
    }
  }

  // Verifica si el artista/comprador ya tiene id_cliente o lo registra automáticamente
  guardar(): void {
    if (this.matriz_producto.length === 0) {
      Swal.fire('Carrito vacío', 'Selecciona al menos una obra del catálogo.', 'warning');
      return;
    }

    // Si ya encontramos su id_cliente en la tabla cliente, guardamos directo
    if (this.idClienteComprador > 0) {
      this.enviarPedidoAPhp(this.idClienteComprador);
      return;
    }

    // Si es un Artista (o usuario nuevo) comprando y aún no está en la tabla 'cliente',
    // lo registramos automáticamente en 'cliente' para cumplir la llave foránea de MySQL
    const nuevoCliente = {
      nombre: this.nombreSesion,
      correo: this.correoSesion || `${this.nombreSesion.toLowerCase().replace(/\s+/g, '')}@galeriaopera.com`,
      direccion: `Cuenta ${this.rolSesion.toUpperCase()} • Galería Ópera`
    };

    this.scliente.insertar(nuevoCliente).subscribe({
      next: () => {
        // Consultamos de nuevo para obtener el id_cliente recién creado
        this.scliente.consulta().subscribe((res: any) => {
          const lista = Array.isArray(res) ? res : [];
          const creado = lista.find(
            c => c.correo && c.correo.toLowerCase() === nuevoCliente.correo.toLowerCase()
          );
          const idFinal = creado ? Number(creado.id_cliente) : (lista[0] ? Number(lista[0].id_cliente) : 1);
          this.idClienteComprador = idFinal;
          this.enviarPedidoAPhp(idFinal);
        });
      },
      error: () => {
        // Respaldo de seguridad si el correo ya existía
        const idRespaldo = this.listaClientes.length > 0 ? Number(this.listaClientes[0].id_cliente) : 1;
        this.enviarPedidoAPhp(idRespaldo);
      }
    });
  }

  private enviarPedidoAPhp(idCliente: number): void {
    const fecha = new Date();
    this.pedido.fecha = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`;
    this.pedido.id_cliente = idCliente;
    this.pedido.productos = this.matriz_producto;
    this.pedido.subtotal = this.total;
    this.pedido.total = this.total;
    this.pedido.id_artista = Number(this.idArtistaVendedor) || 1;

    this.spedido.insertar(this.pedido).subscribe({
      next: (datos: any) => {
        if (datos && (datos['resultado'] === 'OK' || datos['resultado'] === 'ok')) {
          Swal.fire({
            title: '¡Compra realizada!',
            text: `La adquisición fue registrada a nombre de ${this.nombreSesion}.`,
            icon: 'success'
          });
          this.router.navigate(['/pedido']);
        }
      },
      error: (err: any) => {
        console.error('Error al guardar el pedido:', err);
        Swal.fire('Error', 'No se pudo procesar la orden en la base de datos.', 'error');
      }
    });
  }
}