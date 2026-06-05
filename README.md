# Node.js 2024 Project

This project is a modern Node.js application featuring OAuth authentication using Google and LinkedIn, a RESTful API built with Express.js, and Prisma as the ORM for interacting with a PostgreSQL database. It includes Swagger for API documentation and various development tools for linting, formatting, and deployment.

## Features

- **OAuth Authentication:** Secure login using Google and LinkedIn OAuth 2.0.
- **RESTful API:** A fully functional API for handling user data, login, registration, and authentication.
- **Database Integration:** PostgreSQL database managed via Prisma ORM.
- **API Documentation:** Interactive API documentation generated with Swagger and JSDoc.
- **Logging:** Winston for structured logging with various log levels.
- **Session Management:** Express session for maintaining authenticated sessions.
- **PM2 for Deployment:** Scalable production setup using PM2 for process management.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Running the App](#running-the-app)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Development Tools](#development-tools)
- [API Documentation](#api-documentation)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://gitlab.com/purimuneer/nodejs-boilerplate-2024
   cd nodejs2024
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:
   Copy the `.env.example` file to `.env` and update the values as necessary for your environment.

## Setup

Before running the application, make sure you have configured the following environment variables in your `.env` file:

- `PORT`: The port on which the app should run.
- `JWT_SECRET`: The secret key used for signing JWT tokens.
- `DATABASE_URL`: The connection string for the PostgreSQL database.
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials for Google login.
- `LINKEDIN_CLIENT_ID` & `LINKEDIN_CLIENT_SECRET`: OAuth credentials for LinkedIn login.
- `SESSION_SECRET`: The secret used for session management.
- `NODE_ENV`: Set to `development` or `production`.

## Running the App

### Development Mode

To run the app in development mode with live-reloading (via `nodemon`):

```bash
npm run dev
```

### Production Mode

To run the app in production mode, you can use `pm2` for process management:

1. Start the app:

   ```bash
   npm run pm2-start
   ```

2. Reload the app after making changes:
   ```bash
   npm run pm2-reload
   ```

### Start the App Manually

If you prefer, you can start the app manually using:

```bash
npm start
```

## Scripts

Here are the available npm scripts for this project:

- `npm run dev`: Starts the app in development mode with `nodemon` for automatic reloading.
- `npm run start`: Starts the app in production mode.
- `npm run lint`: Runs ESLint on the project files to ensure code quality.
- `npm run format`: Formats the code using Prettier.
- `npm run generate-doc`: Generates API documentation using JSDoc.
- `npm run pm2-start`: Starts the app using PM2 with the provided `ecosystem.config.js` file.
- `npm run pm2-reload`: Reloads the app in PM2 without downtime.

## Environment Variables

The following environment variables should be set in your `.env` file:

```
PORT=8080
JWT_SECRET=your_jwt_secret
DATABASE_URL="postgresql://postgres:root@localhost:5432/ai_db"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
LINKEDIN_CLIENT_ID="your_linkedin_client_id"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"
SESSION_SECRET="your_session_secret"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
FRONTEND_SUCCESS_URL="http://localhost:5173/dashboard"
FRONTEND_FAILURE_URL="http://localhost:5173"
GOOGLE_REDIRECT_URI="/api/v1/auth/google/callback"
LINKEDIN_REDIRECT_URI="/api/v1/auth/linkedin/callback"
```

## Development Tools

This project uses the following tools to improve the development process:

- **ESLint:** To ensure code quality and enforce consistent coding standards.
- **Prettier:** Automatically formats the code to maintain a consistent style.
- **Nodemon:** Automatically restarts the app during development when code changes are detected.
- **JSDoc:** For generating and maintaining API documentation.
- **PM2:** A process manager for handling Node.js applications in production.
- **Swagger:** For interactive API documentation.

## API Documentation

You can access the API documentation by navigating to the following endpoint:

```
http://localhost:8080/api-docs
```

The Swagger UI will allow you to interact with the API and view detailed documentation for all endpoints.

## License

This project is licensed under the MIT License.

---

Made with ❤️ by Asambhav Solutions
