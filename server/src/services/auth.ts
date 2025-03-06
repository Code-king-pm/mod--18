import type { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET_KEY || 'supersecretkey';
const expiration = '2h';

interface TokenPayload extends JwtPayload {
  _id: string;
  username: string;
  email: string;
}

/**
 * Middleware to authenticate JWT tokens.
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as TokenPayload;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

/**
 * Function to sign a JWT token.
 */

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
};

/**
 * Function to verify a JWT token.
 */
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid token');
  }
};