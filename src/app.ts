import * as express from "express";
import * as cors from "cors";
import helmet from "helmet";
import * as morgan from "morgan";
import { errorHandler, mongooseErrorHandler } from "@src/middlewares";
import { contactsRouter } from "@src/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors());
app.use(helmet());

app.use(morgan("dev"));

// health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    name: "Contacts API",
    version: "1.0.0",
    message: "Server is up and running",
  });
});

// contacts route
app.use("/api/contacts", contactsRouter);

// route to handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});
// middleware to handle mongoose specific errors and raise relevant exceptions
app.use(mongooseErrorHandler);

// middleware to handle errors gracefully
app.use(errorHandler);

export default app;
