import { Router } from "express";
import auth_route from "./api/v1/auth";

const router = Router();

router.use("/auth", auth_route);

export = router;
