const express = require("express");
const morgan = require("morgan");
const config = require("./config");
const paymentRouter = require("./routers/paymentRouter");

const app = express();
app.use(express.json());

if (config.ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/payments", paymentRouter);

module.exports = app;
