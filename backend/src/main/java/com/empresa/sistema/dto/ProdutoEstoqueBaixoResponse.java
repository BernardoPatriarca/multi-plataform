package com.empresa.sistema.dto;

import com.empresa.sistema.entity.Produto;
import com.empresa.sistema.entity.UnidadeMedida;
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
public class ProdutoEstoqueBaixoResponse {

    private Long id;
    private String nome;
    private String codigo;
    private String categoria;
    private UnidadeMedida unidadeMedida;
    private BigDecimal quantidadeEstoque;
    private BigDecimal estoqueMinimo;

    public static ProdutoEstoqueBaixoResponse fromEntity(Produto produto) {
        return ProdutoEstoqueBaixoResponse.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .codigo(produto.getCodigo())
                .categoria(produto.getCategoria())
                .unidadeMedida(produto.getUnidadeMedida())
                .quantidadeEstoque(produto.getQuantidadeEstoque())
                .estoqueMinimo(produto.getEstoqueMinimo())
                .build();
    }
}
