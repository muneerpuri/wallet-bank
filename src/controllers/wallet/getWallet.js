/**
 * @file controllers/wallet/getWallet.js
 * @description Controller to fetch the authenticated user's wallet information and balance.
 */

import prisma from '../../db/index.js';
import logger from '../../utils/logger.js';

/**
 * Retrieves the wallet details for the currently authenticated user.
 *
 * @async
 * @function getWallet
 * @param {object} req - The Express request object containing the authenticated user's ID.
 * @param {object} res - The Express response object used to send the wallet details.
 * @returns {object} JSON response with wallet ID, balance, and currency.
 */
export const getWallet = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      select: {
        id: true,
        balance: true,
        currency: true,
        createdAt: true,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found for this user.' });
    }

    res.status(200).json({
      message: 'Wallet retrieved successfully.',
      data: wallet,
    });
  } catch (error) {
    logger.error(`Error in getWallet: ${error.message}`);
    res.status(500).json({ error: 'Internal server error while retrieving wallet.' });
  }
};