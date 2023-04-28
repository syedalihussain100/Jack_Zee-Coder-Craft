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



//   exports.getTotalAmountByUser = async (req, res, next) => {
//     try {
//       const paymentIntents = await stripe.paymentIntents.list({ limit: 100 });

//       console.log("paymentIntents.data",paymentIntents.data); // log the payment intents to the console
  
//       const userTotals = {};
  
//       paymentIntents.data.forEach((paymentIntent) => {
//         if (paymentIntent.metadata && paymentIntent.metadata.userId) {
//           const userId = paymentIntent.metadata.userId;
//           console.log(userId)
//           if (!userTotals[userId]) {
//             userTotals[userId] = 0;
//           }
//           userTotals[userId] += paymentIntent.amount;
//         }
//       });


//       // paymentIntents.data.forEach((paymentIntent) => {
//       //   if (paymentIntent.metadata && paymentIntent.metadata.userId) {
//       //     console.log(`Payment intent with ID ${paymentIntent.id} has metadata containing userId ${paymentIntent.metadata.userId}`);
//       //   }
//       // });
  
//       if (Object.keys(userTotals).length === 0) {
//         return res.status(404).json({ message: "No payment intents found with user data" });
//       }
  
//       res.status(200).json(userTotals);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "Failed to retrieve user totals from Stripe." });
//     }
//   };


// This is your test secret API key.
// const stripe = require("stripe")(process.env.STRIPE_API_SECRET_KEY);



// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

// exports.createStripe = async (req, res) => {
//   const { items } = req.body;

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: items,
//     currency: "usd",
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// };
