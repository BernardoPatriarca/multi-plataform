export type UnidadeMedida = 'UN' | 'KG' | 'G' | 'L' | 'ML' | 'CX' | 'PCT' | 'DZ';

export const UNIDADES_MEDIDA: { value: UnidadeMedida; label: string }[] = [
  { value: 'UN', label: 'Unidade' },
  { value: 'KG', label: 'Quilograma (kg)' },
  { value: 'G', label: 'Grama (g)' },
  { value: 'L', label: 'Litro (L)' },
  { value: 'ML', label: 'Mililitro (mL)' },
  { value: 'CX', label: 'Caixa' },
  { value: 'PCT', label: 'Pacote' },
  { value: 'DZ', label: 'Duzia' }
];

export interface Produto {
  id: number;
  nome: string;
  codigo: string;
  codigoBarras?: string;
  categoria?: string;
  descricao?: string;
  unidadeMedida: UnidadeMedida;
  precoCusto: number;
  precoVenda: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  fornecedor?: string;
  localizacao?: string;
  ativo: boolean;
  estoqueBaixo: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface ProdutoRequest {
  nome: string;
  codigo: string;
  codigoBarras?: string;
  categoria?: string;
  descricao?: string;
  unidadeMedida: UnidadeMedida;
  precoCusto: number;
  precoVenda: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  fornecedor?: string;
  localizacao?: string;
  ativo?: boolean;
}
