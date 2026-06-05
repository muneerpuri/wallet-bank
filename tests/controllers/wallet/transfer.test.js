/**
 * @file tests/controllers/wallet/transfer.test.js
 * @description Unit tests for the transferFunds controller using receiverWalletId.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { transferFunds } from '../../../src/controllers/wallet/transfer.js';
import prisma from '../../../src/db/index.js';

// Mock the logger so tests don't clutter the console output
vi.mock('../../../src/utils/logger.js', () => ({
  default: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('transferFunds Controller', () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up standard mock Request & Response objects for this API
    req = {
      user: { userId: 'sender-user-id' },
      body: {
        receiverWalletId: 'receiver-wallet-id',
        amount: 50.0,
        description: 'Test transfer',
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it('should return 404 if sender wallet is not found', async () => {
    // Mock Sender lookup returning null
    prisma.wallet.findUnique.mockResolvedValueOnce(null);

    await transferFunds(req, res);

    expect(prisma.wallet.findUnique).toHaveBeenCalledWith({ where: { userId: 'sender-user-id' } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Sender wallet not found.' });
  });

  it('should return 400 if user tries to transfer to their own wallet', async () => {
    // Mock Sender lookup returning a wallet ID that matches the receiverWalletId in req.body
    prisma.wallet.findUnique.mockResolvedValueOnce({
      id: 'receiver-wallet-id', // Matches req.body.receiverWalletId
      balance: 100.0,
    });

    await transferFunds(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Cannot transfer funds to your own wallet.' });
  });

  it('should return 400 if sender has insufficient funds', async () => {
    // Mock Sender lookup returning a balance lower than the requested amount (50.0)
    prisma.wallet.findUnique.mockResolvedValueOnce({
      id: 'sender-wallet-id',
      balance: 20.0, 
    });

    await transferFunds(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Insufficient funds for this transfer.' });
  });

  it('should return 404 if receiver wallet is not found', async () => {
    // 1st Call: Sender lookup (Success)
    prisma.wallet.findUnique.mockResolvedValueOnce({
      id: 'sender-wallet-id',
      balance: 100.0,
    });

    // 2nd Call: Receiver lookup (Fails)
    prisma.wallet.findUnique.mockResolvedValueOnce(null);

    await transferFunds(req, res);

    expect(prisma.wallet.findUnique).toHaveBeenCalledWith({ where: { id: 'receiver-wallet-id' } });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Receiver wallet not found or invalid.' });
  });

  it('should process transfer successfully when all conditions are met', async () => {
    // 1st Call: Sender lookup
    prisma.wallet.findUnique.mockResolvedValueOnce({
      id: 'sender-wallet-id',
      balance: 100.0,
    });

    // 2nd Call: Receiver lookup
    prisma.wallet.findUnique.mockResolvedValueOnce({
      id: 'receiver-wallet-id',
      balance: 10.0,
    });

    // Mock the Prisma $transaction result
    const mockTransactionResult = {
      id: 'transaction-123',
      amount: 50.0,
      type: 'TRANSFER',
      status: 'COMPLETED',
      senderWalletId: 'sender-wallet-id',
      receiverWalletId: 'receiver-wallet-id',
      description: 'Test transfer',
    };
    prisma.$transaction.mockResolvedValueOnce(mockTransactionResult);

    await transferFunds(req, res);

    expect(prisma.$transaction).toHaveBeenCalled(); 
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Transfer completed successfully.',
      data: mockTransactionResult,
    });
  });

  it('should handle internal server errors gracefully', async () => {
    // Force Prisma to throw an error on the very first query
    prisma.wallet.findUnique.mockRejectedValueOnce(new Error('Database disconnected'));

    await transferFunds(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error during transfer.' });
  });
});