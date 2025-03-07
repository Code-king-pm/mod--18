import path from 'path';
import { fileURLToPath } from 'url';

// ...existing code...

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ...existing code...

async function startApolloServer() {
  // ...existing code...
  console.log('Starting Apollo Server...');
  // ...existing code...
}

// ...existing code...
startApolloServer().catch((error) => {
  console.error(`Error starting the server: ${error}`);
});