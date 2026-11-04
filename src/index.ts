import "dotenv/config";
import http from "http";

import { app } from "./app.js";

const PORT = process.env.PORT || 5000;

for (const name of ["MAIL_API_SECRET", "ALLOWED_LINK_ORIGINS"]) {
  if (!process.env[name]) {
    console.error(`${name} is not set. Refusing to start.`);
    process.exit(1);
  }
}

http.createServer(app).listen(PORT, () => {
  console.log(`Server started on PORT: ${PORT}`);
});
