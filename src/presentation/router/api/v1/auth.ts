import { NextFunction, Request, Router, Response } from "express";
import { container } from "tsyringe";
import AuthPostgresqlDataSource from "../../../../data/data-sources/postgresql/auth";
import AuthRepositoryImp from "../../../../data/repository/auth";
import AuthController from "../../../../domain/controller/auth_controller";

container
  .register("AuthDataSource", {
    useClass: AuthPostgresqlDataSource,
  })
  .resolve(AuthPostgresqlDataSource);

container
  .register("AuthRepository", {
    useClass: AuthRepositoryImp,
  })
  .resolve(AuthRepositoryImp);

const auth_controller = container.resolve(AuthController);

const router = Router();

router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  auth_controller.register(req, res, next)
);

router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  auth_controller.login(req, res, next)
);

router.get(
  "/refresh-token",
  (req: Request, res: Response, next: NextFunction) =>
    auth_controller.refresh_token(req, res, next)
);

export = router;
