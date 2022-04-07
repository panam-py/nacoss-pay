const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.use(paymentController.authorizeUser);
router.get("/find", paymentController.getPaymentDetailsByReference);

module.exports = router;
