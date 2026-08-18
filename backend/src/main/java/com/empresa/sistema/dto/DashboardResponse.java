package com.empresa.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private long totalUsuarios;
    private long totalProdutos;
    private long totalProdutosEstoqueBaixo;
    private BigDecimal valorTotalEstoque;

    private BigDecimal totalReceitas;
    private BigDecimal totalDespesas;
    private BigDecimal saldo;

    private long lancamentosPendentes;
    private long lancamentosVencidos;
    private long lancamentosAVencer;

    private List<FinanceiroMensalResponse> financeiroMensal;
    private List<CategoriaValorResponse> despesasPorCategoria;
    private List<CategoriaValorResponse> receitasPorCategoria;
    private List<CategoriaValorResponse> estoquePorCategoria;
    private List<ProdutoEstoqueBaixoResponse> produtosEstoqueBaixo;
}
