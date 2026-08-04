CREATE TABLE produto (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    codigo_barras VARCHAR(50),
    categoria VARCHAR(100),
    descricao TEXT,
    unidade_medida VARCHAR(10) NOT NULL DEFAULT 'UN',
    preco_custo NUMERIC(12,2) NOT NULL DEFAULT 0,
    preco_venda NUMERIC(12,2) NOT NULL DEFAULT 0,
    quantidade_estoque NUMERIC(12,3) NOT NULL DEFAULT 0,
    estoque_minimo NUMERIC(12,3) NOT NULL DEFAULT 0,
    fornecedor VARCHAR(150),
    localizacao VARCHAR(100),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP,
    CONSTRAINT uk_produto_codigo UNIQUE (codigo),
    CONSTRAINT ck_produto_unidade_medida CHECK (unidade_medida IN ('UN','KG','G','L','ML','CX','PCT','DZ')),
    CONSTRAINT ck_produto_preco_custo CHECK (preco_custo >= 0),
    CONSTRAINT ck_produto_preco_venda CHECK (preco_venda >= 0),
    CONSTRAINT ck_produto_quantidade_estoque CHECK (quantidade_estoque >= 0),
    CONSTRAINT ck_produto_estoque_minimo CHECK (estoque_minimo >= 0)
);

CREATE INDEX idx_produto_nome ON produto (nome);
CREATE INDEX idx_produto_codigo ON produto (codigo);
CREATE INDEX idx_produto_categoria ON produto (categoria);
