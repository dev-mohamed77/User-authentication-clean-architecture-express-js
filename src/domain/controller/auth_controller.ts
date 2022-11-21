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

const logger = new Logger("auth");

@injectable()
class AuthController {
  constructor(
    public register_useCase: RegisterUseCase,
    public login_useCase: LoginUseCase
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
}

export = AuthController;
