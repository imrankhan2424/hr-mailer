const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());

// ── Uploads directory ─────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
app.use('/uploads', express.static(UPLOADS_DIR));

// ── Multer config for resume uploads ──────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.txt', '.rtf'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// ── Runtime config (set via UI — no .env fallback) ────────────
let runtimeConfig = {
  gmailUser:   '',
  gmailPass:   '',
  senderName:  'Job Applicant',
};

// ── Data files ────────────────────────────────────────────────
const PROFILES_FILE = path.join(__dirname, 'profiles.json');
const HRLIST_FILE   = path.join(__dirname, 'hrlist.json');

function loadJSON(filepath) {
  try { return JSON.parse(fs.readFileSync(filepath, 'utf8')); }
  catch(e) { return []; }
}
function saveJSON(filepath, data) {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// ── Build transporter from current config ─────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: runtimeConfig.gmailUser, pass: runtimeConfig.gmailPass }
  });
}

// ── Health check ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'HR Mailer backend is running ✓' });
});

// ── Set Gmail config from UI ───────────────────────────────────
app.post('/config', (req, res) => {
  const { gmailUser, gmailPass, senderName } = req.body;
  if (gmailUser) runtimeConfig.gmailUser = gmailUser;
  if (gmailPass) runtimeConfig.gmailPass = gmailPass;
  if (senderName) runtimeConfig.senderName = senderName;
  console.log(`✓ Config updated — sending as: ${runtimeConfig.gmailUser}`);
  res.json({ status: 'ok' });
});

// ── Send email (with optional attachment) ─────────────────────
app.post('/send', async (req, res) => {
  const { to, subject, body, attachmentPath } = req.body;
  if (!to || !subject || !body)
    return res.status(400).json({ status: 'error', message: 'Missing to, subject, or body' });
  if (!runtimeConfig.gmailUser || !runtimeConfig.gmailPass)
    return res.status(400).json({ status: 'error', message: 'Gmail credentials not configured — set them in Setup' });

  try {
    const mailOptions = {
      from: `"${runtimeConfig.senderName}" <${runtimeConfig.gmailUser}>`,
      to, subject, text: body
    };
    // Attach resume if provided
    if (attachmentPath) {
      const fullPath = path.join(UPLOADS_DIR, path.basename(attachmentPath));
      if (fs.existsSync(fullPath)) {
        mailOptions.attachments = [{ path: fullPath }];
      }
    }
    await getTransporter().sendMail(mailOptions);
    console.log(`✓ Email sent to ${to}`);
    res.json({ status: 'sent' });
  } catch(err) {
    console.error(`✗ Failed to send to ${to}:`, err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── Resume Upload ─────────────────────────────────────────────
app.post('/upload-resume', upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).json({ status: 'error', message: 'No file uploaded or invalid type' });
  console.log(`✓ Resume uploaded: ${req.file.filename}`);
  res.json({
    status: 'ok',
    filename: req.file.originalname,
    storedName: req.file.filename,
    size: req.file.size
  });
});

// ── HR List CRUD ──────────────────────────────────────────────
app.get('/hrlist', (req, res) => {
  res.json(loadJSON(HRLIST_FILE));
});

app.post('/hrlist', (req, res) => {
  const newList = req.body;
  if (!newList || !newList.id) return res.status(400).json({ status: 'error', message: 'Invalid HR list' });
  const allLists = loadJSON(HRLIST_FILE);
  const existing = allLists.findIndex(l => l.id === newList.id);
  if (existing >= 0) allLists[existing] = newList;
  else allLists.push(newList);
  saveJSON(HRLIST_FILE, allLists);
  console.log(`✓ HR list saved: ${newList.name} (${newList.contacts.length} contacts)`);
  res.json({ status: 'ok' });
});

app.delete('/hrlist/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const allLists = loadJSON(HRLIST_FILE).filter(l => l.id !== id);
  saveJSON(HRLIST_FILE, allLists);
  res.json({ status: 'ok' });
});

// ── Profiles CRUD ─────────────────────────────────────────────
app.get('/profiles', (req, res) => {
  res.json(loadJSON(PROFILES_FILE));
});

app.post('/profiles', (req, res) => {
  const profile = req.body;
  if (!profile || !profile.id) return res.status(400).json({ status: 'error', message: 'Invalid profile' });
  const list = loadJSON(PROFILES_FILE);
  const existing = list.findIndex(p => p.id === profile.id);
  if (existing >= 0) list[existing] = profile;
  else list.push(profile);
  saveJSON(PROFILES_FILE, list);
  console.log(`✓ Profile saved: ${profile.name}`);
  res.json({ status: 'ok' });
});

app.delete('/profiles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const list = loadJSON(PROFILES_FILE).filter(p => p.id !== id);
  saveJSON(PROFILES_FILE, list);
  res.json({ status: 'ok' });
});

// ── Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ HR Mailer backend running on http://localhost:${PORT}`);
  console.log(`  Gmail credentials not set — configure in the UI Setup tab`);
});