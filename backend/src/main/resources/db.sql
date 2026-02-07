-- Esquema Oracle para controle de estoque

CREATE TABLE materia_prima (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    quantidade_estoque INTEGER NOT NULL
);

CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    valor NUMERIC(12,2) NOT NULL
);

CREATE TABLE produto_materia_prima (
    produto_id INTEGER,
    materia_prima_id INTEGER,
    quantidade_necessaria INTEGER NOT NULL,
    PRIMARY KEY (produto_id, materia_prima_id),
    FOREIGN KEY (produto_id) REFERENCES produto(id),
    FOREIGN KEY (materia_prima_id) REFERENCES materia_prima(id)
);