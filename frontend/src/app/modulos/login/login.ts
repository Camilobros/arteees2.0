import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  correo: any;
  contrasena: any;
  error = false;
  usuario: any
  user = {
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "",
  };

  constructor(private slogin: Login , private router: Router){}

  ngOnInit(): void{

  }

  consulta(tecla: any){
    if(tecla === 13 || tecla === ""){
      this.slogin.consulta(this.correo , this.contrasena).subscribe((resultado:any)=>{
        this.usuario = resultado;
      })
    }
  }

}
