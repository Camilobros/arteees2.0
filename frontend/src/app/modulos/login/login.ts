import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../servicios/login';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
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

  constructor(private slogin: LoginService , private router: Router){}

  ngOnInit(): void{
    
    sessionStorage.setItem("id", "");
    sessionStorage.setItem("correo", "");
    sessionStorage.setItem("nombre", "");
    sessionStorage.setItem("rol", "");
    

  }

  consulta(tecla: any){
    if(tecla == 13 || tecla == ""){
      this.slogin.consulta(this.correo, this.contrasena).subscribe((resultado:any)=>{
        this.usuario = resultado;
        console.log(this.usuario)

        if(this.usuario[0].validar=="validar"){
          sessionStorage.setItem("id", this.usuario[0]['id_usuario'])
          sessionStorage.setItem("correo", this.usuario[0]['correo'])
          sessionStorage.setItem("nombre", this.usuario[0]['nombre'])
          sessionStorage.setItem("rol", this.usuario[0]['rol'])

          this.router.navigate(['dashboard']);

        }else{
          this.error = true
        }
      })
    }
  }

}
