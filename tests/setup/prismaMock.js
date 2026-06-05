/**
 * @file tests/setup/prismaMock.js
 * @description Mocks the Prisma client globally for all unit tests.
 */

import { mockDeep, mockReset } from 'vitest-mock-extended';
import { beforeEach, vi } from 'vitest';

// 1. Import the real Prisma instance from the src directory
import prisma from '../../src/db/index.js';

// 2. Mock the db module globally
vi.mock('../../src/db/index.js', () => ({
  default: mockDeep(),
}));

// 3. Reset the mock before every single test
beforeEach(() => {
  mockReset(prisma);
});

export const prismaMock = prisma;