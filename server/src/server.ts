import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path'; // Add path module

import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import User from './models/User.js';
import { verifyToken } from './services/auth.js';

// Define the Context interface
interface Context {
  user?: any;
}

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db;

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(
    cors({
      origin: [
        'http://localhost:3000', 
        'https://mod-18-f69u.vercel.app', 
        'https://mod-18-f69u-j6sf42if0-code-king-pms-projects.vercel.app',
        'https://mod-18-f69u-pu8xzek2y-code-king-pms-projects.vercel.app' // Add the new origin here
      ],
      credentials: true,
    })
  );

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use((_req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:;");
    next();
  });

  // Serve static files from the "public" directory
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';

        if (token) {
          try {
            const decoded = verifyToken(token.replace('Bearer ', ''));
            const user = await User.findById(decoded._id);
            return { user };
          } catch (err) {
            console.error('Error verifying token:', err);
          }
        }

        return { user: null };
      },
    })
  );

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer().catch(error => {
  console.error('Error starting the server:', error);
});