import { Request, Response, NextFunction } from "express";
import Joi from "@hapi/joi";

export const registerSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const register = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  });
  const { error } = register.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};

export const loginSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const register = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required()
  });
  // tslint:disable-next-line: no-console
  console.log("req.body", req.body);
  const { error } = register.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  } else {
    next();
  }
};
