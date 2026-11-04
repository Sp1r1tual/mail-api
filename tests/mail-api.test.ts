import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

vi.mock("../src/mail/services/mail-service.js", () => ({
  default: {
    sendActivationMail: vi.fn().mockResolvedValue(undefined),
    sendPasswordResetMail: vi.fn().mockResolvedValue(undefined),
  },
}));

import mailService from "../src/mail/services/mail-service.js";
import { activationMailTemplate } from "../src/mail/views/activation-mail.js";
import { resetPasswordMailTemplate } from "../src/mail/views/reset-password-mail.js";
import { app } from "../src/app.js";

const SECRET = "test-secret";
const validBody = {
  email: "user@example.com",
  link: "https://api.example.com/activate/abc",
};

describe("mail api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.MAIL_API_SECRET = SECRET;
    process.env.ALLOWED_LINK_ORIGINS =
      "https://api.example.com, https://app.example.com";
  });

  it("rejects requests without the secret", async () => {
    await request(app).post("/activation").send(validBody).expect(401);
    expect(mailService.sendActivationMail).not.toHaveBeenCalled();
  });

  it("rejects requests with a wrong secret", async () => {
    await request(app)
      .post("/reset")
      .set("x-mail-secret", "wrong")
      .send(validBody)
      .expect(401);
    expect(mailService.sendPasswordResetMail).not.toHaveBeenCalled();
  });

  it("fails closed when the secret is not configured", async () => {
    delete process.env.MAIL_API_SECRET;

    await request(app)
      .post("/activation")
      .set("x-mail-secret", "")
      .send(validBody)
      .expect(503);
  });

  it("sends mail with a valid secret and link", async () => {
    await request(app)
      .post("/activation")
      .set("x-mail-secret", SECRET)
      .send(validBody)
      .expect(200);

    expect(mailService.sendActivationMail).toHaveBeenCalledWith(
      validBody.email,
      validBody.link,
    );
  });

  it.each([
    "https://evil.example.net/phish",
    "https://api.example.com.evil.net/x",
    "javascript:alert(1)",
    "not a url",
  ])("rejects a link outside the allowed origins: %s", async (link) => {
    await request(app)
      .post("/activation")
      .set("x-mail-secret", SECRET)
      .send({ ...validBody, link })
      .expect(400);
    expect(mailService.sendActivationMail).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    await request(app)
      .post("/reset")
      .set("x-mail-secret", SECRET)
      .send({ ...validBody, email: "a@b.c\r\nBcc: x@y.z" })
      .expect(400);
  });

  it("returns 503 when sending fails", async () => {
    vi.mocked(mailService.sendActivationMail).mockRejectedValueOnce(
      new Error("smtp down"),
    );

    await request(app)
      .post("/activation")
      .set("x-mail-secret", SECRET)
      .send(validBody)
      .expect(503);
  });
});

describe("mail templates", () => {
  const link = `https://app.example.com/x?a=1&b="><script>alert(1)</script>`;

  it.each([
    ["activation", activationMailTemplate],
    ["reset", resetPasswordMailTemplate],
  ])("escapes the link in the %s template", (_, template) => {
    const html = template(link);

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
