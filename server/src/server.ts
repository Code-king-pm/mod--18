import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import User from './models/User.js';
import { verifyToken } from './services/auth.js';

// Define the Context interface
interface Context {
  user?: any; // Replace `any` with the correct type if available
}

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
  // You can add other options here if needed (like introspection, playground etc.)
});

const startApolloServer = async () => {
  // Start the Apollo server
  await server.start();
  await db; // Ensure the database connection is established before proceeding
  
  const PORT = process.env.PORT || 3001; // Set the port
  const app = express();

  // Enable CORS for all routes
  app.use(
    cors({
      origin: 'http://localhost:3000', // Specify the allowed origin
      credentials: true, // Allow credentials to be sent
    })
  );

  // Middleware for parsing application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: false }));
  // Middleware for parsing application/json
  app.use(express.json());

  // Set Content Security Policy headers
  app.use((_req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:;");
    next();
  });

  // Apply the Apollo middleware with context
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || '';

        if (token) {
          try {
            const decoded = verifyToken(token.replace('Bearer ', '')); // Verify the JWT
            const user = await User.findById(decoded._id); // Fetch the user from the database
            return { user }; // Attach user to the context
          } catch (err) {
            console.error('Error verifying token:', err);
          }
        }
        
        return { user: null }; // Default to null if authentication fails
      },
    })
  );

  // Start the server and listen on the specified port
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

// Call the function to start the server
startApolloServer().catch(error => {
  console.error('Error starting the server:', error);
});