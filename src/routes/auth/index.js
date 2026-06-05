/**
 * @file index.js
 * @description This file contains routes for user authentication including login, registration, and social login using Google and LinkedIn. It also handles user session management and provides user-related endpoints.
 */

import express from 'express';
import { validateBody } from '../../middlewares/validator.js';
import { loginSchema, registerSchema } from '../../utils/schemas.js';
import { loginUser } from '../../controllers/auth/login.js';
import { registerUser } from '../../controllers/auth/register.js';

const router = express.Router();


/**
 * @swagger
 * /auth/token/login:
 *   post:
 *     summary: User login via JWT token
 *     description: Authenticates the user and returns a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Validation error or incorrect credentials
 */
router.post('/token/login', validateBody(loginSchema), loginUser);

/**
 * @swagger
 * /auth/token/register:
 *   post:
 *     summary: User registration via JWT token
 *     description: Registers a new user and returns a JWT token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Registration successful, returns JWT token
 *       400:
 *         description: Validation error
 */
router.post('/token/register', validateBody(registerSchema), registerUser);


export default router;
