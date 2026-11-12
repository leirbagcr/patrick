const db = require("./db")

// As tabelas filhas precisam ser removidas antes das tabelas pai
const DROP_TABELAS = `
    DROP TABLE IF EXISTS compra_produto;
    DROP TABLE IF EXISTS compra;
    DROP TABLE IF EXISTS produto;
    DROP TABLE IF EXISTS cliente;
`

const ESTRUTURA_CLIENTE = `
    CREATE TABLE cliente (
        id int(11) NOT NULL AUTO_INCREMENT,
        nome varchar(100) NOT NULL,
        cpf char(14) NOT NULL,
        celular char(14) NOT NULL,
        email varchar(100) NOT NULL,
        senha varchar(512) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY cpf (cpf),
        UNIQUE KEY email (email)
    ) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`

const DADOS_CLIENTE = `
    INSERT INTO cliente VALUES 
        (12,'Nicolas Galvão','123.456.789-00','(42)99966-4444','galvao@gmail.com','$2b$10$N8b2YuzXWdMJVAAd670qG.ScLlmdFsuTJ7C6/GWtMKWhj8O0pU6Pu'),(13,'Nicolas Galvão','123.456.789-02','(42)99966-4444','galvao2@gmail.com','$2b$10$rNwWgUx8kezhoZXXuVG7NeBXqPFAzpkc37Sg4P.ETVtiSaWWqBHxy'),
        (14,'Patrick','123.123.123-12','(42)999669966','patrick123@gmail.com','$2b$10$MZMnDj10f7JnV6ArP.5hm.TAHDZ5NwECYSw6i5kbNowwhPuqbC/W.'),(19,'Richard','148.211.069-57','(42) 99931-865','bellusci.richard@escola.pr.gov.br','$2b$10$v3aTKV7iVqrcBJozlOZwie8I7yO2CyQIfuVk4uxR2RSDPELZSeyxS'),
        (28,'Patrick','111.222.333-49','(42)99999-4444','patrick67@gmail.com','$2b$10$QRU70xwZs0JYccsQcf/BFe7IIGYaqlS0xb.TIkGsv7UKviM2A26pq'),(29,'Kauã silva de lima','152.915.999-79','(42)99999-4444','kaua.lima11@escola.pr.gov.br','$2b$10$Ax80a.N/1RUsBU48IO1hX.d4hyiNt/15aV8.8VJuPziVuzTwGe8ly'),
        (30,'Bruno','120.897.429-76','(42)99830-3607','derbli@gmail.com','$2b$10$t8fYQCnQRXxvbLczF6YJNu31UvNT1qWhZ1r9GiftnFLy1rABdFKfG'),(31,'Guilherme','111.333.444-78','(42)55555-9999','poisler456@gmail.com','$2b$10$r9QmvPFklIeeoCoHfISzGeJNnjScdYm4JZiNBmffsblVzk48uyHXa'),
        (32,'Rhuan','137.604.709-80','(42)99999-4444','rhuan@gmail.com','$2b$10$QA3mNPH90POZijUIri.hKO5pQQH223KGKyYOYycQA0GtPuKGhPrkS');
`

const ESTRUTURA_PRODUTO = `
    CREATE TABLE produto (
        id int(11) NOT NULL AUTO_INCREMENT,
        nome varchar(200) NOT NULL,
        descricao text NOT NULL,
        categoria varchar(50) NOT NULL,
        preco decimal(10,2) NOT NULL,
        caminho_img varchar(255) NOT NULL,
        quantidade_img int(11) NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`

