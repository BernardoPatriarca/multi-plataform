package com.empresa.sistema.service;

import com.empresa.sistema.dto.CategoriaValorResponse;
import com.empresa.sistema.dto.DashboardResponse;
import com.empresa.sistema.dto.FinanceiroMensalResponse;
import com.empresa.sistema.dto.ProdutoEstoqueBaixoResponse;
import com.empresa.sistema.entity.LancamentoFinanceiro;
import com.empresa.sistema.entity.StatusLancamento;
import com.empresa.sistema.entity.TipoLancamento;
import com.empresa.sistema.repository.LancamentoFinanceiroRepository;
import com.empresa.sistema.repository.ProdutoRepository;
import com.empresa.sistema.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RelatorioService {

    private static final int MESES_HISTORICO = 6;
    private static final int LIMITE_ESTOQUE_BAIXO = 8;
    private static final int DIAS_A_VENCER = 7;
    private static final DateTimeFormatter MES_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final String[] MESES_LABEL = {
            "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    };

    private final LancamentoFinanceiroRepository lancamentoRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;

    public DashboardResponse dashboard() {
        BigDecimal totalReceitas = lancamentoRepository.sumReceitas();
        BigDecimal totalDespesas = lancamentoRepository.sumDespesas();
        LocalDate hoje = LocalDate.now();

        return DashboardResponse.builder()
                .totalUsuarios(usuarioRepository.count())
                .totalProdutos(produtoRepository.countByAtivoTrue())
                .totalProdutosEstoqueBaixo(produtoRepository.countEstoqueBaixo())
                .valorTotalEstoque(produtoRepository.sumValorEstoque())
                .totalReceitas(totalReceitas)
                .totalDespesas(totalDespesas)
                .saldo(totalReceitas.subtract(totalDespesas))
                .lancamentosPendentes(lancamentoRepository.countByStatus(StatusLancamento.PENDENTE))
                .lancamentosVencidos(lancamentoRepository.countByStatus(StatusLancamento.VENCIDO))
                .lancamentosAVencer(lancamentoRepository.countByStatusAndDataVencimentoBetween(
                        StatusLancamento.PENDENTE, hoje, hoje.plusDays(DIAS_A_VENCER)))
                .financeiroMensal(financeiroMensal())
                .despesasPorCategoria(categoriaFinanceiro(TipoLancamento.DESPESA))
                .receitasPorCategoria(categoriaFinanceiro(TipoLancamento.RECEITA))
                .estoquePorCategoria(estoquePorCategoria())
                .produtosEstoqueBaixo(produtosEstoqueBaixo())
                .build();
    }

    private List<FinanceiroMensalResponse> financeiroMensal() {
        YearMonth mesAtual = YearMonth.now();
        LocalDate inicio = mesAtual.minusMonths(MESES_HISTORICO - 1L).atDay(1);
        List<LancamentoFinanceiro> lancamentos = lancamentoRepository.findParaRelatorioMensal(inicio);

        Map<YearMonth, BigDecimal[]> agrupado = new LinkedHashMap<>();
        for (int i = MESES_HISTORICO - 1; i >= 0; i--) {
            agrupado.put(mesAtual.minusMonths(i), new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
        }

        for (LancamentoFinanceiro lancamento : lancamentos) {
            YearMonth referencia = YearMonth.from(lancamento.getDataVencimento());
            BigDecimal[] valores = agrupado.get(referencia);
            if (valores == null) {
                continue;
            }
            if (lancamento.getTipo() == TipoLancamento.RECEITA) {
                valores[0] = valores[0].add(lancamento.getValor());
            } else {
                valores[1] = valores[1].add(lancamento.getValor());
            }
        }

        List<FinanceiroMensalResponse> resultado = new ArrayList<>();
        for (Map.Entry<YearMonth, BigDecimal[]> entry : agrupado.entrySet()) {
            YearMonth mes = entry.getKey();
            BigDecimal receitas = entry.getValue()[0];
            BigDecimal despesas = entry.getValue()[1];
            resultado.add(FinanceiroMensalResponse.builder()
                    .mes(mes.format(MES_FORMATTER))
                    .mesLabel(MESES_LABEL[mes.getMonthValue() - 1] + "/" + String.valueOf(mes.getYear()).substring(2))
                    .receitas(receitas)
                    .despesas(despesas)
                    .saldo(receitas.subtract(despesas))
                    .build());
        }
        return resultado;
    }

    private List<CategoriaValorResponse> categoriaFinanceiro(TipoLancamento tipo) {
        return lancamentoRepository.sumPorCategoria(tipo).stream()
                .map(projecao -> CategoriaValorResponse.builder()
                        .categoria(projecao.getCategoria())
                        .valor(projecao.getTotal())
                        .build())
                .toList();
    }

    private List<CategoriaValorResponse> estoquePorCategoria() {
        return produtoRepository.resumoPorCategoria().stream()
                .map(projecao -> CategoriaValorResponse.builder()
                        .categoria(projecao.getCategoria())
                        .valor(projecao.getValor())
                        .quantidade(projecao.getQuantidade())
                        .build())
                .toList();
    }

    private List<ProdutoEstoqueBaixoResponse> produtosEstoqueBaixo() {
        return produtoRepository.findEstoqueBaixo(PageRequest.of(0, LIMITE_ESTOQUE_BAIXO)).stream()
                .map(ProdutoEstoqueBaixoResponse::fromEntity)
                .toList();
    }
}
