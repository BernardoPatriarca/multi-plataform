import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonSearchbar, IonBadge, IonFab, IonFabButton, IonSpinner,
  IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonLabel,
  ModalController, AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, createOutline, trashOutline, chevronBackOutline, chevronForwardOutline,
  trendingUpOutline, trendingDownOutline, walletOutline, calendarOutline, cardOutline,
  moonOutline, sunnyOutline, logOutOutline
} from 'ionicons/icons';
import { Lancamento, ResumoFinanceiro } from '../../core/models/lancamento.model';
import { LancamentoService } from '../../core/services/lancamento.service';
import { LancamentoFormComponent } from './lancamento-form/lancamento-form.component';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  templateUrl: './financeiro.page.html',
  styleUrls: ['./financeiro.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonSearchbar, IonBadge, IonFab, IonFabButton, IonSpinner,
    IonRefresher, IonRefresherContent, IonSegment, IonSegmentButton, IonLabel
  ]
})
export class FinanceiroPage implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private lancamentoService = inject(LancamentoService);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private router = inject(Router);

  lancamentos: Lancamento[] = [];
  resumo: ResumoFinanceiro | null = null;
  loading = false;
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;
  filtroTipo = '';

  searchControl = new FormControl('');
  private searchTerms$ = new Subject<string>();

  constructor() {
    addIcons({
      addOutline, createOutline, trashOutline, chevronBackOutline, chevronForwardOutline,
      trendingUpOutline, trendingDownOutline, walletOutline, calendarOutline, cardOutline,
      moonOutline, sunnyOutline, logOutOutline
    });
  }


  toggleTheme(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.searchTerms$.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(() => {
      this.page = 0;
      this.load();
    });

    this.searchControl.valueChanges.subscribe((value) => {
      this.searchTerms$.next(value ?? '');
    });

    this.load();
    this.loadResumo();
  }

  filtrarTipo(tipo: string | number | null | undefined): void {
    this.filtroTipo = tipo ? String(tipo) : '';
    this.page = 0;
    this.load();
  }

  load(): void {
    this.loading = true;
    const term = this.searchControl.value ?? '';

    this.lancamentoService.search(term, this.filtroTipo, '', this.page, this.size).subscribe({
      next: (result) => {
        this.lancamentos = result.content;
        this.totalPages = result.totalPages;
        this.totalElements = result.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadResumo(): void {
    this.lancamentoService.resumo().subscribe({
      next: (resumo) => (this.resumo = resumo)
    });
  }

  refresh(event: CustomEvent): void {
    this.page = 0;
    this.lancamentoService.search(this.searchControl.value ?? '', this.filtroTipo, '', this.page, this.size).subscribe({
      next: (result) => {
        this.lancamentos = result.content;
        this.totalPages = result.totalPages;
        this.totalElements = result.totalElements;
        this.loadResumo();
        (event.target as HTMLIonRefresherElement).complete();
      },
      error: () => (event.target as HTMLIonRefresherElement).complete()
    });
  }

  nextPage(): void {
    if (this.page + 1 < this.totalPages) {
      this.page++;
      this.load();
    }
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.load();
    }
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  corStatus(status: string): string {
    switch (status) {
      case 'PAGO': return 'success';
      case 'CANCELADO': return 'medium';
      case 'VENCIDO': return 'danger';
      default: return 'warning';
    }
  }

  async openForm(lancamento: Lancamento | null): Promise<void> {
    const modal = await this.modalController.create({
      component: LancamentoFormComponent,
      componentProps: { lancamento }
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'saved') {
      this.load();
      this.loadResumo();
    }
  }

  async confirmDelete(lancamento: Lancamento): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Excluir lancamento',
      message: `Tem certeza que deseja excluir "${lancamento.descricao}"? Esta acao nao pode ser desfeita.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => this.delete(lancamento)
        }
      ]
    });

    await alert.present();
  }

  private delete(lancamento: Lancamento): void {
    this.lancamentoService.delete(lancamento.id).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Lancamento excluido com sucesso.',
          duration: 2500,
          color: 'success',
          position: 'top'
        });
        toast.present();
        this.load();
        this.loadResumo();
      }
    });
  }
}
