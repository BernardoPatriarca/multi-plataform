package com.empresa.sistema.dto;

import com.empresa.sistema.entity.UnidadeMedida;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoRequest {

    @NotBlank(message = "Nome e obrigatorio")
    @Size(max = 150)
    private String nome;

    @NotBlank(message = "Codigo e obrigatorio")
    @Size(max = 50)
    private String codigo;

    @Size(max = 50)
    private String codigoBarras;

    @Size(max = 100)
    private String categoria;

    private String descricao;

    @NotNull(message = "Unidade de medida e obrigatoria")
    private UnidadeMedida unidadeMedida;

    @NotNull(message = "Preco de custo e obrigatorio")
    @DecimalMin(value = "0.0", message = "Preco de custo nao pode ser negativo")
    private BigDecimal precoCusto;

    @NotNull(message = "Preco de venda e obrigatorio")
    @DecimalMin(value = "0.0", message = "Preco de venda nao pode ser negativo")
    private BigDecimal precoVenda;

    @NotNull(message = "Quantidade em estoque e obrigatoria")
    @DecimalMin(value = "0.0", message = "Quantidade em estoque nao pode ser negativa")
    private BigDecimal quantidadeEstoque;

    @NotNull(message = "Estoque minimo e obrigatorio")
    @DecimalMin(value = "0.0", message = "Estoque minimo nao pode ser negativo")
    private BigDecimal estoqueMinimo;

    @Size(max = 150)
    private String fornecedor;

    @Size(max = 100)
    private String localizacao;

    private Boolean ativo;
}
