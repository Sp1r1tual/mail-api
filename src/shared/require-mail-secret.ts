import { createHash, timingSafeEqual } from "crypto";
import { Request, Response, NextFunction } from "express";

import { ApiError } from "./exceptions/api-error.js";

const digest = (value: string) => createHash("sha256").update(value).digest();

const requireMailSecret = (req: Request, res: Response, next: NextFunction) => {
  const expected = process.env.MAIL_API_SECRET;

  if (!expected) {
    throw ApiError.ServiceUnavailable("Mail service is not configured");
  }

  const provided = req.header("x-mail-secret") ?? "";

  // Hashing first gives both buffers the same length, as timingSafeEqual requires.
  if (!timingSafeEqual(digest(provided), digest(expected))) {
    throw ApiError.UnauthorizedError();
  }

  next();
};

export { requireMailSecret };
