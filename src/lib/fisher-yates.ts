// Fisher-Yates shuffle com seed criptográfico
export function gerarSeedCripto(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function gerarHash(dados: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(dados);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    const j = randomBuffer[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function sortearVencedores<T extends { id: string }>(
  disponiveis: T[],
  quantidade: number
): T[] {
  const embaralhados = fisherYatesShuffle(disponiveis);
  return embaralhados.slice(0, Math.min(quantidade, embaralhados.length));
}
