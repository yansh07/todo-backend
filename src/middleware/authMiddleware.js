import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// This will automatically validate the access token
const authMiddleware = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

//  to decode the token and get the user's ID
const getUserFromToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token);
    
    // The 'sub' field is the user ID in Auth0
    req.user = decodedToken.sub;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};

export { authMiddleware, getUserFromToken };