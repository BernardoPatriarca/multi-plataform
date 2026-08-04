package com.empresa.sistema.service;

import com.empresa.sistema.dto.PageResponse;
import com.empresa.sistema.dto.UsuarioRequest;
import com.empresa.sistema.dto.UsuarioResponse;
import com.empresa.sistema.entity.Usuario;
import com.empresa.sistema.exception.BusinessException;
import com.empresa.sistema.exception.ResourceNotFoundException;
import com.empresa.sistema.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public PageResponse<UsuarioResponse> search(String nome, String login, Pageable pageable) {
        String nomeFiltro = (nome == null || nome.isBlank()) ? "" : nome.trim();
        String loginFiltro = (login == null || login.isBlank()) ? "" : login.trim();

        Page<Usuario> page = usuarioRepository.search(nomeFiltro, loginFiltro, pageable);
        Page<UsuarioResponse> responsePage = page.map(UsuarioResponse::fromEntity);
        return PageResponse.fromPage(responsePage);
    }

    public UsuarioResponse findById(Long id) {
        Usuario usuario = getUsuarioOrThrow(id);
        return UsuarioResponse.fromEntity(usuario);
    }

    public UsuarioResponse findByLogin(String login) {
        Usuario usuario = usuarioRepository.findByLogin(login)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));
        return UsuarioResponse.fromEntity(usuario);
    }

    @Transactional
    public UsuarioResponse create(UsuarioRequest request) {
        if (usuarioRepository.existsByLogin(request.getLogin())) {
            throw new BusinessException("Ja existe um usuario cadastrado com este login");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new BusinessException("Senha e obrigatoria para novo usuario");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .login(request.getLogin())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .ativo(request.getAtivo() == null ? true : request.getAtivo())
                .build();

        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse update(Long id, UsuarioRequest request) {
        Usuario usuario = getUsuarioOrThrow(id);

        if (!usuario.getLogin().equalsIgnoreCase(request.getLogin())
                && usuarioRepository.existsByLogin(request.getLogin())) {
            throw new BusinessException("Ja existe um usuario cadastrado com este login");
        }

        usuario.setNome(request.getNome());
        usuario.setLogin(request.getLogin());
        usuario.setEmail(request.getEmail());
        if (request.getAtivo() != null) {
            usuario.setAtivo(request.getAtivo());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return UsuarioResponse.fromEntity(usuarioRepository.save(usuario));
    }

    @Transactional
    public void delete(Long id) {
        Usuario usuario = getUsuarioOrThrow(id);
        usuarioRepository.delete(usuario);
    }

    private Usuario getUsuarioOrThrow(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado com id " + id));
    }
}
