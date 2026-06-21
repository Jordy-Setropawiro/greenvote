// ------------------------------
// GreenVote Backend (Node.js)
// ------------------------------

const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = "votes.json";
const INITIAL_VOTES = [0, 0, 0, 0, 0, 0];

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_VOTES, null, 2));
}

app.get("/api/votes", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Kon stemmen niet lezen." });
  }
});

app.post("/api/vote", (req, res) => {
  const index = Number(req.body.index);
  try {
    const votes = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    if (Number.isInteger(index) && index >= 0 && index < votes.length) {
      votes[index] += 1;
      fs.writeFileSync(DATA_FILE, JSON.stringify(votes, null, 2));
      return res.json({ success: true, votes });
    }
    res.status(400).json({ success: false, error: "Ongeldige stemindex." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Kon stem niet opslaan." });
  }
});

// Admin: reset votes to initial values
app.post("/api/reset", (req, res) => {
  const ADMIN = process.env.ADMIN_TOKEN;
  if (!ADMIN) {
    // If no ADMIN_TOKEN configured, allow reset only from localhost (development convenience)
    const remote = req.ip || req.connection.remoteAddress || '';
    const isLocal = remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1';
    if (!isLocal) {
      return res.status(500).json({ error: 'ADMIN_TOKEN not configured on server.' });
    }
  }

  const token = req.headers['x-admin-token'] || req.body?.token || '';
  if (token !== ADMIN) {
    return res.status(403).json({ error: 'Forbidden - invalid admin token.' });
  }

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_VOTES, null, 2));
    return res.json({ success: true, votes: INITIAL_VOTES });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Kon stemmen niet resetten." });
  }
});

const EXPIRY_DATE = new Date(2033, 11, 31); // 31 December 2033

app.get("/api/status", (req, res) => {
  const now = new Date();
  if (now > EXPIRY_DATE) {
    return res.json({ expired: true, message: "Stemperiode is verlopen." });
  }
  res.json({ expired: false, expiryDate: EXPIRY_DATE });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GreenVote backend draait op http://localhost:${PORT}`);
  console.log(`Stemmen opgeslagen tot 31 december 2033.`);
});