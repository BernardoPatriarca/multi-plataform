package com.empresa.sistema.dto;

import com.empresa.sistema.entity.FormaPagamento;
import com.empresa.sistema.entity.StatusLancamento;
import com.empresa.sistema.entity.TipoLancamento;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LancamentoRequest {

    @NotBlank(message = "Descricao e obrigatoria")
    @Size(max = 200)
    private String descricao;

    @NotNull(message = "Tipo e obrigatorio")
    private TipoLancamento tipo;

    @Size(max = 100)
    private String categoria;

    @NotNull(message = "Valor e obrigatorio")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;

    private FormaPagamento formaPagamento;

    private StatusLancamento status;

    private LocalDate dataVencimento;

    private LocalDate dataPagamento;

    private String observacoes;
}
