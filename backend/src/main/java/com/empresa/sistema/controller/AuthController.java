package com.empresa.sistema.controller;

import com.empresa.sistema.dto.LoginRequest;
import com.empresa.sistema.dto.LoginResponse;
import com.empresa.sistema.dto.RegisterRequest;
import com.empresa.sistema.dto.UsuarioResponse;
import com.empresa.sistema.security.JwtService;
import com.empresa.sistema.security.SecurityConstants;
import com.empresa.sistema.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @Value("${app.security.cookie-secure:false}")
    private boolean cookieSecure;

    @PostMapping("/register")
    public ResponseEntity<UsuarioResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse result = authService.login(request);

        ResponseCookie cookie = ResponseCookie.from(SecurityConstants.ACCESS_TOKEN_COOKIE, result.getToken())
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(jwtService.getExpirationMs() / 1000)
                .build();

        // O token nunca e exposto no corpo da resposta: viaja apenas no cookie HttpOnly.
        LoginResponse body = LoginResponse.builder()
                .usuario(result.getUsuario())
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from(SecurityConstants.ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite("Strict")
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.noContent()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .build();
    }
}
