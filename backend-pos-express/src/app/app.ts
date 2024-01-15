import express, { Request, Response } from "express";
import publicRouter from "../routes/public-route";
import errorMiddleware from "../middleware/error-middleware";
import notFoundMiddleware from "../middleware/not-found-middleware";
import { customerRouter } from "../routes/customer-route";
import { employeeRouter } from "../routes/employee-route";
import cors from "cors";
import logger from "./logging";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  logger.info({
    timestamp: new Date(),
    host: req.headers.host,
    token: req.headers.authorization,
    method: req.method,
    url: req.headers.url ?? req.url,
    params: req.params,
    query: req.query,
    body: req.body,
  });
  next();
});

app.use(publicRouter);
app.use(customerRouter);
app.use(employeeRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
