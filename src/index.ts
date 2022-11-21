import "reflect-metadata";
import express from "express";
import Helmet from "helmet";
import Morgan from "morgan";
import cors from "cors";
import { error_handler } from "./application/utils/error_handle";
import router from "./presentation/router";

const app = express();

app.use(Helmet());

app.use(Morgan("dev"));

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", router);

app.use(error_handler);

app.get("*", async (_req: express.Request, res: express.Response) => {
  res.status(404).json({
    status: false,
    result: "Page not found",
  });
});

app.listen(3000, () => {
  console.log("start app .....");
});
