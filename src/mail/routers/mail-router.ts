import { Router } from "express";

import { MailController } from "../controllers/mail-controller.js";

import { requireMailSecret } from "../../shared/require-mail-secret.js";

const mailRouter = Router();
const mailController = new MailController();

mailRouter.post(
  "/activation",
  requireMailSecret,
  mailController.sendActivationMail,
);
mailRouter.post(
  "/reset",
  requireMailSecret,
  mailController.sendResetPasswordMail,
);

export { mailRouter };
