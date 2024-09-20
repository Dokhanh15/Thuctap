import express from 'express';
import { createPayment, vnpayIPN, vnpayReturn } from '../controllers/payment';

const paymentRouter = express.Router();

paymentRouter.post('/create-payment', createPayment);
paymentRouter.get('/vnpay-return', vnpayReturn);
paymentRouter.post('/vnpay-ipn', vnpayIPN);

export default paymentRouter;
