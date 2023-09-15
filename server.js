const app = require("./app");

const mongoose = require("mongoose");

const user = "yfn";
const password = "nenDQx8b8N2rnrLO";
const DB_HOST = `mongodb+srv://${user}:${password}@cluster0.yc88dmg.mongodb.net/notebook`;
mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
  })
  .catch(error => {
    console.log("DB error", error.message);
    process.exit(1);
  });
