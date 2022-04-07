const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Every payment attempt must have a name attached"],
  },
  session: {
    type: String,
    required: [true, "Every payment attempt must have a session attached"],
  },
  reference: {
    type: String,
    required: [true, "Every payment must have a unique reference"],
  },
  regNo: {
    type: String,
    required: [
      true,
      "Every payment requires the regstration number of the student paying",
    ],
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  authorizationURL: String,
  timeOfPayment: Date,
});

const Payment = new mongoose.model("Payment", paymentSchema);

module.exports = Payment;
