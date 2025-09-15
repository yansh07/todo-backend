import { auth } from "express-oauth2-jwt-bearer";

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.AUTH0_ISSUER_BASE_URL}/`,
  tokenSigningAlg: 'RS256'
});


export default checkJwt;
