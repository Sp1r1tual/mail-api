import { escapeHtml } from "../../shared/escape-html.js";

const activationMailTemplate = (link: string) => {
  const safeLink = escapeHtml(link);

  return `
        <div>
            <h1>To activate your account, follow the link</h1>
            <a href="${safeLink}">${safeLink}</a>
        </div>
    `;
};

export { activationMailTemplate };
