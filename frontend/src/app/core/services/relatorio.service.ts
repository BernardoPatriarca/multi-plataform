import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardData } from '../models/relatorio.model';

@Injectable({ providedIn: 'root' })
export class RelatorioService {

  private readonly apiUrl = `${environment.apiUrl}/relatorios`;

  constructor(private http: HttpClient) {}

  dashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }
}
