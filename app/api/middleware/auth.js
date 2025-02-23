import jwt from "jsonwebtoken";

export function authenticateToken(req) {
  const token = req.headers.get("authorization");
  if (!token) throw new Error("Unauthorized");

  return jwt.verify(token, process.env.JWT_SECRET);
}
