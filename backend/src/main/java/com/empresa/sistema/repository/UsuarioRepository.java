package com.empresa.sistema.repository;

import com.empresa.sistema.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByLogin(String login);

    boolean existsByLogin(String login);

    @Query("SELECT u FROM Usuario u WHERE " +
            "(:nome = '' AND :login = '') OR " +
            "LOWER(u.nome) LIKE LOWER(CONCAT('%', :nome, '%')) OR " +
            "LOWER(u.login) LIKE LOWER(CONCAT('%', :login, '%'))")
    Page<Usuario> search(@Param("nome") String nome, @Param("login") String login, Pageable pageable);
}
