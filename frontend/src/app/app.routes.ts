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
    path: 'tabs',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage)
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios.page').then((m) => m.UsuariosPage)
      },
      {
        path: 'estoque',
        loadComponent: () => import('./pages/estoque/estoque.page').then((m) => m.EstoquePage)
      },
      {
        path: 'financeiro',
        loadComponent: () => import('./pages/financeiro/financeiro.page').then((m) => m.FinanceiroPage)
      },
      {
        path: 'relatorios',
        loadComponent: () => import('./pages/relatorios/relatorios.page').then((m) => m.RelatoriosPage)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
