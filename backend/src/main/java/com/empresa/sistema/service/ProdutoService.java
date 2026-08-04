package com.empresa.sistema.service;

import com.empresa.sistema.dto.PageResponse;
import com.empresa.sistema.dto.ProdutoRequest;
import com.empresa.sistema.dto.ProdutoResponse;
import com.empresa.sistema.entity.Produto;
import com.empresa.sistema.exception.BusinessException;
import com.empresa.sistema.exception.ResourceNotFoundException;
import com.empresa.sistema.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public PageResponse<ProdutoResponse> search(String termo, String categoria, Pageable pageable) {
        String termoFiltro = (termo == null || termo.isBlank()) ? "" : termo.trim();
        String categoriaFiltro = (categoria == null || categoria.isBlank()) ? "" : categoria.trim();

        Page<Produto> page = produtoRepository.search(termoFiltro, categoriaFiltro, pageable);
        Page<ProdutoResponse> responsePage = page.map(ProdutoResponse::fromEntity);
        return PageResponse.fromPage(responsePage);
    }

    public ProdutoResponse findById(Long id) {
        return ProdutoResponse.fromEntity(getProdutoOrThrow(id));
    }

    @Transactional
    public ProdutoResponse create(ProdutoRequest request) {
        if (produtoRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ja existe um produto cadastrado com este codigo");
        }

        Produto produto = Produto.builder()
                .nome(request.getNome())
                .codigo(request.getCodigo())
                .codigoBarras(request.getCodigoBarras())
                .categoria(request.getCategoria())
                .descricao(request.getDescricao())
                .unidadeMedida(request.getUnidadeMedida())
                .precoCusto(request.getPrecoCusto())
                .precoVenda(request.getPrecoVenda())
                .quantidadeEstoque(request.getQuantidadeEstoque())
                .estoqueMinimo(request.getEstoqueMinimo())
                .fornecedor(request.getFornecedor())
                .localizacao(request.getLocalizacao())
                .ativo(request.getAtivo() == null ? true : request.getAtivo())
                .build();

        return ProdutoResponse.fromEntity(produtoRepository.save(produto));
    }

    @Transactional
    public ProdutoResponse update(Long id, ProdutoRequest request) {
        Produto produto = getProdutoOrThrow(id);

        if (!produto.getCodigo().equalsIgnoreCase(request.getCodigo())
                && produtoRepository.existsByCodigo(request.getCodigo())) {
            throw new BusinessException("Ja existe um produto cadastrado com este codigo");
        }

        produto.setNome(request.getNome());
        produto.setCodigo(request.getCodigo());
        produto.setCodigoBarras(request.getCodigoBarras());
        produto.setCategoria(request.getCategoria());
        produto.setDescricao(request.getDescricao());
        produto.setUnidadeMedida(request.getUnidadeMedida());
        produto.setPrecoCusto(request.getPrecoCusto());
        produto.setPrecoVenda(request.getPrecoVenda());
        produto.setQuantidadeEstoque(request.getQuantidadeEstoque());
        produto.setEstoqueMinimo(request.getEstoqueMinimo());
        produto.setFornecedor(request.getFornecedor());
        produto.setLocalizacao(request.getLocalizacao());
        if (request.getAtivo() != null) {
            produto.setAtivo(request.getAtivo());
        }

        return ProdutoResponse.fromEntity(produtoRepository.save(produto));
    }

    @Transactional
    public void delete(Long id) {
        produtoRepository.delete(getProdutoOrThrow(id));
    }

    private Produto getProdutoOrThrow(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto nao encontrado com id " + id));
    }
}
