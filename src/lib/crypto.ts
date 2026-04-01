const encoder = new TextEncoder()
const decoder = new TextDecoder()

const SECRET_KEY = process.env.NEXT_PUBLIC_PHONE_SECRET || "my-super-secret-key-32"

async function getKey() {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  )

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

export async function encryptPhone(phone: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await getKey()

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(phone)
  )

  return `${btoa(String.fromCharCode(...iv))}:${btoa(
    String.fromCharCode(...new Uint8Array(encrypted))
  )}`
}

export async function decryptPhone(data: string) {
  const [ivStr, encryptedStr] = data.split(":")

  const iv = Uint8Array.from(atob(ivStr), c => c.charCodeAt(0))
  const encrypted = Uint8Array.from(atob(encryptedStr), c => c.charCodeAt(0))

  const key = await getKey()

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  )

  return decoder.decode(decrypted)
}