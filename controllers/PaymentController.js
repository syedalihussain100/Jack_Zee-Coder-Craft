const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY);

exports.processPayment = async (req, res, next) => {

    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "usd",
        metadata: {
          company: "JackDelivery",
        },
      });
    
      res
        .status(200)
        .json({ success: true, client_secret: myPayment.client_secret });

};



exports.sendStripeApiKey = async (req, res, next) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_PUBLICHER_KEY });
  };


