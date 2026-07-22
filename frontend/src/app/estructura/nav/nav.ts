import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [FormsModule,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {

  rol: any;

  constructor(private router:Router){}
  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');
  }

}