const DADOS_PRODUTO = `
    INSERT INTO produto VALUES 
        (1,'Filtro de Ar Esportivo Inbox K&N Style','Filtro de ar de alto fluxo lavável, projetado para aumentar a captação de ar e o ganho de potência sutil.','Performance',349.90,'assets/img/filtro-inbox.jpg',3),(2,'Kit Filtro Cônico Duplo Fluxo 100mm','Filtro de ar esportivo cônico com elemento filtrante de algodão cirúrgico para máximo fluxo de ar.','Performance',189.00,'assets/img/filtro-conico.jpg',2),(3,'Turbocompressor Roletado T25 Billet','Turbina roletada com caixa fria em alumínio billet, ideal para projetos de até 350 cavalos.','Performance',2850.00,'assets/img/turbo-t25.jpg',4),(4,'Kit Intercooler Frontal Em Alumínio Universal','Intercooler de alta eficiência com colmeia tipo Bar & Plate, reduz a temperatura do ar de admissão.','Performance',1450.00,'assets/img/intercooler-universal.jpg',3),(5,'Válvula de Alívio Blow-Off RFL Style','Válvula de espirro mecânica com som estridente característico para motores turbo comprimidos.','Performance',299.00,'assets/img/valvula-blowoff.jpg',2),(6,'Pressostato de Combustível Regulável Dosador','Dosador de combustível de alta performance modelo Large, compatível com álcool e gasolina.','Performance',420.00,'assets/img/dosador-combustivel.jpg',3),(7,'Bicos Injetores Bosch 65lbs/h High Impedance','Jogo com 4 bicos injetores calibrados de alta impedância, ideal para calibrações de performance.','Performance',1100.00,'assets/img/bicos-bosch.jpg',2),(8,'Bomba de Combustível Dinâmica 450 LPH','Bomba interna de alto fluxo compatível com E85/Etanol, essencial para linhas de alta pressão.','Performance',890.00,'assets/img/bomba-450lph.jpg',1),(9,'Radiador de Alumínio Brasado Alta Performance','Radiador com colmeia tripla de alumínio, maior capacidade de refrigeração para track days.','Performance',1250.00,'assets/img/radiador-aluminio.jpg',4),
        (10,'Módulo de Injeção Programável FT450','Injeção eletrônica programável com painel touchscreen e controle de tração integrado.','Performance',4800.00,'assets/img/injecao-ft450.jpg',5),(11,'Comando de Válvulas Esportivo 276 Graus','Comando de válvulas com maior graduação para ganho de potência em médias e altas rotações.','Performance',950.00,'assets/img/comando-276.jpg',2),(12,'Coletor de Admissão Plenum em Alumínio','Coletor Plenum roletado para melhor distribuição de ar nos cilindros e ganho de torque.','Performance',1650.00,'assets/img/coletor-plenum.jpg',3),(13,'Abafador Esportivo Inox 4 Polegadas Premium','Abafador traseiro em aço inox 304 com manta acústica de cerâmica para ronco encorpado e grave.','Exaustão',580.00,'assets/img/abafador-4pol.jpg',3),(14,'Ponteira de Escapamento Fibra de Carbono 3.5\"','Ponteira estética com acabamento em fibra de carbono real e miolo em aço inoxidável.','Exaustão',249.90,'assets/img/ponteira-carbono.jpg',2),(15,'Coletor de Escapamento Tubular 4x1 Inox','Coletor dimensionado em aço inox para otimização do fluxo de gases e aumento de potência.','Exaustão',1890.00,'assets/img/coletor-4x1.jpg',4),(16,'Downpipe em Aço Inox 304 Plug & Play','Tubo de saída de turbina redimensionado para eliminação de restrição do catalisador original.','Exaustão',1200.00,'assets/img/downpipe-inox.jpg',3),(17,'Catback System Completo 2.5 Polegadas','Sistema de escapamento intermediário e traseiro sob medida para ganho de fluxo e ronco esportivo.','Exaustão',3200.00,'assets/img/catback-completo.jpg',5),(18,'Válvula Difusor de Escapamento Elétrico 2.5\"','Difusor de escape com controle remoto para alternar instantaneamente entre ronco original e esportivo.','Exaustão',450.00,'assets/img/difusor-eletrico.jpg',3),(19,'Abafador Intermediário Turbinho Aço Galvanizado','Abafador compacto de fluxo direto, ideal para reduzir frequências agudas sem restringir fluxo.','Exaustão',180.00,'assets/img/abafador-turbinho.jpg',1),
        (20,'Volante Esportivo Shutt Camurça Tarja Vermelha','Volante de competição com acabamento em camurça de alta aderência e diâmetro reduzido.','Estética',450.00,'assets/img/volante-shutt.jpg',3),(21,'Banco Concha Reclinável Sparco Style','Banco esportivo com excelente apoio lateral, revestido em tecido suede respirável.','Estética',1950.00,'assets/img/banco-concha.jpg',4),(22,'Manopla de Câmbio de Alumínio Recartilhado','Manopla estilo poke em alumínio usinado em CNC para engates mais precisos.','Estética',120.00,'assets/img/manopla-aluminio.jpg',2),(23,'Cinto de Segurança 4 Pontos Competição','Cinto de fixação rápida tipo aeronáutico para máxima segurança em curvas de alta velocidade.','Estética',380.00,'assets/img/cinto-4pontos.jpg',3),(24,'Kit Pedaleiras Esportivas Alumínio Escovado','Pedaleiras anti-derrapantes com furação para melhor aderência das solas dos calçados.','Estética',89.90,'assets/img/pedaleiras-esportivas.jpg',2),(25,'Painel de Instrumentos Monstro Conta-Giros 5\"','Tacômetro automotivo com shift light externo ajustável e iluminação em LED configurável.','Estética',340.00,'assets/img/painel-monstro.jpg',3),(26,'Manômetro de Pressão de Turbo Digital Carbon','Manômetro de 52mm com leitura digital e fundo simulando fibra de carbono.','Estética',199.00,'assets/img/manometro-turbo.jpg',2),(27,'Cubo Rápido Snap Off para Volante Esportivo','Sistema de saque rápido que permite remover o volante do veículo com apenas um clique.','Estética',280.00,'assets/img/snap-off.jpg',3),(28,'Roda Esportiva Aro 17 Tala 8.5 JDM Style','Roda de liga leve super leve com furação multifuros, acabamento bronze fosco.','Rodas',950.00,'assets/img/roda-aro17-bronze.jpg',4),(29,'Pneu Semi-Slick 225/45 R17 Performance','Pneu homologado para rua com composto macio focado em máxima aderência para pistas.','Rodas',850.00,'assets/img/pneu-semislick.jpg',2),
        (30,'Espaçador de Roda Alumínio Billet 20mm (Par)','Par de espaçadores com prisioneiros inclusos para aumentar a bitola do veículo.','Rodas',320.00,'assets/img/espacador-20mm.jpg',2),(31,'Jogo de Porcas de Roda em Titânio Forjado','Porcas de roda ultra resistentes e leves com acabamento neo-chrome queimado.','Rodas',249.00,'assets/img/porcas-titanio.jpg',3),(32,'Barra Anti-Torção Dianteira Superior','Barra estrutural para amarração das torres de suspensão, melhorando a estabilidade.','Rodas',290.00,'assets/img/barra-antitorcao.jpg',2),(33,'Kit Suspensão de Rosca Regulável Slim','Amortecedores e molas preparadas que permitem o ajuste manual da altura do veículo.','Suspensão',1680.00,'assets/img/suspensao-rosca.jpg',4),(34,'Coilovers Performance Regulagem de Altura e Rebound','Conjunto premium de suspensão com regulagem de altura e 32 níveis de rigidez.','Suspensão',4600.00,'assets/img/coilovers-rebound.jpg',5),(35,'Kit Freio a Disco Slotado 330mm Brembo Style','Discos de freio ranhurados e ventilados com pinças de 4 pistões para alto poder de frenagem.','Suspensão',3890.00,'assets/img/kit-freio-330mm.jpg',4),(36,'Pastilha de Freio Cerâmica de Cerâmica High-Grip','Pastilhas de composto cerâmico para aguentar altas temperaturas sem sofrer fadiga (fade).','Suspensão',420.00,'assets/img/pastilha-ceramica.jpg',2),(37,'Molas Esportivas Progressivas Eibach Style','Molas que reduzem a altura do carro mantendo o conforto original em vias urbanas.','Suspensão',980.00,'assets/img/molas-esportivas.jpg',3),(38,'Bucha de Poliuretano PU Kit Completo Suspensão','Substitutos das buchas de borracha originais por PU, eliminando folgas na suspensão.','Suspensão',550.00,'assets/img/buchas-pu.jpg',3),(39,'Embreagem de Cerâmica 6 Pastilhas com Platô 1200lbs','Kit de embreagem de alta fricção ideal para carros turbinados com torque elevado.','Transmissão',1150.00,'assets/img/embreagem-ceramica.jpg',3),
        (40,'Blocante de Diferencial Torsen LSD','Diferencial autoblocante rotativo mecânico para melhor tração em saídas de curvas.','Transmissão',2100.00,'assets/img/blocante-lsd.jpg',2),(41,'Alavanca de Câmbio Short Shifter Engate Rápido','Reduz o curso da alavanca de câmbio em até 40% proporcionando trocas de marcha velozes.','Transmissão',350.00,'assets/img/short-shifter.jpg',3),(42,'Volante de Motor Aliviado em Aço Carbono','Volante de motor com peso reduzido para aceleração de giro do motor mais rápida.','Transmissão',790.00,'assets/img/volante-aliviado.jpg',2),(43,'Remap de ECU Estágio 2 Customizado','Programação de software da central eletrônica original otimizada para ganho de potência.','Performance',1500.00,'assets/img/remap-stage2.jpg',1),(44,'Kit Injeção de Água/Metanol Stage 2','Sistema de pulverização de metanol para resfriamento de câmara e prevenção de detonação.','Performance',2400.00,'assets/img/kit-metanol.jpg',4),(45,'Coletor Térmico Termotape de Fibra de Vidro (15m)','Fita térmica isolante para coletores de escapamento, reduzindo o calor no cofre do motor.','Performance',110.00,'assets/img/termotape.jpg',2),(46,'Kit Aerofólio Traseiro em Fibra de Carbono GT','Aerofólio asa alta ajustável para aumento de downforce no eixo traseiro em pistas.','Estética',2150.00,'assets/img/aerofolio-gt.jpg',4),(47,'Reservatório de Óleo Oil Catch Can Alumínio','Tanque de retenção de vapores de óleo, evitando a contaminação da admissão de ar.','Performance',260.00,'assets/img/oil-catch-can.jpg',3),(48,'Capô em Fibra de Carbono Aliviado Extra Vent','Capô com saídas de ar funcionais para refrigeração do motor e redução severa de peso.','Estética',4200.00,'assets/img/capo-carbono.jpg',4),(49,'Espelhos Retrovisores Esportivos Estilo F1','Retrovisores em fibra de carbono fosca com lente azul anti-ofuscante.','Estética',310.00,'assets/img/retrovisor-f1.jpg',2);
`

