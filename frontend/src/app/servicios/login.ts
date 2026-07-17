import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Login {

  url = "http://localhost/proyectos/arteees2.0/backend/controladores/login.php";

  constructor(private http:HttpClient){};


  consulta(correo : any , contrasena:any){
    return this.http.get(`${this.url}?correo=${correo}&contrasena=${contrasena}`);
  }

  
}
