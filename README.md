# API E-commerce — Node.js + Express + MySQL

## Como executar

```bash
npm install
# crie o arquivo .env com base no dotenv.txt
npm start
```

O `npm start` executa o `migration.js` (cria as tabelas e insere os dados iniciais) e depois inicia a API.

## Variáveis de ambiente (`.env`)

```env
API_PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=teste3dsc
JWT_SECRET=uma_senha_muito_forte

# Pasta das imagens dos produtos (fora do GitHub)
IMG_DIR=./img
```

Também é possível apontar `IMG_DIR` para uma pasta sincronizada com o Google Drive.

## Imagens dos produtos

As imagens **não devem ser enviadas ao GitHub**. A pasta `img/` está no `.gitignore`.

- Coloque os arquivos em `img/` (ou na pasta definida em `IMG_DIR`).
- A API serve as imagens em:
  - `GET /img/:arquivo`
  - `GET /assets/img/:arquivo` (compatível com o campo `caminho_img` do banco)

Exemplo: `http://localhost:3000/img/turbo-t25.jpg`

## Rotas

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/cliente` | Não | Cadastro de cliente |
| POST | `/login` | Não | Login do cliente (retorna JWT) |
| GET | `/cliente/perfil` | JWT | Perfil do cliente autenticado |
| GET | `/produto` | Não | Consulta de produtos com filtros e paginação |
| GET | `/produto/:id` | Não | Consulta de um produto |
| GET | `/img/:arquivo` | Não | Imagem do produto |
| POST | `/compra` ou `/compras` | JWT | Cadastra uma compra com vários produtos |
| GET | `/compra` ou `/compras` | JWT | Lista as compras do cliente autenticado |

Nas rotas protegidas, envie o cabeçalho:

```
Authorization: Bearer <token>
```

## Filtros de produtos

```http
GET /produto?busca=turbo
GET /produto?ordenacao=menor preco
GET /produto?ordenacao=maior preco
GET /produto?categoria=Performance
GET /produto?preco_min=200&preco_max=700
GET /produto?pagina=1
GET /produto?pagina=2
```

A paginação retorna **10 produtos por página**. Os cabeçalhos `X-Total-Count`, `X-Pagina` e `X-Limite` trazem os metadados da paginação.

## Cadastro de cliente

```http
POST /cliente
Content-Type: application/json

{
  "nome": "Nicolas Galvão",
  "cpf": "123.456.789-00",
  "celular": "(42)99966-4444",
  "email": "galvao@gmail.com",
  "senha": "cesarS2"
}
```

## Login

```http
POST /login
Content-Type: application/json

{
  "email": "galvao@gmail.com",
  "senha": "cesarS2"
}
```

Resposta:

```json
{
  "nome": "Nicolas Galvão",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

## Cadastro de compra

Aceita vários produtos ao mesmo tempo. O preço é sempre buscado no banco de dados, nunca no corpo da requisição.

```http
POST /compra
Authorization: Bearer <token>
Content-Type: application/json

{
  "produtos": [
    { "produto_id": 1, "quantidade": 2 },
    { "produto_id": 3, "quantidade": 1 }
  ]
}
```

Também é possível usar a chave `itens` ou enviar apenas os IDs:

```json
{ "itens": [{ "id": 1, "quantidade": 1 }, { "id": 2, "quantidade": 3 }] }
```

```json
{ "produtos": [1, 2, 3] }
```

Resposta `201`:

```json
{
  "msg": "Compra cadastrada com sucesso",
  "compra_id": 1,
  "cliente_id": 12,
  "valor_total": 3549.8,
  "produtos": [
    { "produto_id": 1, "nome": "Filtro de Ar...", "quantidade": 2, "preco_unitario": 349.9 },
    { "produto_id": 3, "nome": "Turbocompressor...", "quantidade": 1, "preco_unitario": 2850 }
  ]
}
```

## Consulta de compras do cliente

```http
GET /compra
Authorization: Bearer <token>
```

Resposta:

```json
[
  {
    "id": 1,
    "data_compra": "2026-11-12T13:00:00.000Z",
    "valor_total": "3549.80",
    "produtos": [
      {
        "produto_id": 1,
        "nome": "Filtro de Ar Esportivo Inbox K&N Style",
        "caminho_img": "assets/img/filtro-inbox.jpg",
        "quantidade": 2,
        "preco_unitario": "349.90"
      }
    ]
  }
]
```

## Estrutura das tabelas de compras

- `compra`: `id`, `cliente_id`, `data_compra`, `valor_total`
- `compra_produto`: `id`, `compra_id`, `produto_id`, `quantidade`, `preco_unitario`

As duas tabelas são criadas automaticamente pelo `migration.js`.
