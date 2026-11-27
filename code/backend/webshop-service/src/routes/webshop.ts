import {Router} from 'express';
import {webshopService} from '../services/index.js';
import {asyncHandler} from '../middleware/errorHandling.js';

export const webshopRouter = Router();

webshopRouter.get('/orders', asyncHandler(async (_req, res) => {
    const orders = await webshopService.getAllOrders();
    res.json({data: orders, meta: {count: orders.length}});
}));
