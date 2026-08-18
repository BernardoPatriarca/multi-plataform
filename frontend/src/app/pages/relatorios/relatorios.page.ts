import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
  IonRefresher, IonRefresherContent, IonSkeletonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  moonOutline, sunnyOutline, logOutOutline, walletOutline, trendingUpOutline, trendingDownOutline,
  cubeOutline, alertCircleOutline, timeOutline, chevronForwardOutline, pricetagOutline
} from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { RelatorioService } from '../../core/services/relatorio.service';
import { DashboardData } from '../../core/models/relatorio.model';
import { FinanceiroChartComponent } from './components/financeiro-chart/financeiro-chart.component';
import { CategoriaDonutComponent } from './components/categoria-donut/categoria-donut.component';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  templateUrl: './relatorios.page.html',
  styleUrls: ['./relatorios.page.scss'],
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
    IonRefresher, IonRefresherContent, IonSkeletonText,
    FinanceiroChartComponent, CategoriaDonutComponent
  ]
})
export class RelatoriosPage implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private relatorioService = inject(RelatorioService);
  private router = inject(Router);

  dashboard: DashboardData | null = null;
  loading = true;

  constructor() {
    addIcons({
      moonOutline, sunnyOutline, logOutOutline, walletOutline, trendingUpOutline, trendingDownOutline,
      cubeOutline, alertCircleOutline, timeOutline, chevronForwardOutline, pricetagOutline
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.relatorioService.dashboard().subscribe({
      next: (dados) => {
        this.dashboard = dados;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  refresh(event: CustomEvent): void {
    this.relatorioService.dashboard().subscribe({
      next: (dados) => {
        this.dashboard = dados;
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: () => (event.target as HTMLIonRefresherElement).complete()
    });
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  verEstoque(): void {
    this.router.navigate(['/tabs/estoque']);
  }

  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
