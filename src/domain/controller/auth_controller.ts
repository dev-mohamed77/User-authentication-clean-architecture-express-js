import { Response, Request, NextFunction, json } from "express";
import current_date from "../../application/utils/current_date";
import { ApiError } from "../../application/utils/error_handle";
import Logger from "../../application/utils/logger";
import password_valid from "../../application/utils/password_validator";
import LoginUseCase from "../usecase/auth/login";
import { RegisterUseCase } from "../usecase/auth/register";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { injectable } from "tsyringe";
import AuthPostgresqlDataSource from "../../data/data-sources/postgresql/auth";
import AuthRepositoryImp from "../../data/repository/auth";
import RefreshTokenUseCase from "../usecase/auth/refresh_token";

const logger = new Logger("auth");

@injectable()
class AuthController {
  constructor(
    public register_useCase: RegisterUseCase,
    public login_useCase: LoginUseCase,
    public refresh_token_useCase: RefreshTokenUseCase
  ) {}

  async register(req: Request, res: Response, next: NextFunction) {
    const { username, email, password } = req.body;

    try {
      if (!username || !email || !password) {
        const message = "username , email and password are required";
        throw new ApiError(message, 400, message);
      }

      if (!password_valid(password)) {
        const message =
          "The password must contain large letters, small letters and numbers.";
        throw new ApiError(message, 400, message);
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const result = await this.register_useCase.execute({
        username: username,
        email: email,
        password: hashPassword,
        created_at: current_date(),
      });

      res.status(200).json({
        status: true,
        result: result[0],
      });
      logger.infoWithObject("Registration successfully", result[0]);
    } catch (err) {
      next(err);
      logger.errorWithObject(err.name || "Registration error", err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

    try {
      if (!username || !password) {
        const message = "username and password is required";
        throw new ApiError(message, 400, message);
      }

      const username_result = await this.login_useCase.execute(username);
      if (!username_result.length) {
        const message = "Wrong username";
        throw new ApiError(message, 400, message);
      }

      const encoded_password = await bcrypt.compare(
        password,
        username_result[0].users_password
      );

      if (!encoded_password) {
        const message = "Wrong password";
        throw new ApiError(message, 400, message);
      }

      const token = jwt.sign(
        {
          id: username_result[0].id,
          username: username_result[0].username,
          email: username_result[0].email,
        },
        "YOU CAN",
        { expiresIn: "5h" }
      );

      res.status(200).json({
        status: true,
        result: { ...username_result[0], token },
      });

      logger.infoWithObject("Login successfully", {
        token,
        username_result,
      });
    } catch (err) {
      next(err);
      logger.errorWithObject(err.name || "Registration error", err);
    }
  }

  public logout(req: Request, res: Response, next: NextFunction) {
    throw "Unimplemtation method";
  }

  public async refresh_token(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.body;
    try {
      if (!refresh_token) {
        res
          .status(401)
          .json({ status: false, message: "You are not authenticated" });
      } else {
        jwt.verify(
          refresh_token,
          "YOU_CAN",
          async (err: any, user_result: any) => {
            if (err) {
              res.status(401).json({ status: false, result: "Token is valid" });
            } else {
              const user = await this.refresh_token_useCase.execute(
                user_result.id
              );

              if (!user.length) {
                const message = "user is not exist";
                throw new ApiError(message, 400, message);
              }

              const token_sign = jwt.sign(
                {
                  id: user[0].id,
                  username: user[0].username,
                  email: user[0].email,
                },
                "YOU CAN",
                { expiresIn: "5h" }
              );

              res.status(200).json({
                status: true,
                result: { ...user[0], token: token_sign },
              });
              logger.infoWithObject("Login successfully", {
                token_sign,
                user,
              });
            }
          }
        );
      }
    } catch (err) {
      console.log(err);
      next(err);
      logger.errorWithObject(err.name || "Registration error", err);
    }
  }
}

export = AuthController;
