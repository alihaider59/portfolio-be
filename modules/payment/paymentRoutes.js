const express = require("express");
const router = express.Router();
const paymentController = require("./paymentController");

/**
 * JSON parser for normal routes
 * Because client sends JSON body
 */
router.post(
  "/checkout",
  express.json(),
  paymentController.createCheckoutSession
);

/**
 * Route to verify payment.  The front end often supplies the checkout session
 * ID (`cs_*`) via the `session_id` query parameter; in that case the
 * controller will internally look up the session and extract the associated
 * PaymentIntent.  You can also pass the PaymentIntent ID directly.
 */
router.get(
  "/verify/:paymentIntentId",
  paymentController.verifyPayment
);

/**
 * Webhook route
 * MUST use raw() instead of json()
 * Because Stripe needs original raw body to verify signature
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

module.exports = router;