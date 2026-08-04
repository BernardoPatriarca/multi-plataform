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
  moonOutline, sunnyOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { ProdutoService } from '../../core/services/produto.service';
import { LancamentoService } from '../../core/services/lancamento.service';
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
  private usuarioService = inject(UsuarioService);
  private produtoService = inject(ProdutoService);
  private lancamentoService = inject(LancamentoService);
  private router = inject(Router);

  totalUsuarios: number | null = null;
  totalProdutos: number | null = null;
  saldoFinanceiro: number | null = null;
  loadingStats = true;

  menuTiles: MenuTile[] = [
    {
      titulo: 'Usuarios',
      descricao: 'Gerencie contas, permissoes e dados cadastrais',
      icone: 'people-outline',
      rota: '/usuarios',
      classe: 'tile-usuarios'
    },
    {
      titulo: 'Estoque',
      descricao: 'Cadastre produtos, controle quantidades e precos',
      icone: 'cube-outline',
      rota: '/estoque',
      classe: 'tile-estoque'
    },
    {
      titulo: 'Financeiro',
      descricao: 'Receitas, despesas e saldo em um so lugar',
      icone: 'wallet-outline',
      rota: '/financeiro',
      classe: 'tile-financeiro'
    }
  ];

  constructor() {
    addIcons({
      logOutOutline, peopleOutline, chevronForwardOutline, personCircleOutline,
      checkmarkCircleOutline, sparklesOutline, cubeOutline, walletOutline,
      moonOutline, sunnyOutline
    });
  }

  ngOnInit(): void {
    this.usuarioService.search('', '', 0, 1).subscribe({
      next: (result) => (this.totalUsuarios = result.totalElements)
    });

    this.produtoService.search('', '', 0, 1).subscribe({
      next: (result) => (this.totalProdutos = result.totalElements)
    });

    this.lancamentoService.resumo().subscribe({
      next: (resumo) => {
        this.saldoFinanceiro = resumo.saldo;
        this.loadingStats = false;
      },
      error: () => (this.loadingStats = false)
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
