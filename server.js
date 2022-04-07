const app = require("./app");
const mongoose = require("mongoose");
const config = require("./config");

let DB;
const PORT = config.PORT;

if (process.env.ENV === "development") {
  DB = process.env.DB_DEV;
} else {
  DB = process.env.DB;
}

mongoose
  .connect(DB)
  .then(() => console.log("DB CONNECTION SUCCESSFUL!"))
  .catch((err) => console.log("AN ERROR OCCURED WHILE CONNECTING TO DB ", err));

app.listen(PORT, () => {
  console.log("APP RUNNING ON PORT", PORT);
});