const ESTRUTURA_COMPRA = `
    CREATE TABLE compra (
        id int(11) NOT NULL AUTO_INCREMENT,
        cliente_id int(11) NOT NULL,
        data_compra datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        valor_total decimal(10,2) NOT NULL,
        PRIMARY KEY (id),
        KEY idx_compra_cliente (cliente_id),
        CONSTRAINT fk_compra_cliente FOREIGN KEY (cliente_id)
            REFERENCES cliente (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`

const ESTRUTURA_COMPRA_PRODUTO = `
    CREATE TABLE compra_produto (
        id int(11) NOT NULL AUTO_INCREMENT,
        compra_id int(11) NOT NULL,
        produto_id int(11) NOT NULL,
        quantidade int(11) NOT NULL,
        preco_unitario decimal(10,2) NOT NULL,
        PRIMARY KEY (id),
        KEY idx_compra_produto_compra (compra_id),
        KEY idx_compra_produto_produto (produto_id),
        CONSTRAINT fk_compra_produto_compra FOREIGN KEY (compra_id)
            REFERENCES compra (id) ON DELETE CASCADE,
        CONSTRAINT fk_compra_produto_produto FOREIGN KEY (produto_id)
            REFERENCES produto (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`

async function criar_tabelas() {
    const connection = await db.pool.getConnection();
    try {
        await connection.beginTransaction();

        console.log("Removendo tabelas antigas...");
        await connection.query(DROP_TABELAS);

        console.log("Criando tabela 'cliente'...");
        await connection.query(ESTRUTURA_CLIENTE);
        await connection.query(DADOS_CLIENTE);

        console.log("Criando tabela 'produto'...");
        await connection.query(ESTRUTURA_PRODUTO);
        await connection.query(DADOS_PRODUTO);

        console.log("Criando tabela 'compra'...");
        await connection.query(ESTRUTURA_COMPRA);

        console.log("Criando tabela 'compra_produto'...");
        await connection.query(ESTRUTURA_COMPRA_PRODUTO);

        await connection.commit();
        console.log("Migration executada com sucesso!");
        process.exit(0);
    } catch (error) {
        await connection.rollback();
        console.log(error)
        process.exit(1);
    } finally {
        connection.release();
    }
}
criar_tabelas()
