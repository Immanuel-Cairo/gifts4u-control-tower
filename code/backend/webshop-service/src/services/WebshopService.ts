import type { OrderSummary } from '../types/index.js';

export class WebshopService {
    async getAllOrders(): Promise<OrderSummary[]> {
        // TODO: orders uit de database ophalen (R01-US-01 e.v.)
        return [];
    }
}

export const webshopService = new WebshopService();
