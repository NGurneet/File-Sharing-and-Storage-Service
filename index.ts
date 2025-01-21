import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
const swaggerUi = require("swagger-ui-express");
import { initDB } from "./app/common/services/database.service";
import { initPassport } from "./app/common/services/passport-jwt.service";
import { loadConfig } from "./app/common/helper/config.hepler";
import { type IUser } from "./app/user/user.dto";
import errorHandler from "./app/common/middleware/error-handler.middleware";
import routes from "./app/routes";
import dotenv from 'dotenv';
import rateLimit from "express-rate-limit";
const swaggerDocument = require("../File-sharing-and-stroage-backend/app/swagger/swagger.json");
// import swaggerDocs from './app/swagger/swagger';

dotenv.config();

loadConfig();

declare global {
  namespace Express {
    interface User extends Omit<IUser, "password"> {}
    interface Request {
      user?: User;
      

    }
  }
}

const port = Number(process.env.PORT) ?? 5000;

const app: Express = express();

// Apply a basic rate limiter: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all routes
app.use(limiter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

const initApp = async (): Promise<void> => {
  // init mongodb
  await initDB();

  // passport init
  initPassport();

  // set base path to /api
  app.use("/api", routes);

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // Setup Swagger Docs route
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // error handler
  app.use(errorHandler);

  http.createServer(app).listen(port, () => {
    console.log("Server is running on port", port);
  });
};

void initApp();