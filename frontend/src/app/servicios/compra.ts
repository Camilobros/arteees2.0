import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompraService {
  url = 'http://localhost/proyectos/arteees2.0/backend/controladores/compra.php';

  constructor(private http: HttpClient) {}

  comprar(datosCompra: {
    id_usuario: number;
    nombre_comprador: string;
    correo_comprador: string;
    id_obra: number;
    cantidad: number;
  }) {
    return this.http.post(`${this.url}?control=comprar`, JSON.stringify(datosCompra));
  }

  // Trae lo que el usuario actual ha comprado
  misCompras(correo: string) {
    return this.http.get(`${this.url}?control=mis_compras&correo=${encodeURIComponent(correo)}`);
  }

  // Trae las obras que le han comprado al artista actual (y qué usuario se las compró)
  misVentas(correo: string) {
    return this.http.get(`${this.url}?control=mis_ventas&correo=${encodeURIComponent(correo)}`);
  }

  // Trae todo el historial para el Administrador
  consultaGeneral() {
    return this.http.get(`${this.url}?control=consulta`);
  }
}