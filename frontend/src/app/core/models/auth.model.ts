import { Usuario } from './usuario.model';

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  login: string;
  password: string;
  email?: string;
}

export interface LoginResponse {
  // O token nao trafega no corpo da resposta: viaja em cookie HttpOnly definido pelo backend.
  usuario: Usuario;
}
