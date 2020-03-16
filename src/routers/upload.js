const express = require("express");
const router = express.Router();
const User = require("../../user");
const upload = multer({ dest: "uploads/" });

const { registerSchema, loginSchema } = require("../validation/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants");

/* GET users listing. */

router.post("/upload", upload.single("profile"), function(req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
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
    if (decoded) return res.status(200).json({ msg: "uploaded" }); // bar

    return res.status(401).json({ msg: "unauthorized" });
  });
});

module.exports = router;
