// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import jwksClient from "jwks-client";

// Create JWKS client for your Auth0 domain
const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`,
});

// Function to get the signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error("❌ Error getting signing key:", err);
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    getKey,
    {
      audience: process.env.AUTH0_AUDIENCE, // Your API identifier
      issuer: `https://${process.env.AUTH0_ISSUER_BASE_URL}/`,
      algorithms: ["RS256"],
    },
    (err, decoded) => {
      if (err) {
        console.error("❌ JWT verification error:", err);
        return res.status(401).json({ error: "Invalid token" });
      }

      // ✅ Standardize: save decoded token directly to req.user
      req.user = decoded;

      console.log("✅ JWT verified, user:", decoded.sub);
      next();
    }
  );
};
