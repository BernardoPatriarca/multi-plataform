package com.empresa.sistema.repository;

import java.math.BigDecimal;

public interface CategoriaResumoProjection {
    String getCategoria();
    Long getQuantidade();
    BigDecimal getValor();
}
