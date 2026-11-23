import { describe, it, expect } from 'vitest';
import { PrintZService } from '../../src/services/PrintZService.js';

describe('PrintZService', () => {
  it('getAllOrders returns an array', async () => {
    const service = new PrintZService();

    const orders = await service.getAllOrders();

    expect(Array.isArray(orders)).toBe(true);
  });
});
