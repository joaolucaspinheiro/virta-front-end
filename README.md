# Virta

**Virta** é um sistema de gestão financeira **pessoal e compartilhada**. Cada pessoa organiza receitas e despesas em **carteiras**, que podem ser divididas com outras pessoas (família, casal, república) com papéis diferentes: **dono**, **editor** e **leitor**. As mudanças aparecem **em tempo real** para quem está com a carteira aberta.

Projeto da Atividade Final da disciplina de Programação para Web (React + Spring Boot).

## Links

| | |
|---|---|
| **Aplicação** | https://virta-front-end.vercel.app |
| **API** | https://virta-back-end.onrender.com |
| **Documentação da API (Swagger)** | https://virta-back-end.onrender.com/swagger-ui/index.html |
| Repositório do front-end | https://github.com/joaolucaspinheiro/virta |
| Repositório do back-end | https://github.com/joaolucaspinheiro/virta-back-end |

> O back-end roda no plano gratuito do Render, que "dorme" sem uso. **A primeira requisição pode levar cerca de 1 minuto**; depois disso a resposta é normal.

## Funcionalidades

- **Contas**: cadastro e login com e-mail e senha (JWT) ou com Google; recuperação de senha por e-mail.
- **Carteiras compartilhadas**: toda conta nasce com uma carteira padrão ("Minha carteira"); o dono convida membros por e-mail e define o papel de cada um. Ninguém pode excluir a última carteira de que é dono.
- **Transações e categorias**: receitas e despesas com categoria, data e descrição.
- **Dashboard**: indicadores de receitas, despesas e saldo, e gráfico mês a mês.
- **Tempo real**: quando um membro lança, edita ou apaga uma transação, o dashboard dos outros membros atualiza sozinho (Server-Sent Events).
- **Relatórios**: filtro por período (vários meses), tipo e categorias; resumo, gráfico mês a mês e por categoria, e **extrato em CSV** para abrir no Excel.
- **PWA**: instalável no celular e no computador, com funcionamento offline dos arquivos do app.
- **Internacionalização**: português e inglês.
- **Integração com IA**: _pendente — esta seção será atualizada._

## Arquitetura

```
┌────────────────────────┐   HTTPS + JWT    ┌──────────────────────────┐   JDBC + SSL   ┌──────────────┐
│ Front-end (Vercel)     │ ───────────────► │ Back-end (Render/Docker) │ ─────────────► │ MySQL (Aiven)│
│ React + TS + Vite, PWA │ ◄─────────────── │ Spring Boot 4 / Java 17  │                └──────────────┘
└────────────────────────┘   JSON / SSE     └──────────────────────────┘
                                                 │ HTTPS
                                                 ▼
                                          Brevo (e-mails transacionais)
```

**Back-end** (`virta-back-end`), organizado em camadas:

- `controller` — rotas REST; só recebem e devolvem DTOs.
- `service` — regras de negócio e **controle de acesso por papel** (quem pode ler, editar, convidar, excluir).
- `repository` — Spring Data JPA (consultas derivadas do nome do método).
- `dto` — `record`s de entrada e saída, com validação (`@NotNull`, `@DecimalMin`, `@PastOrPresent`...).
- `exception` — exceções de negócio e um `GlobalExceptionHandler` que padroniza as respostas de erro.
- `config` — segurança (JWT, CORS, cabeçalhos HTTP), rate limit e Swagger.
- `event` — eventos de domínio para o tempo real.

**Front-end** (`virta-front-end`): React 19 + TypeScript + Vite, Tailwind CSS 4 e componentes Radix, React Router, Recharts para gráficos, i18next para idiomas e `vite-plugin-pwa` para o PWA. As chamadas à API ficam em `src/services`, e o estado da carteira selecionada em um contexto (`WalletContext`).

## Decisões de projeto

- **Tempo real com SSE, e não WebSocket.** O sistema só precisa que o servidor avise "algo mudou"; SSE faz isso sobre HTTP comum, com menos complexidade. O aviso é publicado **depois do commit** da transação no banco (`@TransactionalEventListener(AFTER_COMMIT)`, padrão Observer), para que a outra aba nunca recarregue antes do dado existir. No front, o stream é lido com `fetch`, porque o `EventSource` do navegador não permite enviar o cabeçalho `Authorization` com o JWT.
- **Autorização no service, não só no front.** Esconder um botão não protege nada; toda regra de papel (ex.: leitor não lança transação, só o dono exclui) é conferida no back-end.
- **E-mail por API HTTPS (Brevo), não SMTP.** O plano gratuito do Render bloqueia as portas SMTP. O envio é assíncrono (`@Async`), então a tela responde na hora e o tempo de resposta não revela se um e-mail está cadastrado.
- **Relatório CSV pensado para o Excel em português**: separador `;`, vírgula decimal e BOM UTF-8 (acentos corretos).
- **Deploy com Docker** no Render, banco MySQL gerenciado no Aiven e front na Vercel — tudo em planos gratuitos.

## Segurança (OWASP)

