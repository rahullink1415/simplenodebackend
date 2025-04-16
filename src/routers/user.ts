import express, { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import User from "../../user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../constants";
import { registerSchema, loginSchema } from "../validation/validation";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv"; // Import the config function from dotenv

const router = express.Router();

/* GET users listing. */

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const authorization = req.headers.authorization;
    console.log("authorization:", authorization);

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(401).json({ msg: "unauthorized" });
      return;
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error("JWT verification failed:", err);
        res.status(401).json({ msg: "unauthorized" });
        return;
      }

      console.log("Decoded token:", decoded);
      res.status(200).json({ msg: "connected" });
    });
  } catch (error) {
    console.error("Error in GET / route:", error);
    res.status(500).json({ msg: "internal server error" });
  }
});
router.get("/user",async (req: Request, res: Response) : Promise<void> => {
  const authorization = req.headers.authorization;
  if (authorization === null || authorization === undefined){
     res.status(401).json({ msg: "unauthorized" });
     return;
    }
  if (authorization.startsWith("Bearer ")) {
    jwt.verify(authorization.split(" ")[1], SECRET_KEY, (err, decoded: any) => {
      if (err)  {
        res.status(401).json({ msg: "unauthorized" });
      return;}
      if (decoded.data) {
        User.find({ _id: decoded.data })
          .then(user => {
            res.status(200).json({ msg: "success", user });
            return;
          })
          .catch(error => {
            res.status(401).json({ msg: error });
            return;
          });
      }
    });
  } else {
     res.status(401).json({ msg: "unauthorized" });
     return;
  }
});
router.post("/register", registerSchema, async (req: Request, res: Response): Promise<void> => {
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
                console.log("user created---",aa )
                return res.status(200).json({ msg: "user created",data:aa });
              })
              .catch(e => {
                return res.status(500).json({ msg: e.message });
              });
          });
        });
      }
    })
    .catch(err => {
      return res.status(500).json({ msg: err });
    });
});

//login
router.post("/login", loginSchema, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      res.status(400).json({ msg: "User not found!" });
      return;
    }

     checkUser(user, password, res); // Make sure checkUser handles the response
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});


async function checkUser(user: any, password: string, res: Response<any, Record<string, any>>) {
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    const token = jwt.sign({ data: user._id }, SECRET_KEY, {
      expiresIn: 300000
    });
    // console.log("token", token);
    user.token = token;
     res.status(200).json({ msg: "success", user });
    return;
  } else {
     res.status(400).json({ msg: "password does not match" });
     return;
  }
}
export default router;
