import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

// JWKS client for Auth0
const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_ISSUER_BASE_URL}/.well-known/jwks.json`
});

// Function to get signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  console.log("🔐 AuthMiddleware: Token received, length:", token?.length || 0);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Verify token with Auth0
  jwt.verify(token, getKey, {
    audience: process.env.AUTH0_AUDIENCE,
    issuer: `https://${process.env.AUTH0_ISSUER_BASE_URL}/`,
    algorithms: ["RS256"]
  }, (err, decoded) => {
    if (err) {
      console.error("❌ JWT verification failed:", err.message);
      return res.status(401).json({ error: "Invalid token", details: err.message });
    }

    console.log("✅ JWT verified successfully");
    console.log("🔧 Decoded token:", JSON.stringify(decoded, null, 2));

    // Store decoded token in multiple formats for compatibility
    req.auth = {
      payload: decoded,
      ...decoded
    };
    req.user = decoded;

    console.log("🔧 Set req.auth.payload.sub:", decoded.sub);
    
    next();
  });
};