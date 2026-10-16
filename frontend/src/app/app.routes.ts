import { Routes } from '@angular/router';
import { Main } from './estructura/main';
import { Dashboard } from './modulos/dashboard/dashboard';
import { Clientes } from './modulos/clientes/clientes';
import { Productos } from './modulos/productos/productos';
import { Login } from './modulos/login/login';
import { NoEncontro } from './modulos/no-encontro/no-encontro';
import { validaruserGuard } from './guard/validaruser-guard';
import { Pedido } from './modulos/pedido/pedido';
import { Categoria } from './modulos/categoria/categoria';
import { Usuario } from './modulos/usuario/usuario';
import { Pedidoinsertar } from './modulos/pedidoinsertar/pedidoinsertar';

export const routes: Routes = [
    {
        path: '', component: Main,
        children:
        [

            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: Dashboard},
            {path: 'clientes', component: Clientes  , canActivate : [validaruserGuard]},
            {path: 'productos', component: Productos  , canActivate : [validaruserGuard]},
            {path: 'pedido', component: Pedido  , canActivate : [validaruserGuard]},
            {path: 'usuario', component: Usuario  , canActivate : [validaruserGuard]},
            {path: 'categoria', component: Categoria  , canActivate : [validaruserGuard]},
            {path: 'pedidoins', component: Pedidoinsertar  , canActivate : [validaruserGuard]},


            
            
        ]
    },

    {path: 'login', component: Login},
    {path: '**', component: NoEncontro}
];
