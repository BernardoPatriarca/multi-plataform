import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonBadge, IonFab, IonFabButton,
  IonSpinner, IonRefresher, IonRefresherContent,
  ModalController, AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, createOutline, trashOutline, chevronBackOutline, chevronForwardOutline,
  atOutline, mailOutline, calendarOutline, refreshOutline, peopleOutline,
  moonOutline, sunnyOutline, logOutOutline
} from 'ionicons/icons';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonBadge, IonFab, IonFabButton,
    IonSpinner, IonRefresher, IonRefresherContent
  ]
})
export class UsuariosPage implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  private usuarioService = inject(UsuarioService);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);
  private router = inject(Router);

  usuarios: Usuario[] = [];
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
      atOutline, mailOutline, calendarOutline, refreshOutline, peopleOutline,
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

  iniciais(nome: string): string {
    return nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase())
      .join('');
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

    this.usuarioService.search(term, term, this.page, this.size).subscribe({
      next: (result) => {
        this.usuarios = result.content;
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
    this.usuarioService.search(this.searchControl.value ?? '', this.searchControl.value ?? '', this.page, this.size).subscribe({
      next: (result) => {
        this.usuarios = result.content;
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

  async openForm(usuario: Usuario | null): Promise<void> {
    const modal = await this.modalController.create({
      component: UsuarioFormComponent,
      componentProps: { usuario }
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();
    if (role === 'saved') {
      this.load();
    }
  }

  async confirmDelete(usuario: Usuario): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Excluir usuario',
      message: `Tem certeza que deseja excluir "${usuario.nome}"? Esta acao nao pode ser desfeita.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => this.delete(usuario)
        }
      ]
    });

    await alert.present();
  }

  private delete(usuario: Usuario): void {
    this.usuarioService.delete(usuario.id).subscribe({
      next: async () => {
        const toast = await this.toastController.create({
          message: 'Usuario excluido com sucesso.',
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
