const CHAVE_TOKEN = 'vr_token';
const CHAVE_USUARIO = 'vr_usuario';

export function salvarSessao(token: string, usuario: object) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
}

export function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function obterUsuario<T>() {
  const dados = localStorage.getItem(CHAVE_USUARIO);
  return dados ? (JSON.parse(dados) as T) : null;
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
}

export function estaLogado() {
  return !!obterToken();
}
