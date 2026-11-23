import {Router} from 'express';
import {printZService} from '../services/index.js';
import {asyncHandler} from '../middleware/errorHandling.js';

export const printzRouter = Router();

printzRouter.get('/', asyncHandler(async (_req, res) => {
    const orders = await printZService.getAllOrders();
    res.json({data: orders, meta: {count: orders.length}});
}));