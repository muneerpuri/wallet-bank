/**
 * @file index.js
 * @description This file declares and exports the main routing structure of the application. It centralizes routing logic by importing sub-routes and associating them with specific paths.
 */

import express from 'express';
import AuthRoutes from './auth/index.js';
import WalletRoutes from './wallet/index.js';

const router = express.Router();

/**
 * Mounts authentication-related routes under the '/auth' path.
 * All routes defined in AuthRoutes will be prefixed with '/auth'.
 * @example
 * // If an endpoint is defined as /login in AuthRoutes, it will be accessible at /api/v1/auth/login
 */
router.use('/auth', AuthRoutes);
router.use('/wallet', WalletRoutes);

export default router;
