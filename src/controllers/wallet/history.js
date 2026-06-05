/**
 * @file controllers/wallet/history.js
 * @description Controller to fetch the transaction history (sent and received) for the user's wallet.
 */

import prisma from '../../db/index.js';
import logger from '../../utils/logger.js';

/**
 * Retrieves the transaction history for the authenticated user's wallet.
 * Results are ordered by the most recent transactions first.
 *
 * @async
 * @function getTransactionHistory
 * @param {object} req - Request object.
 * @param {object} res - Response object.
 * @returns {object} JSON response containing an array of transaction records.
 */
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found.' });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderWalletId: wallet.id },
          { receiverWalletId: wallet.id },
        ],
      },
      orderBy: {
        createdAt: 'desc', // Newest first
      },
      select: {
        id: true,
        amount: true,
        type: true,
        status: true,
        description: true,
        createdAt: true,
        senderWallet: {
          select: { id: true, user: { select: { name: true, email: true } } },
        },
        receiverWallet: {
          select: { id: true, user: { select: { name: true, email: true } } },
        },
      },
    });

    res.status(200).json({
      message: 'Transaction history retrieved successfully.',
      data: transactions,
    });
  } catch (error) {
    logger.error(`Error in getTransactionHistory: ${error.message}`);
    res.status(500).json({ error: 'Internal server error while fetching history.' });
  }
};