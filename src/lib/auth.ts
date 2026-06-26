// Auth V1 — cookie de session signé HMAC-SHA256 (CLAUDE.md section 6).
// Implémenté avec la Web Crypto API pour être compatible Edge runtime
// (le middleware tourne sur l'Edge et ne peut pas utiliser `node:crypto`).

export const SESSION_COOKIE = "board_session";

// Payload constant : l'app a une seule utilisatrice, pas de rôles.
const PAYLOAD = "authenticated";

const encoder = new TextEncoder();

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Comparaison à temps constant pour éviter les timing attacks.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Crée un token signé `authenticated.<hmac>`. */
export async function createSessionToken(secret: string): Promise<string> {
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(PAYLOAD));
  return `${PAYLOAD}.${toHex(signature)}`;
}

/** Vérifie qu'un token de cookie est valide et signé avec le bon secret. */
export async function verifySessionToken(
  token: string | undefined,
  secret: string,
): Promise<boolean> {
  if (!token || !secret) return false;

  const separator = token.lastIndexOf(".");
  if (separator === -1) return false;

  const payload = token.slice(0, separator);
  const signatureHex = token.slice(separator + 1);
  if (payload !== PAYLOAD) return false;

  const key = await getKey(secret);
  const expected = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return timingSafeEqual(toHex(expected), signatureHex);
}
