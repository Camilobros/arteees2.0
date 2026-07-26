import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pedido',
  imports: [],
  templateUrl: './pedido.html',
  styleUrl: './pedido.css',
})
export class Pedido {

  ventas : any;

  constructor(private router: Router){}
  ngOnInit(){
    
  }


  

}
