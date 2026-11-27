import { describe, it, expect } from 'vitest';
import { WebshopService } from '../../src/services/WebshopService.js';

describe('WebshopService', () => {
  it('getAllOrders returns an array', async () => {
    const service = new WebshopService();

    const orders = await service.getAllOrders();

    expect(Array.isArray(orders)).toBe(true);
    expect(orders).toHaveLength(0);
  });
});
