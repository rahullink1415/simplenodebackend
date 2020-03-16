const express = require("express");
const router = express.Router();
const User = require("../../user");
const { registerSchema, loginSchema } = require("./../validation/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("./../constants");

/* GET users listing. */

router.get("/", function(req, res) {
  if (
    req.headers.authorization === null &&
    !req.headers.authorization.startsWith("Bearer ")
  )
    return res.status(401).json({ msg: "unauthorized" });
  jwt.verify(req.headers.authorization.split(" ")[1], SECRET_KEY, function(
    err,
    decoded
  ) {
    console.log("get", err, decoded);
    if (err) return res.status(401).json({ msg: "unauthorized" });
    if (decoded) return res.status(200).json({ msg: "connected" }); // bar

    return res.status(401).json({ msg: "unauthorized" });
  });
});
router.get("/user", function(req, res) {
  if (
    req.headers.authorization === null &&
    !req.headers.authorization.startsWith("Bearer ")
  )
    return res.status(401).json({ msg: "unauthorized" });
  jwt.verify(req.headers.authorization.split(" ")[1], SECRET_KEY, function(
    err,
    decoded
  ) {
    console.log("user", err, decoded);
    if (err) return res.status(401).json({ msg: "unauthorized" });
    if (decoded) {
      console.log("decoded", decoded.data);
      User.find({ _id: decoded.data })
        .then(user => {
          return res.status(200).json({ msg: "success", user });
        })
        .catch(error => {
          return res.status(401).json({ msg: error });
        });
      // bar
    }
    // return res.status(401).json({ msg: "unauthorized" });
  });
});

router.post("/register", registerSchema, (req, res) => {
  User.findOne({ email: req.body.email })
    .then(userEmail => {
      if (userEmail) {
        return res.status(400).json({ msg: "Email already exist." });
      } else {
        const plainTextPassword = req.body.password;
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(plainTextPassword, salt, function(err, hash) {
            if (err) return res.status(400).json(err);
            req.body.password = hash;
            User.create(req.body)
              .then(aa => {
                return res.status(200).json({ msg: "user created" });
              })
              .catch(err => {
                return res.status(500).json({ msg: err });
              });
          });
        });
      }
    })
    .catch(err => {
      return res.status(500).json({ msg: err });
    });
});
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

async function checkUser(user, password, res) {
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = jwt.sign({ data: user._id }, SECRET_KEY, {
      expiresIn: 300000
    });
    // console.log("token", token);
    user.token = token;
    return res.status(200).json({ msg: "success", user: user });
  } else {
    return res.status(400).json({ msg: "password does not match" });
  }
}
module.exports = router;
