import express from "express";

import { router } from "./router.js";
import { errorMiddleware } from "./shared/error-middleware.js";

const app = express();

app.use(express.json());

router(app);

app.use(errorMiddleware);

export { app };
