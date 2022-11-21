import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.split(" ")[1];

    jwt.verify(token, "YOU_CAN", (err, user) => {
      if (err) {
        res.status(401).json({ status: false, result: "Token is valid" });
      } else {
        req.body.user = user;
        next();
      }
    });
  } else {
    res.status(401).json({
      status: false,
      result: "You are not authenticated",
    });
  }
};
