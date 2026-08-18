package com.empresa.sistema.repository;

import com.empresa.sistema.entity.LancamentoFinanceiro;
import com.empresa.sistema.entity.StatusLancamento;
import com.empresa.sistema.entity.TipoLancamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface LancamentoFinanceiroRepository extends JpaRepository<LancamentoFinanceiro, Long> {

    @Query("SELECT l FROM LancamentoFinanceiro l WHERE " +
            "(:termo = '' OR LOWER(l.descricao) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(l.categoria) LIKE LOWER(CONCAT('%', :termo, '%'))) AND " +
            "(:tipo = '' OR CAST(l.tipo AS string) = :tipo) AND " +
            "(:status = '' OR CAST(l.status AS string) = :status)")
    Page<LancamentoFinanceiro> search(@Param("termo") String termo,
                                       @Param("tipo") String tipo,
                                       @Param("status") String status,
                                       Pageable pageable);

    @Query("SELECT COALESCE(SUM(l.valor), 0) FROM LancamentoFinanceiro l " +
            "WHERE l.tipo = com.empresa.sistema.entity.TipoLancamento.RECEITA " +
            "AND l.status <> com.empresa.sistema.entity.StatusLancamento.CANCELADO")
    BigDecimal sumReceitas();

    @Query("SELECT COALESCE(SUM(l.valor), 0) FROM LancamentoFinanceiro l " +
            "WHERE l.tipo = com.empresa.sistema.entity.TipoLancamento.DESPESA " +
            "AND l.status <> com.empresa.sistema.entity.StatusLancamento.CANCELADO")
    BigDecimal sumDespesas();

    long countByStatus(StatusLancamento status);

    long countByStatusAndDataVencimentoBetween(StatusLancamento status, LocalDate inicio, LocalDate fim);

    @Query("SELECT l FROM LancamentoFinanceiro l WHERE " +
            "l.status <> com.empresa.sistema.entity.StatusLancamento.CANCELADO AND l.dataVencimento >= :inicio")
    List<LancamentoFinanceiro> findParaRelatorioMensal(@Param("inicio") LocalDate inicio);

    @Query("SELECT COALESCE(l.categoria, 'Sem categoria') as categoria, COALESCE(SUM(l.valor), 0) as total " +
            "FROM LancamentoFinanceiro l WHERE l.tipo = :tipo " +
            "AND l.status <> com.empresa.sistema.entity.StatusLancamento.CANCELADO " +
            "GROUP BY l.categoria ORDER BY SUM(l.valor) DESC")
    List<CategoriaTotalProjection> sumPorCategoria(@Param("tipo") TipoLancamento tipo);
}
