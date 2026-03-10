import jwt from "jsonwebtoken";

/**
 * Verify guest JWT token from Authorization header.
 * @param {Request} request
 * @returns {{ submission_id, submission_no, email, type } | null}
 */
export function verifyGuestToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.GUEST_JWT_SECRET);
    if (payload.type !== "guest") return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Issue a guest JWT token.
 * @param {{ submission_id: string, submission_no: string, email: string }} payload
 * @returns {string} JWT token (HS256, 2h expiry)
 */
export function issueGuestToken(payload) {
  return jwt.sign(
    { ...payload, type: "guest" },
    process.env.GUEST_JWT_SECRET,
    { algorithm: "HS256", expiresIn: "2h" }
  );
}
