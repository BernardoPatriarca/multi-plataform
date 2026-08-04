package com.empresa.sistema.dto;

import com.empresa.sistema.entity.Produto;
import com.empresa.sistema.entity.UnidadeMedida;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProdutoResponse {

    private Long id;
    private String nome;
    private String codigo;
    private String codigoBarras;
    private String categoria;
    private String descricao;
    private UnidadeMedida unidadeMedida;
    private BigDecimal precoCusto;
    private BigDecimal precoVenda;
    private BigDecimal quantidadeEstoque;
    private BigDecimal estoqueMinimo;
    private String fornecedor;
    private String localizacao;
    private Boolean ativo;
    private Boolean estoqueBaixo;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;

    public static ProdutoResponse fromEntity(Produto produto) {
        return ProdutoResponse.builder()
                .id(produto.getId())
                .nome(produto.getNome())
                .codigo(produto.getCodigo())
                .codigoBarras(produto.getCodigoBarras())
                .categoria(produto.getCategoria())
                .descricao(produto.getDescricao())
                .unidadeMedida(produto.getUnidadeMedida())
                .precoCusto(produto.getPrecoCusto())
                .precoVenda(produto.getPrecoVenda())
                .quantidadeEstoque(produto.getQuantidadeEstoque())
                .estoqueMinimo(produto.getEstoqueMinimo())
                .fornecedor(produto.getFornecedor())
                .localizacao(produto.getLocalizacao())
                .ativo(produto.getAtivo())
                .estoqueBaixo(produto.getQuantidadeEstoque().compareTo(produto.getEstoqueMinimo()) <= 0)
                .dataCriacao(produto.getDataCriacao())
                .dataAtualizacao(produto.getDataAtualizacao())
                .build();
    }
}
