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
    let { paymentIntentId } = req.params;

    console.log("verifyPayment invoked with id:", paymentIntentId);

    // Stripe returns a checkout session ID (cs_...) when the client redirects
    // using the default success_url.  Many frontends grab the `session_id` query
    // parameter, so we need to handle both session IDs and payment intent IDs.
    if (paymentIntentId && paymentIntentId.startsWith("cs_")) {
      // convert the session id to a payment intent id
      const session = await stripe.checkout.sessions.retrieve(paymentIntentId);
      paymentIntentId = session.payment_intent;
    }

    if (!paymentIntentId) {
      return res.status(400).json({
        status: "fail",
        message: "Payment or session ID is required",
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      status: "success",
      paymentStatus: paymentIntent.status,
      amountReceived: paymentIntent.amount_received / 100,
      currency: paymentIntent.currency,
    });
  } catch (err) {
    // Stripe errors often have a `type` property we could inspect but the global
    // error handler will log the message for us.  Re‑throw for the error middleware.
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

    console.log("Payment successful");
    console.log("PaymentIntent ID:", session.payment_intent);
  }

  res.json({ received: true });
};