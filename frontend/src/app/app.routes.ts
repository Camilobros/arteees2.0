import { Routes } from '@angular/router';
import { Main } from './estructura/main';
import { Dashboard } from './modulos/dashboard/dashboard';
import { Clientes } from './modulos/clientes/clientes';
import { Productos } from './modulos/productos/productos';
import { Login } from './modulos/login/login';
import { NoEncontro } from './modulos/no-encontro/no-encontro';
import { validaruserGuard } from './guard/validaruser-guard';

export const routes: Routes = [
    {
        path: '', component: Main,
        children:
        [
            {path: 'dashboard', component: Dashboard , canActivate : [validaruserGuard]},
            {path: 'clientes', component: Clientes  , canActivate : [validaruserGuard]},
            {path: 'productos', component: Productos  , canActivate : [validaruserGuard]},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
            
        ]
    },

    {path: 'login', component: Login},
    {path: '**', component: NoEncontro}
];
