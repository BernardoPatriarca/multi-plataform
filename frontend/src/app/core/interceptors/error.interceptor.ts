import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastController = inject(ToastController);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        authService.logout();
        router.navigate(['/login']);
      } else if (error.status !== 0) {
        const message = error.error?.message || 'Ocorreu um erro inesperado. Tente novamente.';
        toastController.create({
          message,
          duration: 3000,
          color: 'danger',
          position: 'top'
        }).then((toast) => toast.present());
      }

      return throwError(() => error);
    })
  );
};
