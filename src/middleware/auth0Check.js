import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

// Auth0 JWT verification
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.DOMAIN}/`,
  algorithms: ["RS256"]
});

export default checkJwt;
