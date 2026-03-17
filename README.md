# Api SMTP service

Separate service for sending activation emails for Qustanizer and Pixel Place

## Features

- 🔐 Sending activation and confirmation emails via nodemailer

---

## Tech Stack

- **Runtime:** Node.js 22
- **Framework:** Express 5
- **Language:** TypeScript
- **Mailing:** Nodemailer
- **Tooling:** ESLint, Prettier, Husky, lint-staged

📐 **Architecture**: Pixel Place API ↔ Pixel Place SMTP API

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sp1r1tual/mail-api.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```dotenv
PORT=10000

# URLs of the services that are allowed to use this mail API
(configure for different ports if you plan to run two services at the same time)
API_URL_1=http://localhost:5000
API_URL_2=http://localhost:5000

# Gmail SMTP credentials
# Use an App Password, not your regular Gmail password
# Generate one at: https://myaccount.google.com/apppasswords
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

> **Note:** Gmail requires an [App Password](https://myaccount.google.com/apppasswords) — enable 2FA on your Google account first, then generate an app password specifically for this service.

### 4. Start the service

```bash
npm run dev
```

The mail service will be available at `http://localhost:10000`.

---

## License

Currently, this project does not include a formal license. All rights are reserved by the author.

If you plan to use, modify, or distribute this project, please contact the author for permission.
