import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";
const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.get("/", (req: Request, res: Response) => {
  //res.send("Hello World!");
  res.status(200).json({
    success: true,
    message: "DevPulse is running ....",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);

// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;