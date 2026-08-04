export type TipoLancamento = 'RECEITA' | 'DESPESA';
export type FormaPagamento = 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'BOLETO' | 'TRANSFERENCIA';
export type StatusLancamento = 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'VENCIDO';

export const FORMAS_PAGAMENTO: { value: FormaPagamento; label: string }[] = [
  { value: 'DINHEIRO', label: 'Dinheiro' },
  { value: 'CARTAO_CREDITO', label: 'Cartao de credito' },
  { value: 'CARTAO_DEBITO', label: 'Cartao de debito' },
  { value: 'PIX', label: 'Pix' },
  { value: 'BOLETO', label: 'Boleto' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' }
];

export const STATUS_LANCAMENTO: { value: StatusLancamento; label: string }[] = [
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'PAGO', label: 'Pago' },
  { value: 'CANCELADO', label: 'Cancelado' },
  { value: 'VENCIDO', label: 'Vencido' }
];

export interface Lancamento {
  id: number;
  descricao: string;
  tipo: TipoLancamento;
  categoria?: string;
  valor: number;
  formaPagamento?: FormaPagamento;
  status: StatusLancamento;
  dataVencimento?: string;
  dataPagamento?: string;
  observacoes?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface LancamentoRequest {
  descricao: string;
  tipo: TipoLancamento;
  categoria?: string;
  valor: number;
  formaPagamento?: FormaPagamento;
  status?: StatusLancamento;
  dataVencimento?: string;
  dataPagamento?: string;
  observacoes?: string;
}

export interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}
