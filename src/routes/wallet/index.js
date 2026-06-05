/**
 * @file routes/wallet/index.js
 * @description Routes for wallet management including checking balance, depositing funds, transferring money, and fetching transaction history.
 */

import express from 'express';
import { validateBody } from '../../middlewares/validator.js';
import authenticate from '../../middlewares/authenticate.js';
import { depositSchema, transferSchema } from '../../utils/schemas.js';

import { getWallet } from '../../controllers/wallet/getWallet.js';
import { depositFunds } from '../../controllers/wallet/deposit.js';
import { transferFunds } from '../../controllers/wallet/transfer.js';
import { getTransactionHistory } from '../../controllers/wallet/history.js';

const router = express.Router();

// Apply authentication middleware to all wallet routes
router.use(authenticate);

/**
 * @swagger
 * /wallet:
 *   get:
 *     summary: Get user wallet details
 *     description: Retrieves the current user's wallet, including the current balance.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet details retrieved successfully
 *       404:
 *         description: Wallet not found
 */
router.get('/', getWallet);

/**
 * @swagger
 * /wallet/deposit:
 *   post:
 *     summary: Deposit funds into wallet
 *     description: Adds money to the authenticated user's wallet.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 150.50
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Validation error
 */
router.post('/deposit', validateBody(depositSchema), depositFunds);

/**
 * @swagger
 * /wallet/transfer:
 *   post:
 *     summary: Transfer funds to another wallet
 *     description: Sends money from the authenticated user's wallet to another specified wallet.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverWalletId:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *               amount:
 *                 type: number
 *                 example: 50.00
 *               description:
 *                 type: string
 *                 example: Dinner split
 *     responses:
 *       200:
 *         description: Transfer successful
 *       400:
 *         description: Insufficient funds or validation error
 *       404:
 *         description: Receiver wallet not found
 */
router.post('/transfer', validateBody(transferSchema), transferFunds);

/**
 * @swagger
 * /wallet/history:
 *   get:
 *     summary: Get transaction history
 *     description: Retrieves a list of all deposits and transfers associated with the user's wallet.
 *     tags:
 *       - Wallet
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 */
router.get('/history', getTransactionHistory);

export default router;