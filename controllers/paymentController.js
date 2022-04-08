const Payment = require("../models/paymentModel");
const config = require("../config");
const axios = require("axios");

const makeID = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const validateIDIsUnique = (arr) => {
  let ID;
  ID = makeID(6);
  while (arr.includes(ID)) {
    console.log("ID already found in array", ID);
    ID = makeID(6);
  }
  console.log("ID not found in array", ID);
  return ID;
};

exports.authorizeUser = (req, res, next) => {
  if (!req.headers.API_KEY) {
    return res.staus(401).json({
      status: "failed",
      message: "Please include API_KEY in the request headers",
    });
  }

  if (req.headers.API_KEY !== config.API_KEY) {
    return res.status(401).json({
      status: "failed",
      message: "You are not authorized to continue",
    });
  }

  next();
};

const paystackInit = async (amount, email, reference) => {
  try {
    const headers = {
      Authorization: `BEARER ${config.PAYSTACK_API_KEY}`,
      "Content-type": "application/json",
    };

    const params = {
      email,
      amount,
      reference,
      currency: "NGN",
    };

    let authURL;

    const resp = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      params,
      { headers }
    );

    authURL = resp.data.data.authorization_url;

    // console.log(authURL);

    const payment = {
      email,
      reference,
      amount: amount / 100,
      authorizationURL: authURL,
    };

    console.log(payment);
    return payment;
  } catch (err) {
    console.log("AN ERROR OCCURED", err.message);
  }
};

exports.initialize = async (req, res, next) => {
  try {
    const { name, session, email, regNo, amount } = req.body;

    if (!name || !session || !email || !regNo || !amount) {
      return res(400).json({
        status: "failed",
        message:
          "Please provide 'name', 'session', 'email', 'regNo' and 'amount' in request body",
      });
    }

    const parsedAmount = parseInt(amount) * 100;

    const payments = await Payment.find();
    const referenceArr = [];

    payments.map((payment) => {
      referenceArr.push(payment.reference);
    });

    const reference = validateIDIsUnique(referenceArr);
    const payment = await paystackInit(parsedAmount, email, reference);
    payment.name = name;
    payment.session = session;
    payment.regNo = regNo;
    payment.confirmed = false;

    await Payment.insert(payment);

    res.status(200).json({
      status: "success",
      message: "Payment initilialization sucessful",
      data: { payment },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "failed",
      message: "An Error occured",
    });
  }
};

exports.getPaymentDetailsByReference = async (req, res, next) => {
  try {
    const { ref, paid } = req.body;
    let payments;

    if (!paid || !ref) {
      return res.status(400).json({
        status: "failed",
        message: "Include ref and paid attributes in request body",
      });
    }

    if (paid !== "all" && paid !== "confirmed") {
      return res.status(400).json({
        status: "failed",
        message:
          "paid attribute in request body can only be one of 'all' to return all payments stored in the DB or 'confirmed' to return only confirmed payments in the DB",
      });
    }

    if (paid === "all") {
      payments = await Payment.find({ reference: ref });
    } else if (paid === "confirmed") {
      payments = await Payment.find({ reference: ref, confirmed: true });
    }

    if (payments.length < 1) {
      return res.status(404).json({
        status: "failed",
        message: "No payment found with that reference",
      });
    }

    const payment = payments[0];

    res.status(200).json({
      status: "success",
      message: "Payment details found",
      data: { payment },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "failed",
      message: "An Error occured",
    });
  }
};

exports.searchPaymentDetails = async (req, res, next) => {
  try {
    const { q, paid } = req.body;
    let payments;

    if (!paid || !q) {
      return res.status(400).json({
        status: "failed",
        message: "Include q(search term) and paid attributes in request body",
      });
    }

    if (paid !== "all" && paid !== "confirmed") {
      return res.status(400).json({
        status: "failed",
        message:
          "paid attribute in request body can only be one of 'all' to return all payments stored in the DB or 'confirmed' to return only confirmed payments in the DB",
      });
    }

    if (paid === "all") {
      payments = await Payment.find();
    } else if (paid === "confirmed") {
      payments = await Payment.find({ confirmed: true });
    }

    const matches = [];

    payments.map((payment) => {
      const values = Object.values(payment);
      values.map((value) => {
        if (value === q || value.includes(q)) {
          matches.push(payment);
        }
      });
    });

    //   matches.

    if (matches.length < 1) {
      return res.status(404).json({
        status: "failed",
        message: `No Payment found with the search term ${q}`,
      });
    }

    res.status(200).json({
      status: "success",
      message: `${matches.length} payments found for the search term ${q}`,
      data: { payments: matches },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "failed",
      message: "An Error occured",
    });
  }
};
