import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from '../models/usuario.model';
import { Produto, ProdutoRequest } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {

  private readonly apiUrl = `${environment.apiUrl}/produtos`;

  constructor(private http: HttpClient) {}

  search(termo: string, categoria: string, page: number, size: number): Observable<PageResponse<Produto>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (termo) {
      params = params.set('termo', termo);
    }
    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get<PageResponse<Produto>>(this.apiUrl, { params });
  }

  findById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  create(request: ProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, request);
  }

  update(id: number, request: ProdutoRequest): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
