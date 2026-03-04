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

router.get(
  "/verify/:paymentIntentId",
  paymentController.verifyPayment
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

module.exports = router;