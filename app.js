const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const connectDb = require("./src/connectDb.js");
const userRouter = require("./src/routers/user.js");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
// parse application/json
app.use(bodyParser.json());
connectDb()
  .then(res => {
    console.log("Db connected");
  })
  .catch(err => {
    console.log(err, "Db connection error");
  });
// app.use("/api", function(req, res, next) {
//   console.log("req", req);
//   next();
// });
app.use("/api", userRouter);

app.listen(3000);
