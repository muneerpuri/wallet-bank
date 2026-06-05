/**
 * @file controllers/wallet/deposit.js
 * @description Controller to handle adding funds to a user's wallet. Uses a database transaction to ensure atomicity.
 */

import prisma from '../../db/index.js';
import logger from '../../utils/logger.js';

/**
 * Deposits a specified amount into the authenticated user's wallet.
 * Creates a Transaction record of type DEPOSIT.
 *
 * @async
 * @function depositFunds
 * @param {object} req - Request object containing the deposit amount.
 * @param {object} res - Response object.
 * @returns {object} JSON response containing the updated balance and transaction details.
 */
export const depositFunds = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    // Use Prisma transaction to update balance and record transaction atomically
    const result = await prisma.$transaction(async (tx) => {
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: amount } },
      });

      const transaction = await tx.transaction.create({
        data: {
          amount,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          receiverWalletId: wallet.id,
          description: 'Added funds via deposit',
        },
      });

      return { updatedWallet, transaction };
    });

    res.status(200).json({
      message: 'Deposit successful.',
      data: result,
    });
  } catch (error) {
    logger.error(`Error in depositFunds: ${error.message}`);
    res.status(500).json({ error: 'Internal server error during deposit.' });
  }
};