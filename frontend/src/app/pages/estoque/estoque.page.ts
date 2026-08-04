import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon,
  IonContent, IonSearchbar, IonBadge, IonFab, IonFabButton, IonSpinner,
  IonRefresher, IonRefresherContent,
  ModalController, AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, createOutline, trashOutline, chevronBackOutline, chevronForwardOutline,
  cubeOutline, pricetagOutline, alertCircleOutline, businessOutline, locationOutline
} from 'ionicons/icons';
import { Produto } from '../../core/models/produto.model';
import { ProdutoService } from '../../core/services/produto.service';
import { ProdutoFormComponent } from './produto-form/produto-form.component';

@Component({
  selector: 'app-estoque',
  standalone: true,
  templateUrl: './estoque.page.html',
  styleUrls: ['./estoque.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonButton, IonIcon,
    IonContent, IonSearchbar, IonBadge, IonFab, IonFabButton, IonSpinner,
    IonRefresher, IonRefresherContent
  ]
})
export class EstoquePage implements OnInit {
  private produtoService = inject(ProdutoService);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  produtos: Produto[] = [];
  loading = false;
  page = 0;
  size = 10;
  totalPages = 0;
  totalElements = 0;

  searchControl = new FormControl('');
  private searchTerms$ = new Subject<string>();

  constructor() {
    addIcons({
      addOutline, createOutline, trashOutline, chevronBackOutline, chevronForwardOutline,
      cubeOutline, pricetagOutline, alertCircleOutline, businessOutline, locationOutline
    });
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
  }

  load(): void {
    this.loading = true;
    const term = this.searchControl.value ?? '';

    this.produtoService.search(term, '', this.page, this.size).subscribe({
      next: (result) => {
        this.produtos = result.content;
        this.totalPages = result.totalPages;
        this.totalElements = result.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  refresh(event: CustomEvent): void {
    this.page = 0;
    this.produtoService.search(this.searchControl.value ?? '', '', this.page, this.size).subscribe({
      next: (result) => {
        this.produtos = result.content;
        this.totalPages = result.totalPages;
        this.totalElements = result.totalElements;
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

  async openForm(produto: Produto | null): Promise<void> {
    const modal = await this.modalController.create({
      component: ProdutoFormComponent,
      componentProps: { produto }
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'saved') {
      this.load();
    }
  }

  async confirmDelete(produto: Produto): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Excluir produto',
      message: `Tem certeza que deseja excluir "${produto.nome}"? Esta acao nao pode ser desfeita.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => this.delete(produto)
        }
      ]
    });

    await alert.present();
  }

  private delete(produto: Produto): void {
    this.produtoService.delete(produto.id).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Produto excluido com sucesso.',
          duration: 2500,
          color: 'success',
          position: 'top'
        });
        toast.present();
        this.load();
      }
    });
  }
}
