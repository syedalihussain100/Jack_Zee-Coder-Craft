const express = require("express");
const { processPayment, sendStripeApiKey,getTotalAmountByUser } = require("../controllers/PaymentController");
const authMiddleware = require("../middleware/Auth");
const { Router } = express;
const router = Router();


router.route(`/payment/process`).post(authMiddleware,processPayment);
router.route(`/stripeapikey`).get(authMiddleware,sendStripeApiKey);
// router.route(`/stripe/totals`).get(getTotalAmountByUser)
// router.route(`/create-payment-intent`).post(authMiddleware,createStripe);



module.exports = router;