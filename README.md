# Veiculos e Roupas - Frontend

Interface React com Tailwind CSS para consumir a API de cadastro.

Repositorio da API: `veiculos-roupas-api` (pasta `../trabalho_p2_fabricio`)

## Requisitos

- Docker e Docker Compose

## Execucao completa

Sobe frontend, API, MongoDB e PostgreSQL:

```bash
docker compose up --build
```

Acesse `http://localhost:8080`

A API fica em `http://localhost:3000` e o nginx do frontend faz proxy de `/api` para o backend.

## Apenas frontend

Se a API ja estiver rodando:

```bash
docker build -t veiculos-roupas-web .
docker run -p 8080:8080 -e API_PROXY_URL=http://host.docker.internal:3000 veiculos-roupas-web
```

## Estrutura

```
src/
  components/   layout, alertas, modal, paginacao
  contexts/     autenticacao
  pages/        telas da aplicacao
  services/     comunicacao com a api
```

## Funcionalidades

- Login e registro com JWT
- CRUD de carros, motos e marcas de roupa
- CRUD de usuarios (admin)
- Dashboard com resumo
- Busca nas listagens
- Confirmacao antes de excluir
- Paginacao e layout responsivo

## Configuracao

Copie `.env.example` para `.env`.

`VITE_API_URL` define a URL da API no build (padrao `/api` via proxy nginx).
`API_PROXY_URL` define o destino do proxy em runtime (padrao `http://api:3000`).

## Primeiro acesso

Registre um usuario em `/registrar`. O primeiro cadastro recebe perfil admin.