| Risco | Como o sistema trata |
|---|---|
| Controle de acesso quebrado | Papéis por carteira conferidos em todo service; usuário só acessa carteiras das quais é membro. |
| Injeção (SQL) | Acesso ao banco só por JPA/consultas parametrizadas. |
| Injeção em CSV | Células que começam com `=`, `+`, `-`, `@`, tab ou CR são neutralizadas no extrato. |
| XSS / injeção em e-mail | React escapa o conteúdo por padrão; nomes digitados por usuários são escapados antes de entrar nos templates HTML dos e-mails. |
| Força bruta | Rate limit de 5 tentativas por minuto, por IP, em login, cadastro e recuperação de senha (resposta 429). |
| Cabeçalhos HTTP | CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e HSTS. |
| Falhas de autenticação | Senhas com BCrypt; JWT assinado; token de recuperação de uso único, válido por 1 hora e enviado só por e-mail. |
| Segredos | Nenhuma credencial no repositório: tudo vem de variáveis de ambiente ou de `application-secrets.properties` (no `.gitignore`). |
| CSRF | Desabilitado de propósito: a API é stateless e usa JWT no cabeçalho, sem cookies de sessão. |
| Dados pessoais (LGPD) | E-mails são mascarados nos logs; a chave do provedor de e-mail só tem permissão de envio. |

## Como rodar localmente

### Pré-requisitos

- Java 17 ou superior e MySQL 8 (ou MariaDB) rodando na porta 3306
- Node.js 22 (LTS) ou superior

### Back-end

```bash
git clone https://github.com/joaolucaspinheiro/virta-back-end.git
cd virta-back-end
cp src/main/resources/application-secrets-example.properties src/main/resources/application-secrets.properties
# edite application-secrets.properties com usuário/senha do banco e uma chave JWT
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080` e o Swagger em `http://localhost:8080/swagger-ui/index.html`. O banco `virta_db` e as tabelas são criados automaticamente.

### Front-end

```bash
git clone https://github.com/joaolucaspinheiro/virta.git virta-front-end
cd virta-front-end
npm install
npm run dev
```

O app abre em `http://localhost:5173`. Em desenvolvimento, o Vite encaminha `/auth` e `/api` para o back-end local, então nenhuma variável é obrigatória.

### Testes

```bash
cd virta-back-end
./mvnw test
```

Testes unitários (JUnit 5 + Mockito + AssertJ) cobrem as regras mais sensíveis: controle de acesso por papel, filtros do resumo, regra da carteira padrão, geração do CSV (inclusive a proteção contra injeção) e o rate limit.

## Variáveis de ambiente

### Back-end (Render)

| Variável | Para que serve |
|---|---|
| `SPRING_DATASOURCE_URL` | URL JDBC do MySQL, ex.: `jdbc:mysql://HOST:PORTA/defaultdb?sslMode=REQUIRED` |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | Credenciais do banco |
| `API_SECURITY_TOKEN_SECRET` | Chave Base64 (mín. 256 bits) para assinar o JWT — gere com `openssl rand -base64 32` |
| `APP_FRONTEND_URL` | Endereço do front, ex.: `https://virta-front-end.vercel.app`. Usado no CORS e nos links dos e-mails |
| `BREVO_API_KEY` | Chave da API do Brevo (permissão só de e-mails transacionais) |
| `MAIL_FROM` | E-mail remetente, verificado no Brevo |
| `GOOGLE_CLIENT_ID` | Opcional: Client ID do login com Google (há um valor padrão) |
| `PORT` | Definida pelo Render; localmente o padrão é 8080 |

Localmente, os mesmos valores ficam em `application-secrets.properties` (veja o arquivo `application-secrets-example.properties`).

### Front-end (Vercel)

| Variável | Para que serve |
|---|---|
| `VITE_API_URL` | Endereço do back-end, sem barra no final, ex.: `https://virta-back-end.onrender.com` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID do Google; sem ele, o botão "Entrar com Google" fica oculto |

As variáveis `VITE_` entram no momento do build: depois de alterá-las na Vercel, é preciso fazer um novo deploy.

## Principais rotas da API

| Método e rota | Descrição |
|---|---|
| `POST /auth/register`, `POST /auth/login`, `POST /auth/google` | Cadastro e login (devolve o JWT) |
| `POST /auth/forgot-password`, `POST /auth/reset-password` | Recuperação de senha |
| `GET/PUT /api/v1/users/me`, `PATCH /api/v1/users/me/password` | Perfil e troca de senha |
| `GET/POST /api/v1/wallets`, `GET/PUT/DELETE /api/v1/wallets/{id}` | Carteiras |
| `GET/POST /api/v1/wallets/{id}/members`, `PATCH/DELETE .../members/{userId}` | Membros e papéis |
| `GET/POST /api/v1/categories`, `PUT/DELETE /api/v1/categories/{id}` | Categorias |
| `GET/POST /api/v1/wallets/{id}/transactions`, `GET/PUT/DELETE .../{transactionId}` | Transações |
| `GET /api/v1/wallets/{id}/transactions/events` | Stream SSE de atualizações em tempo real |
| `GET /api/v1/wallets/{id}/summary` | Resumo (aceita período, categorias e tipo) |
| `GET /api/v1/wallets/{id}/reports/statement` | Extrato em CSV (`from`, `to`, `categoryIds`, `type`) |

A documentação completa, com os formatos de entrada e saída, está no Swagger.
