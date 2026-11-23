import { SignJWT, jwtVerify } from "jose";

export const ADMIN_COOKIE_NAME = "shamodha_admin_token";

function getSecretKey(): Uint8Array {
  const secret =
    process.env.AUTH_SECRET ||
    "super_secret_jwt_signing_key_change_in_production_2026";
  return new TextEncoder().encode(secret);
}

export interface AdminTokenPayload {
  username: string;
  role: "admin";
}

export async function signAdminToken(payload: AdminTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role === "admin" && typeof payload.username === "string") {
      return {
        username: payload.username,
        role: "admin",
      };
    }
    return null;
  } catch {
    return null;
  }
}

