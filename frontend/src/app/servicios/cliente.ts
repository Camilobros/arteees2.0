import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Cliente {
  
  url = "http://localhost/proyectos/arteees2.0/backend/controladores/cliente.php";

  constructor(private http: HttpClient){};

  consulta(){
    return this.http.get(`${this.url}?control=consulta`);
  }

  insertar(params: any){
    return this.http.post(`${this.url}?control=insertar`, JSON.stringify(params));
  }

  editar(id: number, params: any){
    return this.http.post(`${this.url}?control=editar&id=${id}`, JSON.stringify(params));
  }

  eliminar(id: number){
    return this.http.get(`${this.url}?control=eliminar&id=${id}`); 
  }

  filtro(dato: any) {
    return this.http.get(`${this.url}?control=filtro&dato=${dato}`);
  }

  ccliente(dato: any) {
    return this.http.get(`${this.url}?control=ccliente&dato=${dato}`);
  }

  
}
