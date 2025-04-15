import express, { Request, Response, NextFunction } from "express";
import User from "../../user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { registerSchema, loginSchema } from "../validation/validation";
const router = express.Router();

/* GET users listing. */

router.get("/", (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  console.log("authorization ", authorization)
  if (authorization === null || authorization === undefined)
    return res.status(401).json({ msg: "unauthorized" });
  if (authorization.startsWith("Bearer ")) {
    jwt.verify(authorization.split(" ")[1], SECRET_KEY, (err, decoded) => {
      // tslint:disable-next-line: no-console
      console.log("get", err, decoded);
      if (err) return res.status(401).json({ msg: "unauthorized" });
      if (decoded) return res.status(200).json({ msg: "connected" }); // bar

      return res.status(401).json({ msg: "unauthorized" });
    });
  } else {
    return res.status(401).json({ msg: "unauthorized" });
  }
});
router.get("/user", (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  if (authorization === null || authorization === undefined)
    return res.status(401).json({ msg: "unauthorized" });
  if (authorization.startsWith("Bearer ")) {
    jwt.verify(authorization.split(" ")[1], SECRET_KEY, (err, decoded: any) => {
      if (err) return res.status(401).json({ msg: "unauthorized" });
      if (decoded.data) {
        User.find({ _id: decoded.data })
          .then(user => {
            return res.status(200).json({ msg: "success", user });
          })
          .catch(error => {
            return res.status(401).json({ msg: error });
          });
      }
    });
  } else {
    return res.status(401).json({ msg: "unauthorized" });
  }
});

router.post("/register", registerSchema, (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .then(userEmail => {
      if (userEmail) {
        return res.status(400).json({ msg: "Email already exist." });
      } else {
        const plainTextPassword = req.body.password;
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (err, salt) => {
          bcrypt.hash(plainTextPassword, salt, (error, hash) => {
            if (err) return res.status(400).json(error);
            req.body.password = hash;
            User.create(req.body)
              .then(aa => {
                return res.status(200).json({ msg: "user created" });
              })
              .catch(e => {
                return res.status(500).json({ msg: e });
              });
          });
        });
      }
    })
    .catch(err => {
      return res.status(500).json({ msg: err });
    });
});
router.post("/login", loginSchema, (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .lean()
    .then(user => {
      if (user != null) checkUser(user, req.body.password, res);
      else return res.status(400).json({ msg: "user not found!" });
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

async function checkUser(user: any, password: string, res: Response) {
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = jwt.sign({ data: user._id }, SECRET_KEY, {
      expiresIn: 300000
    });
    // console.log("token", token);
    user.token = token;
    return res.status(200).json({ msg: "success", user });
  } else {
    return res.status(400).json({ msg: "password does not match" });
  }
}
export default router;
