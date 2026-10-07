import { jwtVerify } from "jose"

export async function verifyAccessToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.LOGIN_SIG)
    const { payload } = await jwtVerify(token, secret, {algorithms: ["HS256"]})
    return payload
  } catch {
    return null
  }
}
