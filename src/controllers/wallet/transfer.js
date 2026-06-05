/**
 * @file controllers/wallet/transfer.js
 * @description Controller to securely transfer funds between two wallets using ACID-compliant database transactions.
 */

import prisma from '../../db/index.js';
import logger from '../../utils/logger.js';

/**
 * Transfers money from the authenticated user's wallet to a receiver's wallet.
 * Validates sufficient balance and handles the decrement/increment atomically.
 *
 * @async
 * @function transferFunds
 * @param {object} req - Request object containing receiverWalletId, amount, and optional description.
 * @param {object} res - Response object.
 * @returns {object} JSON response containing the transaction record.
 */
export const transferFunds = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { receiverWalletId, amount, description } = req.body;

    const senderWallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!senderWallet) {
      return res.status(404).json({ error: 'Sender wallet not found.' });
    }

    if (senderWallet.id === receiverWalletId) {
      return res.status(400).json({ error: 'Cannot transfer funds to your own wallet.' });
    }

    // Convert decimal to number for comparison
    if (Number(senderWallet.balance) < amount) {
      return res.status(400).json({ error: 'Insufficient funds for this transfer.' });
    }

    const receiverWallet = await prisma.wallet.findUnique({ where: { id: receiverWalletId } });
    if (!receiverWallet) {
      return res.status(404).json({ error: 'Receiver wallet not found or invalid.' });
    }

    // Execute atomic transfer
    const transaction = await prisma.$transaction(async (tx) => {
      // 1. Deduct from sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { balance: { decrement: amount } },
      });

      // 2. Add to receiver
      await tx.wallet.update({
        where: { id: receiverWalletId },
        data: { balance: { increment: amount } },
      });

      // 3. Create transaction log
      return tx.transaction.create({
        data: {
          amount,
          type: 'TRANSFER',
          status: 'COMPLETED',
          senderWalletId: senderWallet.id,
          receiverWalletId,
          description: description || 'User-to-user transfer',
        },
      });
    });

    res.status(200).json({
      message: 'Transfer completed successfully.',
      data: transaction,
    });
  } catch (error) {
    logger.error(`Error in transferFunds: ${error.message}`);
    res.status(500).json({ error: 'Internal server error during transfer.' });
  }
};