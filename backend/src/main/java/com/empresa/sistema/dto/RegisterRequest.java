package com.empresa.sistema.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Nome e obrigatorio")
    @Size(max = 150, message = "Nome deve ter no maximo 150 caracteres")
    private String nome;

    @NotBlank(message = "Login e obrigatorio")
    @Size(max = 50, message = "Login deve ter no maximo 50 caracteres")
    private String login;

    @NotBlank(message = "Senha e obrigatoria")
    @Size(min = 8, max = 100, message = "Senha deve ter no minimo 8 caracteres")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "Senha deve conter pelo menos uma letra e um numero"
    )
    private String password;

    @Email(message = "Email invalido")
    @Size(max = 150)
    private String email;
}
