export interface FinanceiroMensal {
  mes: string;
  mesLabel: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export interface CategoriaValor {
  categoria: string;
  valor: number;
  quantidade?: number;
}

export interface ProdutoEstoqueBaixo {
  id: number;
  nome: string;
  codigo: string;
  categoria?: string;
  unidadeMedida: string;
  quantidadeEstoque: number;
  estoqueMinimo: number;
}

export interface DashboardData {
  totalUsuarios: number;
  totalProdutos: number;
  totalProdutosEstoqueBaixo: number;
  valorTotalEstoque: number;

  totalReceitas: number;
  totalDespesas: number;
  saldo: number;

  lancamentosPendentes: number;
  lancamentosVencidos: number;
  lancamentosAVencer: number;

  financeiroMensal: FinanceiroMensal[];
  despesasPorCategoria: CategoriaValor[];
  receitasPorCategoria: CategoriaValor[];
  estoquePorCategoria: CategoriaValor[];
  produtosEstoqueBaixo: ProdutoEstoqueBaixo[];
}
