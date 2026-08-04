import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonInput, IonButton,
  IonIcon, IonSpinner, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, mailOutline, idCardOutline, personAddOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    IonContent, IonCard, IonCardContent, IonItem, IonInput, IonButton,
    IonIcon, IonSpinner
  ]
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);

  loading = false;

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    login: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordsMatchValidator });

  constructor() {
    addIcons({ personOutline, lockClosedOutline, mailOutline, idCardOutline, personAddOutline });
  }

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { confirmPassword, ...payload } = this.form.getRawValue();

    this.authService.register(payload).subscribe({
      next: async () => {
        this.loading = false;
        const toast = await this.toastController.create({
          message: 'Conta criada com sucesso! Faca login para continuar.',
          duration: 3000,
          color: 'success',
          position: 'top'
        });
        toast.present();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
