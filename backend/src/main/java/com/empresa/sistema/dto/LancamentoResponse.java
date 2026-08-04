package com.empresa.sistema.dto;

import com.empresa.sistema.entity.FormaPagamento;
import com.empresa.sistema.entity.LancamentoFinanceiro;
import com.empresa.sistema.entity.StatusLancamento;
import com.empresa.sistema.entity.TipoLancamento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LancamentoResponse {

    private Long id;
    private String descricao;
    private TipoLancamento tipo;
    private String categoria;
    private BigDecimal valor;
    private FormaPagamento formaPagamento;
    private StatusLancamento status;
    private LocalDate dataVencimento;
    private LocalDate dataPagamento;
    private String observacoes;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    public static LancamentoResponse fromEntity(LancamentoFinanceiro lancamento) {
        return LancamentoResponse.builder()
                .id(lancamento.getId())
                .descricao(lancamento.getDescricao())
                .tipo(lancamento.getTipo())
                .categoria(lancamento.getCategoria())
                .valor(lancamento.getValor())
                .formaPagamento(lancamento.getFormaPagamento())
                .status(lancamento.getStatus())
                .dataVencimento(lancamento.getDataVencimento())
                .dataPagamento(lancamento.getDataPagamento())
                .observacoes(lancamento.getObservacoes())
                .dataCriacao(lancamento.getDataCriacao())
                .dataAtualizacao(lancamento.getDataAtualizacao())
                .build();
    }
}
