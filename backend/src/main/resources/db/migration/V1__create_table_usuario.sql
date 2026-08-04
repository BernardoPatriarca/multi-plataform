CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    login VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP,
    CONSTRAINT uk_usuario_login UNIQUE (login)
);

CREATE INDEX idx_usuario_nome ON usuario (nome);
CREATE INDEX idx_usuario_login ON usuario (login);
