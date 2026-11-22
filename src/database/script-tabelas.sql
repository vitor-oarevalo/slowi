CREATE DATABASE IF NOT EXISTS slowi;
USE slowi;

CREATE TABLE cadastro (
    idCadastro INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    dtCadastro DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chkEmail
        CHECK (email LIKE '%@%')
);


CREATE TABLE emocao (
    idEmocao INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL UNIQUE,
    cor CHAR(6) NOT NULL
);

INSERT INTO emocao (nome, cor) VALUES
    ('Calma', '7a66c9'),
    ('Alegria', 'e9b44c'),
    ('Cansaço', 'a99bdc'),
    ('Ansiedade', 'e07a5f'),
    ('Tristeza', '5b8def'),
    ('Raiva', 'd1495b'),
    ('Sobrecarga', '43358a');


CREATE TABLE etiqueta (
    idEtiqueta INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(60) NOT NULL UNIQUE
);

INSERT INTO etiqueta (nome) VALUES
    ('Estudo'),
    ('Trabalho'),
    ('Família'),
    ('Sono'),
    ('Saúde'),
    ('Relacionamentos');


CREATE TABLE diarioEmocional (
    idDiarioEmocional INT PRIMARY KEY AUTO_INCREMENT,
    dataRegistro DATETIME NOT NULL,
    intensidade INT NOT NULL,
    registro TEXT,

    emocao_idEmocao INT NOT NULL,
    Cadastro_idCadastro INT NOT NULL,

    CONSTRAINT chkIntensidade
        CHECK (intensidade BETWEEN 1 AND 5),

    CONSTRAINT fkDiarioEmocao
        FOREIGN KEY (emocao_idEmocao)
        REFERENCES emocao(idEmocao),

    CONSTRAINT fkDiarioCadastro
        FOREIGN KEY (Cadastro_idCadastro)
        REFERENCES cadastro(idCadastro)
        ON DELETE CASCADE
);

CREATE TABLE registroEtiqueta (
    fkDiarioEmocional INT NOT NULL,
    fkEtiqueta INT NOT NULL,

    PRIMARY KEY (fkDiarioEmocional, fkEtiqueta),

    CONSTRAINT fkRegistroEtiquetaRegistro
        FOREIGN KEY (fkDiarioEmocional)
        REFERENCES diarioEmocional(idDiarioEmocional)
        ON DELETE CASCADE,

    CONSTRAINT fkRegistroEtiquetaEtiqueta
        FOREIGN KEY (fkEtiqueta)
        REFERENCES etiqueta(idEtiqueta)
);


SELECT * FROM diarioEmocional;
SELECT idDiarioEmocional, Cadastro_idCadastro FROM diarioEmocional;
SELECT * FROM cadastro;
SELECT * FROM emocao;
SELECT * FROM etiqueta;

SELECT * FROM registroEtiqueta;