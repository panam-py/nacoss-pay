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
  email: {
    type: String,
    require: [true, "Every payment must have an email attached"],
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
  authorizationURL: {
    type: String,
    required: [true, "Every transaction requires an authorization URL."],
  },
  timeOfPayment: Date,
  amount: {
    type: Number,
    required: [true, "Every payment must have an amount"],
  },
});

const Payment = new mongoose.model("Payment", paymentSchema);

module.exports = Payment;
