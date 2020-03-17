import express from "express";
// const express = require("express");
import bodyParser from "body-parser";
import morgan from "morgan";
import connectDb from "./src/connectDb.js";
import userRouter from "./src/routers/user";
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
// parse application/json
app.use(bodyParser.json());
connectDb()
  .then(res => {
    // tslint:disable-next-line: no-console
    console.log("Db connected");
  })
  .catch(err => {
    // tslint:disable-next-line: no-console
    console.log(err, "Db connection error");
  });
// app.use("/api", function(req, res, next) {
//   console.log("req", req);
//   next();
// });
app.use("/api", userRouter);

app.listen(3000);
