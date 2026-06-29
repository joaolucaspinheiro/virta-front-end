import type { AuthSession } from "@/types/auth";
import { mockDb } from "@/services/mockDb";
import { apiGoogleLogin, apiLogin, apiRegister } from "@/lib/api";

/**
 * Camada de serviço de autenticação.
 *
 * login/register/google: chamam o backend Spring de verdade (via @/lib/api + proxy).
 * recuperação/troca de senha: ainda mock (endpoints inexistentes nesta etapa).
 * Cada função lança AuthError com uma chave i18n (ou a mensagem do backend)
 * para a UI exibir o texto adequado.
 */

const DEFAULT_DELAY = 800;
const delay = (ms = DEFAULT_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Erro de negócio da autenticação. `messageKey` é uma chave do i18n. */
export class AuthError extends Error {
  readonly messageKey: string;
  constructor(messageKey: string) {
    super(messageKey);
    this.name = "AuthError";
    this.messageKey = messageKey;
  }
}

/**
 * Converte erros do fetch em AuthError. Falha de rede vira chave traduzível;
 * erros do backend (com mensagem) passam a mensagem adiante (o i18n devolve
 * o texto cru quando não é uma chave conhecida).
 */
function toAuthError(err: unknown): AuthError {
  if (err instanceof TypeError) {
    return new AuthError("auth.errors.server_unreachable");
  }
  if (err instanceof Error && err.message) {
    return new AuthError(err.message);
  }
  return new AuthError("login.messages.generic_error");
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function createId(): string {
  return crypto.randomUUID();
}

export async function login(input: LoginInput): Promise<AuthSession> {
  try {
    const data = await apiLogin(input.email, input.password);
    return {
      token: data.token,
      user: {
        id: String(data.id),
        name: data.nome,
        email: data.email,
        provider: "password",
      },
    };
  } catch (err) {
    throw toAuthError(err);
  }
}

export async function register(input: RegisterInput): Promise<AuthSession> {
  try {
    await apiRegister(input.name.trim(), input.email.trim(), input.password);
    // O backend de cadastro não devolve token; logamos em seguida.
    return await login({ email: input.email, password: input.password });
  } catch (err) {
    throw toAuthError(err);
  }
}

/**
 * Login com Google. Envia o ID token (credential) do Google Identity Services
 * ao backend, que valida a assinatura e devolve o nosso JWT.
 */
export async function loginWithGoogle(credential: string): Promise<AuthSession> {
  try {
    const data = await apiGoogleLogin(credential);
    return {
      token: data.token,
      user: {
        id: String(data.id),
        name: data.nome,
        email: data.email,
        provider: "google",
      },
    };
  } catch (err) {
    throw toAuthError(err);
  }
}

/**
 * Etapa 1 da recuperação (mock). Mensagem neutra na UI; como ainda não há
 * backend de recuperação, sempre geramos um token de teste para validar o fluxo.
 */
export async function forgotPassword(
  email: string,
): Promise<{ debugToken?: string }> {
  await delay();
  const token = createId();
  mockDb.saveToken(token, {
    email,
    expiresAt: Date.now() + 60 * 60 * 1000,
  });
  return { debugToken: token };
}

/**
 * Etapa 2 da recuperação (mock). Qualquer token não-vazio é aceito.
 * Se for um token conhecido, validamos a expiração e atualizamos o mock.
 */
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  await delay();
  if (!token) throw new AuthError("auth.errors.invalid_token");
  const data = mockDb.consumeToken(token);
  if (data) {
    if (data.expiresAt < Date.now()) {
      throw new AuthError("auth.errors.expired_token");
    }
    const user = mockDb.findByEmail(data.email);
    if (user) {
      user.password = newPassword;
      user.provider = "password";
      mockDb.upsert(user);
    }
  }
}

/**
 * Troca de senha (mock). O backend ainda não expõe esse endpoint.
 * Para usuários vindos do backend real (não presentes no mock), apenas
 * simulamos o sucesso, já que não há como verificar a senha atual aqui.
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await delay();
  const user = mockDb.findById(userId);
  if (user) {
    if (user.provider === "password" && user.password !== currentPassword) {
      throw new AuthError("auth.errors.wrong_current_password");
    }
    user.password = newPassword;
    user.provider = "password";
    mockDb.upsert(user);
  }
}
