package com.empresa.sistema.repository;

import com.empresa.sistema.entity.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    boolean existsByCodigo(String codigo);

    @Query("SELECT p FROM Produto p WHERE " +
            "(:termo = '' OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(p.codigo) LIKE LOWER(CONCAT('%', :termo, '%'))) AND " +
            "(:categoria = '' OR LOWER(p.categoria) LIKE LOWER(CONCAT('%', :categoria, '%')))")
    Page<Produto> search(@Param("termo") String termo, @Param("categoria") String categoria, Pageable pageable);
}
