const express = require("express");
const router = express.Router();
const User = require("../../user");
const { registerSchema, loginSchema } = require("../validation/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants");

/* GET users listing. */

router.post("/login", loginSchema, (req, res) => {
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .lean()
    .then(user => {
      console.log(user);
      if (user != null) checkUser(user, req.body.password, res);
      else return res.status(400).json({ msg: "user not found!" });
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

module.exports = router;
