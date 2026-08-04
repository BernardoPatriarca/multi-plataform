import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/usuario.model';
import { Lancamento, LancamentoRequest, ResumoFinanceiro } from '../models/lancamento.model';

@Injectable({ providedIn: 'root' })
export class LancamentoService {

  private readonly apiUrl = `${environment.apiUrl}/financeiro`;

  constructor(private http: HttpClient) {}

  search(termo: string, tipo: string, status: string, page: number, size: number): Observable<PageResponse<Lancamento>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (termo) {
      params = params.set('termo', termo);
    }
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PageResponse<Lancamento>>(`${this.apiUrl}/lancamentos`, { params });
  }

  resumo(): Observable<ResumoFinanceiro> {
    return this.http.get<ResumoFinanceiro>(`${this.apiUrl}/resumo`);
  }

  findById(id: number): Observable<Lancamento> {
    return this.http.get<Lancamento>(`${this.apiUrl}/lancamentos/${id}`);
  }

  create(request: LancamentoRequest): Observable<Lancamento> {
    return this.http.post<Lancamento>(`${this.apiUrl}/lancamentos`, request);
  }

  update(id: number, request: LancamentoRequest): Observable<Lancamento> {
    return this.http.put<Lancamento>(`${this.apiUrl}/lancamentos/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/lancamentos/${id}`);
  }
}
