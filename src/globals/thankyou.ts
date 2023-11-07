export const thankyoupage = ({ redirectUrl, browserUrl, logoUrl }) => {
  return `<html>
    <head>
      <meta
        http-equiv="refresh"
        content="0; URL=${escapeHtml(redirectUrl)}"
      />
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          background-color: #f0f0f0;
        }
        main {
          border: 1px solid lightgray;
          background-color: white;
          width: 40%;
          margin: auto;
          margin-top: 100px;
          padding: 100px 10px;
        }
      </style>
    </head>
    <body>
      <main>
        <img
          src="${escapeHtml(logoUrl)}"
          alt="WorkHub logo"
          width="170"
        />
        <h1>Redirecting to WorkBot Slack App</h1>
        <p>
          Not Working?
          <a href="${escapeHtml(redirectUrl)}">Try Again</a
          >.</p>
          <p>Or, you can
          <a href="${escapeHtml(browserUrl)}" target="_blank"
            >open Slack in your browser</a
          >.</p>
        </p>
      </main>
    </body>
  </html>
  `;
};

function escapeHtml(input: string | undefined | null): string {
  if (input) {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  return '';
}
