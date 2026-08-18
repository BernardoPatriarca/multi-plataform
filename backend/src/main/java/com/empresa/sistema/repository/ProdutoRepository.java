package com.empresa.sistema.repository;

import com.empresa.sistema.entity.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    boolean existsByCodigo(String codigo);

    @Query("SELECT p FROM Produto p WHERE " +
            "(:termo = '' OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(p.codigo) LIKE LOWER(CONCAT('%', :termo, '%'))) AND " +
            "(:categoria = '' OR LOWER(p.categoria) LIKE LOWER(CONCAT('%', :categoria, '%')))")
    Page<Produto> search(@Param("termo") String termo, @Param("categoria") String categoria, Pageable pageable);

    long countByAtivoTrue();

    @Query("SELECT COUNT(p) FROM Produto p WHERE p.ativo = true AND p.quantidadeEstoque <= p.estoqueMinimo")
    long countEstoqueBaixo();

    @Query("SELECT p FROM Produto p WHERE p.ativo = true AND p.quantidadeEstoque <= p.estoqueMinimo " +
            "ORDER BY (p.quantidadeEstoque - p.estoqueMinimo) ASC")
    List<Produto> findEstoqueBaixo(Pageable pageable);

    @Query("SELECT COALESCE(SUM(p.quantidadeEstoque * p.precoVenda), 0) FROM Produto p WHERE p.ativo = true")
    BigDecimal sumValorEstoque();

    @Query("SELECT COALESCE(p.categoria, 'Sem categoria') as categoria, COUNT(p) as quantidade, " +
            "COALESCE(SUM(p.quantidadeEstoque * p.precoVenda), 0) as valor " +
            "FROM Produto p WHERE p.ativo = true GROUP BY p.categoria ORDER BY valor DESC")
    List<CategoriaResumoProjection> resumoPorCategoria();
}
