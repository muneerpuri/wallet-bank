import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup/prismaMock.js'],
    include: ['tests/**/*.test.js'],
  },
});