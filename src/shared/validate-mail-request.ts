const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;

const isValidEmail = (email: unknown): email is string =>
  typeof email === "string" &&
  email.length <= MAX_EMAIL_LENGTH &&
  EMAIL_PATTERN.test(email);

const getAllowedOrigins = (): string[] =>
  (process.env.ALLOWED_LINK_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isAllowedLink = (link: unknown): link is string => {
  if (typeof link !== "string") return false;

  try {
    return getAllowedOrigins().includes(new URL(link).origin);
  } catch {
    return false;
  }
};

export { isValidEmail, isAllowedLink };
