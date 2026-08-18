import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaValor } from '../../../../core/models/relatorio.model';

interface Segmento {
  categoria: string;
  valor: number;
  percentual: number;
  cor: string;
  dasharray: string;
  dashoffset: number;
}

const PALETA = ['#3b82f6', '#06b6d4', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#14b8a6', '#ec4899'];

@Component({
  selector: 'app-categoria-donut',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria-donut.component.html',
  styleUrls: ['./categoria-donut.component.scss']
})
export class CategoriaDonutComponent implements OnChanges {
  @Input({ required: true }) data: CategoriaValor[] = [];
  @Input() vazio = 'Sem dados no periodo.';

  readonly raio = 60;
  readonly circunferencia = 2 * Math.PI * this.raio;

  segmentos: Segmento[] = [];
  total = 0;

  ngOnChanges(): void {
    this.computar();
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private computar(): void {
    this.total = this.data.reduce((soma, item) => soma + item.valor, 0);
    let acumulado = 0;

    this.segmentos = this.data
      .filter((item) => item.valor > 0)
      .map((item, index) => {
        const percentual = this.total > 0 ? item.valor / this.total : 0;
        const comprimento = percentual * this.circunferencia;
        const segmento: Segmento = {
          categoria: item.categoria,
          valor: item.valor,
          percentual: percentual * 100,
          cor: PALETA[index % PALETA.length],
          dasharray: `${comprimento} ${this.circunferencia - comprimento}`,
          dashoffset: -acumulado
        };
        acumulado += comprimento;
        return segmento;
      });
  }
}
