import express from "express";
import crypto from "crypto";

const app = express();
const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.get("/auth/callback", (req, res) => {
  const code = req.query.code;
  res.status(200).send(code ? `OAuth code received: ${code}` : "OAuth callback OK");
});

app.post("/meta/uninstall", (req, res) => {
  console.log("Uninstall callback received");
  console.log(req.body);
  res.sendStatus(200);
});

app.post("/meta/delete", (req, res) => {
  console.log("Delete callback received");
  console.log(req.body);

  const confirmationCode = crypto.randomUUID();
  const baseUrl =
    process.env.PUBLIC_BASE_URL ||
    `https://${process.env.RAILWAY_PUBLIC_DOMAIN || ""}`;

  res.status(200).json({
    url: `${baseUrl}/meta/delete/status?id=${confirmationCode}`,
    confirmation_code: confirmationCode
  });
});

app.get("/meta/delete/status", (req, res) => {
  const id = req.query.id || "unknown";
  res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; padding: 24px;">
        <h1>Data deletion request received</h1>
        <p>Confirmation code: <strong>${id}</strong></p>
      </body>
    </html>
  `);
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
