const express = require("express");
const { processPayment, sendStripeApiKey } = require("../controllers/PaymentController");
const authMiddleware = require("../middleware/Auth");
const { Router } = express;
const router = Router();


router.route(`/payment/process`).post(authMiddleware,processPayment);
router.route(`/stripeapikey`).get(authMiddleware,sendStripeApiKey);



module.exports = router;