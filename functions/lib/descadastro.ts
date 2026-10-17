/* O endereço viaja no link cifrado, não aberto e não em código guardado numa
   tabela. A chave fica numa variável de ambiente, só no servidor: com ela o
   servidor decifra e mostra na tela qual endereço vai sair, e sem ela o que
   está no link não significa nada para ninguém, nem no log da Vercel, nem para
   quem receber a mensagem encaminhada.

   AES-GCM pela WebCrypto, que existe tanto no Node quanto na borda, sem
   dependência nova. O selo do GCM faz o link falsificado ser recusado em vez de
   decifrar em lixo, então ninguém descadastra o endereço de outra pessoa por
   tentativa. */
import { env } from "@/functions/lib/env"

const ALGORITMO = "AES-GCM"
const TAMANHO_IV = 12

function deBase64Url(texto: string): Uint8Array<ArrayBuffer> {
  const base64 = texto.replace(/-/g, "+").replace(/_/g, "/")
  const binario = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))
  const bytes = new Uint8Array(new ArrayBuffer(binario.length))
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i)
  return bytes
}

function paraBase64Url(bytes: Uint8Array): string {
  const binario = Array.from(bytes, (b) => String.fromCharCode(b)).join("")
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/* A chave da variável pode ser qualquer frase: os 32 bytes que o AES exige saem
   do resumo SHA-256 dela. Assim o formato da senha não amarra ninguém, e trocar
   a frase invalida os links antigos de propósito. */
async function chave(): Promise<CryptoKey | null> {
  const frase = env.DESCADASTRO_CHAVE
  if (!frase || frase.length < 16) return null
  const semente = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(frase))
  return crypto.subtle.importKey("raw", semente, ALGORITMO, false, ["encrypt", "decrypt"])
}

export async function cifrarEndereco(email: string): Promise<string | null> {
  const k = await chave()
  if (!k) return null
  const iv = crypto.getRandomValues(new Uint8Array(TAMANHO_IV))
  const cifrado = new Uint8Array(
    await crypto.subtle.encrypt({ name: ALGORITMO, iv }, k, new TextEncoder().encode(email)),
  )
  const junto = new Uint8Array(iv.length + cifrado.length)
  junto.set(iv)
  junto.set(cifrado, iv.length)
  return paraBase64Url(junto)
}

/* Devolve null para link truncado, adulterado ou feito com outra chave. Quem
   cai aqui não fica sem saída: a página mostra o campo para digitar. */
export async function decifrarEndereco(token: string): Promise<string | null> {
  const k = await chave()
  if (!k || token.length < 24 || token.length > 400) return null
  try {
    const bytes = deBase64Url(token)
    const aberto = await crypto.subtle.decrypt(
      { name: ALGORITMO, iv: bytes.slice(0, TAMANHO_IV) },
      k,
      bytes.slice(TAMANHO_IV),
    )
    const email = new TextDecoder().decode(aberto).trim().toLowerCase()
    return /^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(email) && email.length <= 254 ? email : null
  } catch {
    return null
  }
}
