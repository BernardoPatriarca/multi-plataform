import { HttpInterceptorFn } from '@angular/common/http';

/**
 * O token de autenticacao viaja em um cookie HttpOnly (nunca em memoria/JS),
 * entao o unico trabalho deste interceptor e garantir que o cookie seja
 * enviado em toda chamada a API (necessario porque frontend e backend
 * rodam em origens/portas diferentes).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({ withCredentials: true });
  return next(authReq);
};
