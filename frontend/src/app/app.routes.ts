import { Routes } from '@angular/router';
import { Main } from './estructura/main';
import { Dashboard } from './modulos/dashboard/dashboard';
import { Clientes } from './modulos/clientes/clientes';
import { Productos } from './modulos/productos/productos';
import { Login } from './modulos/login/login';
import { NoEncontro } from './modulos/no-encontro/no-encontro';

export const routes: Routes = [
    {
        path: '', component: Main,
        children:
        [
            {path: 'dashboard', component: Dashboard},
            {path: 'clientes', component: Clientes},
            {path: 'productos', component: Productos},
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
            
        ]
    },

    {path: 'login', component: Login},
    {path: '**', component: NoEncontro}
];
