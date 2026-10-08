import { jwtVerify, errors } from "jose"

export async function verifyAccessToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.LOGIN_SIG)
    const { payload } = await jwtVerify(token, secret, {algorithms: ["HS256"]})

    return {
      valid: true,
      expired: false,
      payload,
    }
  } catch (error) {
    return {
      valid: false,
      expired: error instanceof errors.JWTExpired,
      payload: null,
    }
  }
}
