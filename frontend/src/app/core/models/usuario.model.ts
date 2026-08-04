export interface Usuario {
  id: number;
  nome: string;
  login: string;
  email?: string;
  ativo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface UsuarioRequest {
  nome: string;
  login: string;
  password?: string;
  email?: string;
  ativo?: boolean;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
