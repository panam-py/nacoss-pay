const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.use(paymentController.authorizeUser);
router.get("/find", paymentController.getPaymentDetailsByReference);
router.post("/pay", paymentController.initialize);
router.get("/search", paymentController.searchPaymentDetails);

module.exports = router;
