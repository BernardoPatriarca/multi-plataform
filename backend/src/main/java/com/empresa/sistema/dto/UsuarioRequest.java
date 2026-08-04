package com.empresa.sistema.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Usado tanto para criacao quanto edicao. Na edicao, password pode vir vazio
 * (mantem a senha atual) ou preenchido (define uma nova senha).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {

    @NotBlank(message = "Nome e obrigatorio")
    @Size(max = 150)
    private String nome;

    @NotBlank(message = "Login e obrigatorio")
    @Size(max = 50)
    private String login;

    @Size(min = 8, max = 100, message = "Senha deve ter no minimo 8 caracteres")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "Senha deve conter pelo menos uma letra e um numero"
    )
    private String password;

    @Email(message = "Email invalido")
    @Size(max = 150)
    private String email;

    private Boolean ativo;
}
