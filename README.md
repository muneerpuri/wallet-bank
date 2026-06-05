<div align="center">

# 💰 Wallet Bank API

**A secure, ACID-compliant digital wallet management system built with Node.js, Express, and PostgreSQL.**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Swagger](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black)](https://swagger.io)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)]()

</div>

---

## 📋 Overview

The **Wallet Bank API** is a production-grade RESTful backend that enables users to register, authenticate, and manage digital wallets. It supports secure deposits and peer-to-peer transfers backed by **ACID-compliant database transactions**, ensuring data integrity at every step.

Built with modern JavaScript (ESM), this API follows clean architecture patterns with separation of concerns — routes, controllers, middlewares, and utilities — making it easy to maintain, test, and scale.

---

## ✨ Features

### 🔐 Authentication
- **JWT-based authentication** with 24-hour token expiry
- User registration with auto-provisioned wallet (zero-balance)
- Secure password hashing using bcryptjs (12 salt rounds)
- Input validation via Joi schemas

### 💳 Wallet Operations
- **View Balance** — Retrieve wallet ID, balance, and currency
- **Deposit Funds** — Add money to your wallet with atomic transactions
- **Transfer Funds** — Send money to other wallets with:
  - Self-transfer prevention
  - Insufficient funds validation
  - Balance debited/credited within a single DB transaction
  - Full audit trail via transaction records

### 📊 Transaction History
- Chronological view of all deposits and transfers (newest first)
- Includes sender/receiver details for complete transparency
- Transaction types: `DEPOSIT` | `TRANSFER`
- Transaction statuses: `PENDING` → `COMPLETED` | `FAILED`

### 🛡️ Security & Middleware
- **Helmet** for secure HTTP headers
- **CORS** with configurable allowed origins
- **Morgan** HTTP request logging (dev mode)
- **Winston** structured application logging
- **Joi** request body validation
- **PM2** cluster mode for production load balancing

### 📖 API Documentation
- Interactive **Swagger UI** at `/api-docs`
- **JSDoc** generated documentation

---

## 🏗️ Architecture

```
src/
├── app.js                          # Express app setup
├── server.js                       # Entry point
├── config/
│   ├── index.js                    # Environment variables
│   ├── corsOptions.js              # CORS configuration
│   └── swaggerConfig.js            # Swagger/OpenAPI config
├── db/
│   └── index.js                    # Prisma client (PgBouncer-compatible)
├── middlewares/
│   ├── appInitializingMiddlewares.js  # Global middleware pipeline
│   ├── tokenAuthCheck.js           # JWT verification
│   ├── validator.js                # Joi schema validation
│   └── errorHandler.js             # Global error handler
├── controllers/
│   ├── auth/
│   │   ├── register.js             # User registration
│   │   └── login.js                # User login
│   └── wallet/
│       ├── getWallet.js            # Fetch wallet details
│       ├── deposit.js              # Deposit funds
│       ├── transfer.js             # Transfer between wallets
│       └── history.js              # Transaction history
├── routes/
│   ├── index.js                    # Route aggregator
│   ├── auth/index.js               # Auth routes
│   └── wallet/index.js             # Wallet routes
└── utils/
    ├── logger.js                   # Winston logger
    └── schemas.js                  # Joi validation schemas
```

### Data Model

```
User ──1:1──> Wallet ──1:N──> Transaction (as sender/receiver)
```

- **User**: `id`, `email` (unique), `name`, `password` (hashed)
- **Wallet**: `id`, `balance` (Decimal), `currency` (default: INR), `userId`
- **Transaction**: `id`, `amount`, `type`, `status`, `senderWalletId?`, `receiverWalletId`, `description?`

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18.x
- [PostgreSQL](https://www.postgresql.org) >= 14
- [npm](https://www.npmjs.com) or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/muneerpuri/wallet-bank.git
cd wallet-bank

# 2. Install dependencies
npm install

# 3. Copy & configure environment variables
cp .env.example .env
```

### Configuration

Edit the `.env` file with your own values:

```env
# Server
PORT=8080

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/wallet_bank"
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations to your database
npx prisma db push
```

### Running the Application

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start

# Production with PM2 cluster mode (scales to all CPU cores)
npm run pm2-start
```

The server starts at **http://localhost:8080**.  
Access the interactive API docs at **http://localhost:8080/api-docs**.

---

## 📬 API Reference

### Authentication Endpoints

All auth endpoints are prefixed with `/api/v1/auth`.

| Method | Endpoint             | Description                    | Auth Required |
|--------|----------------------|--------------------------------|:-------------:|
| POST   | `/token/register`    | Register a new user            | ❌            |
| POST   | `/token/login`       | Login and receive JWT token    | ❌            |

#### POST `/token/register`

```json
// Request
{ "name": "John Doe", "email": "john@example.com", "password": "securePass123" }

// Response 201
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

#### POST `/token/login`

```json
// Request
{ "email": "john@example.com", "password": "securePass123" }

// Response 200
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

### Wallet Endpoints

All wallet endpoints are prefixed with `/api/v1/wallet` and require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

| Method | Endpoint    | Description               |
|--------|-------------|---------------------------|
| GET    | `/`         | Get wallet details        |
| POST   | `/deposit`  | Deposit funds             |
| POST   | `/transfer` | Transfer to another wallet|
| GET    | `/history`  | View transaction history  |

#### GET `/wallet`

```json
// Response 200
{
  "message": "Wallet retrieved successfully.",
  "data": { "id": "uuid", "balance": 250.00, "currency": "INR", "createdAt": "2025-01-01T00:00:00.000Z" }
}
```

#### POST `/wallet/deposit`

```json
// Request
{ "amount": 150.50 }

// Response 200
{
  "message": "Deposit successful.",
  "data": {
    "updatedWallet": { "id": "uuid", "balance": 650.50, ... },
    "transaction": { "id": "uuid", "amount": 150.50, "type": "DEPOSIT", "status": "COMPLETED", ... }
  }
}
```

#### POST `/wallet/transfer`

```json
// Request
{ "receiverWalletId": "uuid-of-receiver", "amount": 50.00, "description": "Dinner split" }

// Response 200
{
  "message": "Transfer completed successfully.",
  "data": { "id": "uuid", "amount": 50.00, "type": "TRANSFER", "status": "COMPLETED", ... }
}
```

#### GET `/wallet/history`

```json
// Response 200
{
  "message": "Transaction history retrieved successfully.",
  "data": [
    {
      "id": "uuid",
      "amount": 50.00,
      "type": "TRANSFER",
      "status": "COMPLETED",
      "description": "Dinner split",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "senderWallet": { "id": "uuid", "user": { "name": "John Doe", "email": "john@example.com" } },
      "receiverWallet": { "id": "uuid", "user": { "name": "Jane Doe", "email": "jane@example.com" } }
    }
  ]
}
```

---

## 🧪 Testing

Unit tests are written with [Vitest](https://vitest.dev) and the Prisma client is mocked using `vitest-mock-extended` so no database connection is required during unit tests.

```bash
# Run all tests once
npm test

# Run tests in watch mode (useful during development)
npm run test:watch
```

### Test Coverage

- **Authentication**: Registration validation, duplicate email detection, login credential verification
- **Wallet Transfer**: Wallet existence checks, self-transfer prevention, insufficient funds, receiver validation, successful atomic transfers, error handling
- More tests are continuously added

---

## 📜 Scripts

| Script                  | Description                                           |
|-------------------------|-------------------------------------------------------|
| `npm start`             | Start the server in production mode                   |
| `npm run dev`           | Start with nodemon for hot-reloading during development|
| `npm test`              | Run all unit tests                                    |
| `npm run test:watch`    | Run tests in watch mode                               |
| `npm run lint`          | Lint the codebase with ESLint                         |
| `npm run format`        | Auto-format code with Prettier                        |
| `npm run generate-doc`  | Generate JSDoc documentation into `./docs/`           |
| `npm run pm2-start`     | Start with PM2 in cluster mode                        |
| `npm run pm2-reload`    | Reload PM2 processes without downtime                 |

---

## 🛠️ Tech Stack

| Category          | Technology                                      |
|-------------------|-------------------------------------------------|
| **Runtime**       | Node.js (ES Modules)                            |
| **Framework**     | Express 4.21                                    |
| **Database**      | PostgreSQL 16                                   |
| **ORM**           | Prisma 7.8 (with Prisma Adapter for Pg)         |
| **Auth**          | JSON Web Tokens (JWT) + bcryptjs                |
| **Validation**    | Joi 17                                          |
| **Logging**       | Winston 3                                       |
| **Security**      | Helmet, CORS                                    |
| **Documentation** | Swagger (OpenAPI 3.0), JSDoc                    |
| **Testing**       | Vitest 4, vitest-mock-extended                  |
| **Linting**       | ESLint 9                                        |
| **Formatting**    | Prettier 3                                      |
| **Process Mgr**   | PM2 5 (cluster mode)                            |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feat/amazing-feature`
3. **Commit** your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. **Push** to your branch: `git push origin feat/amazing-feature`
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/muneerpuri">Muneer Puri</a>
</div>
