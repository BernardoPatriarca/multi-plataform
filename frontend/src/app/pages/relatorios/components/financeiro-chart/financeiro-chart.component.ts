import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceiroMensal } from '../../../../core/models/relatorio.model';

interface BarGeometry {
  label: string;
  xReceita: number;
  xDespesa: number;
  yReceita: number;
  yDespesa: number;
  hReceita: number;
  hDespesa: number;
  xLabel: number;
  valorReceita: number;
  valorDespesa: number;
}

@Component({
  selector: 'app-financeiro-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financeiro-chart.component.html',
  styleUrls: ['./financeiro-chart.component.scss']
})
export class FinanceiroChartComponent implements OnChanges {
  @Input({ required: true }) data: FinanceiroMensal[] = [];

  readonly width = 640;
  readonly height = 240;
  private readonly padding = { top: 18, right: 8, bottom: 26, left: 8 };

  barWidth = 0;
  bars: BarGeometry[] = [];
  gridLines: number[] = [];

  ngOnChanges(): void {
    this.computar();
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  private computar(): void {
    const innerWidth = this.width - this.padding.left - this.padding.right;
    const innerHeight = this.height - this.padding.top - this.padding.bottom;
    const n = this.data.length || 1;
    const groupWidth = innerWidth / n;
    this.barWidth = groupWidth * 0.3;

    const max = Math.max(1, ...this.data.flatMap((d) => [d.receitas, d.despesas]));

    this.bars = this.data.map((d, i) => {
      const xStart = this.padding.left + i * groupWidth;
      const xReceita = xStart + groupWidth * 0.14;
      const xDespesa = xReceita + this.barWidth + groupWidth * 0.08;
      const hReceita = (d.receitas / max) * innerHeight;
      const hDespesa = (d.despesas / max) * innerHeight;

      return {
        label: d.mesLabel,
        xReceita,
        xDespesa,
        yReceita: this.padding.top + innerHeight - hReceita,
        yDespesa: this.padding.top + innerHeight - hDespesa,
        hReceita,
        hDespesa,
        xLabel: xStart + groupWidth / 2,
        valorReceita: d.receitas,
        valorDespesa: d.despesas
      };
    });

    const linhas = 4;
    this.gridLines = Array.from({ length: linhas + 1 }, (_, i) =>
      this.padding.top + (innerHeight / linhas) * i
    );
  }
}
