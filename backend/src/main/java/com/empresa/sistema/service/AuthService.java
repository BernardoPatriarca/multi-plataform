package com.empresa.sistema.service;

import com.empresa.sistema.dto.LoginRequest;
import com.empresa.sistema.dto.LoginResponse;
import com.empresa.sistema.dto.RegisterRequest;
import com.empresa.sistema.dto.UsuarioResponse;
import com.empresa.sistema.entity.Usuario;
import com.empresa.sistema.exception.BusinessException;
import com.empresa.sistema.repository.UsuarioRepository;
import com.empresa.sistema.security.JwtService;
import com.empresa.sistema.security.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final LoginAttemptService loginAttemptService;

    @Transactional
    public UsuarioResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByLogin(request.getLogin())) {
            throw new BusinessException("Ja existe um usuario cadastrado com este login");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .login(request.getLogin())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .ativo(true)
                .build();

        Usuario salvo = usuarioRepository.save(usuario);
        return UsuarioResponse.fromEntity(salvo);
    }

    /**
     * Retorna o LoginResponse com o token preenchido; o controller e responsavel
     * por transportar o token via cookie HttpOnly e nunca no corpo da resposta.
     */
    public LoginResponse login(LoginRequest request) {
        if (loginAttemptService.isBlocked(request.getLogin())) {
            throw new BusinessException("Muitas tentativas de login. Tente novamente em alguns minutos.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getLogin(), request.getPassword())
            );
        } catch (AuthenticationException ex) {
            loginAttemptService.registerFailure(request.getLogin());
            throw ex;
        }

        loginAttemptService.registerSuccess(request.getLogin());

        Usuario usuario = usuarioRepository.findByLogin(request.getLogin())
                .orElseThrow(() -> new BusinessException("Usuario nao encontrado"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(usuario.getLogin())
                .password(usuario.getPassword())
                .authorities(java.util.Collections.emptyList())
                .build();

        String token = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .usuario(UsuarioResponse.fromEntity(usuario))
                .build();
    }
}
