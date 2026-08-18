package com.empresa.sistema.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinanceiroMensalResponse {

    private String mes;
    private String mesLabel;
    private BigDecimal receitas;
    private BigDecimal despesas;
    private BigDecimal saldo;
}
