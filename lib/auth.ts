import { jwtVerify, errors, type JWTPayload } from "jose"
import { NextRequest } from "next/server"

export async function verifyAccessToken(token: string) {
  try {
    const secretKey = process.env.LOGIN_SIG
    if (!secretKey) {
      console.error("LOGIN_SIG environment variable is not defined")
      return {
        valid: false,
        expired: false,
        payload: null,
      }
    }

    const secret = new TextEncoder().encode(secretKey)
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] })

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

export function getAuthToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get("access_token")?.value
  if (cookieToken) return cookieToken

  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim()
  }

  return null
}

export interface AuthResult {
  authenticated: boolean
  error?: string
  payload?: JWTPayload | null
}

export async function authenticateRequest(request: NextRequest): Promise<AuthResult> {
  const token = getAuthToken(request)
  if (!token) {
    return {
      authenticated: false,
      error: "Unauthorized: Missing authentication token",
    }
  }

  const result = await verifyAccessToken(token)
  if (!result.valid) {
    return {
      authenticated: false,
      error: result.expired ? "Unauthorized: Token expired" : "Unauthorized: Invalid token",
    }
  }

  return {
    authenticated: true,
    payload: result.payload,
  }
}
