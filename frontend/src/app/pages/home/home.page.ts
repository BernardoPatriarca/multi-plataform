import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  logOutOutline, peopleOutline, chevronForwardOutline, personCircleOutline,
  checkmarkCircleOutline, sparklesOutline, cubeOutline, walletOutline,
  moonOutline, sunnyOutline, barChartOutline, alertCircleOutline, timeOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { RelatorioService } from '../../core/services/relatorio.service';
import { ThemeService } from '../../core/services/theme.service';

interface MenuTile {
  titulo: string;
  descricao: string;
  icone: string;
  rota: string;
  classe: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonSkeletonText
  ]
})
export class HomePage implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private relatorioService = inject(RelatorioService);
  private router = inject(Router);

  totalUsuarios: number | null = null;
  totalProdutos: number | null = null;
  saldoFinanceiro: number | null = null;
  estoqueBaixo: number | null = null;
  aVencer: number | null = null;

  menuTiles: MenuTile[] = [
    {
      titulo: 'Financeiro',
      descricao: 'Receitas, despesas e saldo em um so lugar',
      icone: 'wallet-outline',
      rota: '/tabs/financeiro',
      classe: 'tile-financeiro'
    },
    {
      titulo: 'Estoque',
      descricao: 'Cadastre produtos, controle quantidades e precos',
      icone: 'cube-outline',
      rota: '/tabs/estoque',
      classe: 'tile-estoque'
    },
    {
      titulo: 'Relatorios',
      descricao: 'Graficos e indicadores de todo o sistema',
      icone: 'bar-chart-outline',
      rota: '/tabs/relatorios',
      classe: 'tile-relatorios'
    },
    {
      titulo: 'Usuarios',
      descricao: 'Gerencie contas, permissoes e dados cadastrais',
      icone: 'people-outline',
      rota: '/tabs/usuarios',
      classe: 'tile-usuarios'
    }
  ];

  constructor() {
    addIcons({
      logOutOutline, peopleOutline, chevronForwardOutline, personCircleOutline,
      checkmarkCircleOutline, sparklesOutline, cubeOutline, walletOutline,
      moonOutline, sunnyOutline, barChartOutline, alertCircleOutline, timeOutline
    });
  }

  ngOnInit(): void {
    this.relatorioService.dashboard().subscribe({
      next: (dados) => {
        this.totalUsuarios = dados.totalUsuarios;
        this.totalProdutos = dados.totalProdutos;
        this.saldoFinanceiro = dados.saldo;
        this.estoqueBaixo = dados.totalProdutosEstoqueBaixo;
        this.aVencer = dados.lancamentosAVencer;
      }
    });
  }

  get iniciais(): string {
    const nome = this.authService.currentUser()?.nome ?? '';
    return nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('');
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  goTo(rota: string): void {
    this.router.navigate([rota]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
