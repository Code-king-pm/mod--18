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

  const PORT = 4000; // Hardcode the port value here
  const app = express();

  app.use(
    cors({
      origin: true, // Allow all origins
      credentials: true,
    })
  );

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Explicitly allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
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
// Add logging to verify server startup
console.log('Starting Apollo Server...');