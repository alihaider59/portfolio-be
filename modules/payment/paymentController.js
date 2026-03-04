const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create Checkout Session
 */
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { amount } = req.body;

    // Always validate server-side
    if (!amount || amount < 1) {
      return res.status(400).json({
        status: "fail",
        message: "Valid amount is required",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Test Payment",
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],

      metadata: {
        testFlow: "true",
      },

      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.status(200).json({
      status: "success",
      url: session.url,
      sessionId: session.id,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify Payment by PaymentIntent ID
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    );

    res.status(200).json({
      status: "success",
      paymentStatus: paymentIntent.status,
      amountReceived: paymentIntent.amount_received / 100,
      currency: paymentIntent.currency,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Webhook Handler
 */
exports.handleWebhook = (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    console.log("✅ Payment successful");
    console.log("PaymentIntent ID:", session.payment_intent);
  }

  res.json({ received: true });
};