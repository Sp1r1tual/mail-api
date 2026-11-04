import { Request, Response, NextFunction } from "express";

import mailService from "../services/mail-service.js";

import { ApiError } from "../../shared/exceptions/api-error.js";
import {
  isAllowedLink,
  isValidEmail,
} from "../../shared/validate-mail-request.js";

const parseMailRequest = (req: Request) => {
  const { email, link } = req.body ?? {};

  if (!isValidEmail(email)) throw ApiError.BadRequest("Invalid email");
  if (!isAllowedLink(link)) throw ApiError.BadRequest("Invalid link");

  return { email, link };
};

class MailController {
  sendActivationMail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, link } = parseMailRequest(req);

      await mailService.sendActivationMail(email, link);
      res.status(200).json({ message: "Activation email sent" });
    } catch (error) {
      if (error instanceof ApiError) return next(error);

      console.error("Failed to send activation email:", error);
      next(ApiError.ServiceUnavailable("Failed to send activation email"));
    }
  };

  sendResetPasswordMail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, link } = parseMailRequest(req);

      await mailService.sendPasswordResetMail(email, link);
      res.status(200).json({ message: "Reset password email sent" });
    } catch (error) {
      if (error instanceof ApiError) return next(error);

      console.error("Failed to send password reset email:", error);
      next(ApiError.ServiceUnavailable("Failed to send password reset email"));
    }
  };
}

export { MailController };
