import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonInput, IonButton,
  IonIcon, IonText, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, logInOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    IonContent, IonCard, IonCardContent, IonItem, IonInput, IonButton,
    IonIcon, IonText, IonSpinner
  ]
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = '';

  form = this.fb.nonNullable.group({
    login: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor() {
    addIcons({ personOutline, lockClosedOutline, logInOutline, shieldCheckmarkOutline });
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
    this.errorMessage = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tabs/home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login ou senha invalidos.';
      }
    });
  }
}
