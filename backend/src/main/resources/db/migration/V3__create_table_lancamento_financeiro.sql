CREATE TABLE lancamento_financeiro (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(200) NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    categoria VARCHAR(100),
    valor NUMERIC(12,2) NOT NULL,
    forma_pagamento VARCHAR(20),
    status VARCHAR(15) NOT NULL DEFAULT 'PENDENTE',
    data_vencimento DATE,
    data_pagamento DATE,
    observacoes TEXT,
    data_criacao TIMESTAMP NOT NULL DEFAULT NOW(),
    data_atualizacao TIMESTAMP,
    CONSTRAINT ck_lancamento_tipo CHECK (tipo IN ('RECEITA','DESPESA')),
    CONSTRAINT ck_lancamento_status CHECK (status IN ('PENDENTE','PAGO','CANCELADO','VENCIDO')),
    CONSTRAINT ck_lancamento_forma_pagamento CHECK (
        forma_pagamento IS NULL OR
        forma_pagamento IN ('DINHEIRO','CARTAO_CREDITO','CARTAO_DEBITO','PIX','BOLETO','TRANSFERENCIA')
    ),
    CONSTRAINT ck_lancamento_valor CHECK (valor >= 0)
);

CREATE INDEX idx_lancamento_tipo ON lancamento_financeiro (tipo);
CREATE INDEX idx_lancamento_status ON lancamento_financeiro (status);
CREATE INDEX idx_lancamento_data_vencimento ON lancamento_financeiro (data_vencimento);
CREATE INDEX idx_lancamento_categoria ON lancamento_financeiro (categoria);
