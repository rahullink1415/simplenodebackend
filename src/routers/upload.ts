import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";

const router = express.Router();
/* GET users listing. */

// router.post("/upload", upload.single("profile"), (req, res, next) =>{
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
//   if (
//     req.headers.authorization === null &&
//     !req.headers.authorization.startsWith("Bearer ")
//   )
//     return res.status(401).json({ msg: "unauthorized" });
//   jwt.verify(req.headers.authorization.split(" ")[1], SECRET_KEY, function(
//     err,
//     decoded
//   ) {
//     console.log("get", err, decoded);
//     if (err) return res.status(401).json({ msg: "unauthorized" });
//     if (decoded) return res.status(200).json({ msg: "uploaded" }); // bar

//     return res.status(401).json({ msg: "unauthorized" });
//   });
// });

export default router;
