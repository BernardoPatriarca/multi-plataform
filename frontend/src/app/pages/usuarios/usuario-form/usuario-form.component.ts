import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
  IonItem, IonInput, IonToggle, IonLabel, IonSpinner, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  closeOutline, saveOutline, checkmarkCircleOutline,
  idCardOutline, mailOutline, personOutline, lockClosedOutline
} from 'ionicons/icons';
import { Usuario, UsuarioRequest } from '../../../core/models/usuario.model';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent,
    IonItem, IonInput, IonToggle, IonLabel, IonSpinner
  ]
})
export class UsuarioFormComponent implements OnInit {
  @Input() usuario: Usuario | null = null;

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private modalController = inject(ModalController);

  loading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    login: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    password: ['', [
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    ]],
    ativo: [true]
  });

  constructor() {
    addIcons({
      closeOutline, saveOutline, checkmarkCircleOutline,
      idCardOutline, mailOutline, personOutline, lockClosedOutline
    });
  }

  get isEdit(): boolean {
    return !!this.usuario;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    if (this.usuario) {
      this.form.patchValue({
        nome: this.usuario.nome,
        login: this.usuario.login,
        email: this.usuario.email ?? '',
        ativo: this.usuario.ativo
      });
    } else {
      this.form.controls.password.addValidators(Validators.required);
      this.form.controls.password.updateValueAndValidity();
    }
  }

  dismiss(): void {
    this.modalController.dismiss(null, 'cancel');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const raw = this.form.getRawValue();
    const payload: UsuarioRequest = {
      nome: raw.nome,
      login: raw.login,
      email: raw.email || undefined,
      ativo: raw.ativo,
      password: raw.password || undefined
    };

    const request$ = this.isEdit
      ? this.usuarioService.update(this.usuario!.id, payload)
      : this.usuarioService.create(payload);

    request$.subscribe({
      next: (result) => {
        this.loading = false;
        this.modalController.dismiss(result, 'saved');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Nao foi possivel salvar o usuario.';
      }
    });
  }
}
