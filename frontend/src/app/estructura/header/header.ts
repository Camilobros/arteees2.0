import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  nombre: any;
  rol: any;

  constructor(private router:Router){}
  ngOnInit(): void {
    this.nombre = sessionStorage.getItem("nombre")
    this.rol = sessionStorage.getItem("rol");
  }

  cerrar(){
        sessionStorage.setItem("id", "");
    sessionStorage.setItem("correo", "");
    sessionStorage.setItem("nombre", "");
    sessionStorage.setItem("rol", "");
    this.router.navigate(['login']);

  }

}
