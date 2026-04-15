import express from "express";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 健康檢查
app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.get("/auth/callback", (req, res) => {
  const code = req.query.code;
  res.status(200).send(code ? `OAuth code received: ${code}` : "OAuth callback OK");
});

// 使用者解除授權你的 App 時，Meta 會打這支
app.post("/meta/uninstall", (req, res) => {
  console.log("Uninstall callback received");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  // TODO:
  // 1. 解析 signed_request / user identifier
  // 2. 刪掉該使用者 token / profile / cache / db 資料

  return res.sendStatus(200);
});

// 使用者要求刪除資料時，Meta 會打這支
app.post("/meta/delete", (req, res) => {
  console.log("Delete callback received");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  // 你可以用隨機碼當刪除確認碼
  const confirmationCode = crypto.randomUUID();

  // TODO:
  // 1. 解析 signed_request / user identifier
  // 2. 刪除該使用者所有資料

  return res.status(200).json({
    url: `${process.env.PUBLIC_BASE_URL || ""}/meta/delete/status?id=${confirmationCode}`,
    confirmation_code: confirmationCode
  });
});

// 提供一個查詢刪除狀態頁
app.get("/meta/delete/status", (req, res) => {
  const id = req.query.id || "unknown";
  res.status(200).send(`
    <html>
      <body style="font-family: sans-serif; padding: 24px;">
        <h1>Data deletion request received</h1>
        <p>Confirmation code: <strong>${id}</strong></p>
        <p>Your request has been recorded and processed.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
