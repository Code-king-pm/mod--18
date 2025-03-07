# Project Name

This project is a full-stack application that includes a server and a front-end client. The server is built with Node.js, Express, and Apollo Server for GraphQL. The front-end is built with React.

## Deployed Link

You can access the deployed application at: [https://mod-18-k3pf-git-main-code-king-pms-projects.vercel.app](https://mod-18-k3pf-git-main-code-king-pms-projects.vercel.app)

## Getting Started

To run the project locally, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:
- Node.js
- npm (Node Package Manager)

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/Code-king-pm/mod--18
   ```

2. Navigate to the project directory:
   ```bash
   cd path/to/your/project
   ```

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install the server dependencies:
   ```bash
   npm install
   ```

3. Build the server:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm run start
   ```

The server should now be running on `http://localhost:4000`.

### Front-End Setup

1. Navigate to the front-end directory:
   ```bash
   cd client
   ```

2. Install the front-end dependencies:
   ```bash
   npm install
   ```

3. Build the front-end:
   ```bash
   npm run build
   ```

4. Start the front-end in development mode:
   ```bash
   npm run dev
   ```

The front-end should now be running on `http://localhost:3000`.

## Environment Variables

Make sure to set up the following environment variables in a `.env` file in the `server` directory:

```properties
PORT=4000
MONGODB_URI='mongodb://localhost:27017/'
JWT_SECRET_KEY='supersecretkey'
GOOGLE_BOOKS_API_KEY='your-google-books-api-key'
```

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
