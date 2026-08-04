import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/usuarios/usuarios.page').then((m) => m.UsuariosPage)
  },
  {
    path: 'estoque',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/estoque/estoque.page').then((m) => m.EstoquePage)
  },
  {
    path: 'financeiro',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/financeiro/financeiro.page').then((m) => m.FinanceiroPage)
  },
  { path: '**', redirectTo: 'login' }
];
