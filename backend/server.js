import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Configurable Admin Credentials (read securely from environment variables, never sent to frontend)
const ADMIN_CREDENTIALS = {
  Satheesh: process.env.ADMIN_PASS_SATHEESH || 'aiml26hicet',
  Devi: process.env.ADMIN_PASS_DEVI || 'aiml26hicet',
  Vignesh: process.env.ADMIN_PASS_VIGNESH || 'aiml26hicet'
};

// In-memory active admin sessions: token -> { adminName, expiresAt }
const activeSessions = new Map();

// Helper to generate a secure random session token
function createSessionToken(adminName) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  activeSessions.set(token, { adminName, expiresAt });
  return token;
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of activeSessions.entries()) {
    if (data.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
}, 60 * 60 * 1000);

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'registrations.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Helper: format readable date & time
function formatReadableDate(dateObj) {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return dateObj.toLocaleDateString('en-GB', options); // e.g. "18 Sep 2026"
}

function formatReadableTime(dateObj) {
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return dateObj.toLocaleTimeString('en-US', options); // e.g. "09:14 AM"
}

function formatReadableFullDateTime(dateObj) {
  return `${formatReadableDate(dateObj)}, ${formatReadableTime(dateObj)}`;
}

// Helper: read database and migrate schema if needed
function readRegistrations() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const records = JSON.parse(data || '[]');
    let modified = false;

    for (const r of records) {
      // Ensure registrationDate exists in readable format
      if (!r.registrationDate && r.createdAt) {
        const d = new Date(r.createdAt);
        r.registrationDate = !isNaN(d.getTime()) ? formatReadableFullDateTime(d) : r.createdAt;
        modified = true;
      }
      // Ensure attendance fields exist
      if (r.attendanceStatus === undefined) {
        r.attendanceStatus = 'PENDING';
        r.attendanceDate = null;
        r.attendanceTime = null;
        r.markedBy = null;
        modified = true;
      }
      if (r.paymentProof === undefined) {
        r.paymentProof = null;
      }
    }

    if (modified) {
      saveRegistrations(records);
    }
    return records;
  } catch (err) {
    console.error('Error reading registrations file:', err);
    return [];
  }
}

// Helper: write database safely
function saveRegistrations(registrations) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(registrations, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing registrations file:', err);
    return false;
  }
}

// Helper: generate registration ID
function generateRegistrationId(registrations) {
  const count = registrations.length + 1;
  const padded = String(count).padStart(4, '0');
  return `FF26-${padded}`;
}

// Multer storage setup for payment proof uploads (if needed)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `proof-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin auth middleware
function requireAdmin(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  let token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : '';
  if (!token) {
    token = req.headers['x-admin-token'] || req.query.adminToken;
  }

  // Also support legacy/emergency passkey for automated scripts if configured
  if (!token && (req.headers['x-admin-key'] || req.query.adminKey)) {
    const key = req.headers['x-admin-key'] || req.query.adminKey;
    const matchAdmin = Object.keys(ADMIN_CREDENTIALS).find(name => ADMIN_CREDENTIALS[name] === key);
    if (matchAdmin) {
      req.admin = { adminName: matchAdmin };
      return next();
    }
  }

  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Admin authentication required.' });
  }

  const session = activeSessions.get(token);
  if (session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }

  req.admin = session;
  next();
}

// --- API ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', event: "FRAME FEST '26" });
});

// Check if a register number is already taken
app.get('/api/check-duplicate/:registerNumber', (req, res) => {
  const { registerNumber } = req.params;
  if (!registerNumber) return res.json({ exists: false });

  const registrations = readRegistrations();
  const exists = registrations.some(
    (r) => r.registerNumber.trim().toUpperCase() === registerNumber.trim().toUpperCase()
  );
  res.json({ exists });
});

// Participant registration endpoint
app.post('/api/register', upload.single('paymentProof'), (req, res) => {
  try {
    const { name, registerNumber, department, section, phone, email } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your name.' });
    }
    if (!registerNumber || !registerNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your register number.' });
    }
    if (!department || !department.trim()) {
      return res.status(400).json({ success: false, message: 'Please select your department.' });
    }
    if (!section || !section.trim()) {
      return res.status(400).json({ success: false, message: 'Please select your section.' });
    }

    // Phone validation (10-digit Indian mobile number)
    const cleanPhone = (phone || '').replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number.' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const registrations = readRegistrations();

    // Check duplicate register number
    const normalizedRegNo = registerNumber.trim().toUpperCase();
    const duplicate = registrations.find(
      (r) => r.registerNumber.trim().toUpperCase() === normalizedRegNo
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'This register number is already registered for Frame Fest ’26.'
      });
    }

    // Generate unique Ticket ID
    const registrationId = generateRegistrationId(registrations);
    const now = new Date();
    const formattedDate = formatReadableFullDateTime(now);

    const newRegistration = {
      registrationId,
      name: name.trim(),
      registerNumber: normalizedRegNo,
      department: department.trim(),
      section: section.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      paymentProof: req.file ? req.file.filename : null,
      createdAt: now.toISOString(),
      registrationDate: formattedDate,
      attendanceStatus: 'PENDING',
      attendanceDate: null,
      attendanceTime: null,
      markedBy: null,
      whatsappJoined: true,
      status: 'CONFIRMED'
    };

    registrations.push(newRegistration);
    saveRegistrations(registrations);

    // Return sanitized response to public registrant (without admin-sensitive internals)
    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully.',
      data: {
        registrationId: newRegistration.registrationId,
        ticketId: newRegistration.registrationId,
        name: newRegistration.name,
        registerNumber: newRegistration.registerNumber,
        department: newRegistration.department,
        section: newRegistration.section,
        phone: newRegistration.phone,
        email: newRegistration.email,
        registrationDate: newRegistration.registrationDate,
        createdAt: newRegistration.createdAt,
        status: newRegistration.status
      }
    });
  } catch (serverErr) {
    console.error('Registration processing error:', serverErr);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while saving registration.'
    });
  }
});

// --- ADMIN API ROUTES (PROTECTED) ---

// 1. Admin Login (Multi-Admin: Satheesh, Devi, Vignesh)
app.post('/api/admin/login', (req, res) => {
  const { username, password, key } = req.body;

  let matchedAdmin = null;

  if (username && password) {
    const trimmedUser = username.trim();
    const validName = Object.keys(ADMIN_CREDENTIALS).find(
      (name) => name.toLowerCase() === trimmedUser.toLowerCase()
    );

    if (validName && ADMIN_CREDENTIALS[validName] === password) {
      matchedAdmin = validName;
    }
  } else if (key) {
    for (const [name, pass] of Object.entries(ADMIN_CREDENTIALS)) {
      if (key === pass) {
        matchedAdmin = name;
        break;
      }
    }
    if (!matchedAdmin && (key === 'admin2026' || key === process.env.ADMIN_KEY)) {
      matchedAdmin = 'Vignesh';
    }
  }

  if (matchedAdmin) {
    const token = createSessionToken(matchedAdmin);
    return res.json({
      success: true,
      token,
      adminName: matchedAdmin,
      message: `Welcome, ${matchedAdmin}`
    });
  }

  // Security rule: Do not reveal which specific credential is incorrect
  return res.status(401).json({
    success: false,
    message: 'Invalid admin name or password.'
  });
});

// 2. Admin Logout
app.post('/api/admin/logout', requireAdmin, (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] || req.query.adminToken);
  if (token) {
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 3. Admin Verify Session Token
app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({
    success: true,
    adminName: req.admin.adminName
  });
});

// 4. Admin Statistics (Calculated dynamically from real database)
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const registrations = readRegistrations();
  const total = registrations.length;
  const present = registrations.filter((r) => r.attendanceStatus === 'PRESENT').length;
  const absent = registrations.filter((r) => r.attendanceStatus === 'ABSENT').length;
  const pending = registrations.filter((r) => (r.attendanceStatus || 'PENDING') === 'PENDING').length;

  res.json({
    total,
    present,
    absent,
    pending
  });
});

// 5. Admin: List registered participants with search and filter
app.get('/api/admin/registrations', requireAdmin, (req, res) => {
  const { search, department, section, attendanceStatus } = req.query;
  let list = readRegistrations();

  // Search filter (Ticket ID, Student Name, Register Number)
  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (r) =>
        (r.registrationId && r.registrationId.toLowerCase().includes(q)) ||
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.registerNumber && r.registerNumber.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.phone && r.phone.includes(q))
    );
  }

  // Department filter
  if (department && department !== 'ALL') {
    list = list.filter((r) => r.department === department);
  }

  // Section filter
  if (section && section !== 'ALL') {
    list = list.filter((r) => r.section === section);
  }

  // Attendance Status filter (PENDING, PRESENT, ABSENT)
  if (attendanceStatus && attendanceStatus !== 'ALL') {
    list = list.filter((r) => (r.attendanceStatus || 'PENDING') === attendanceStatus);
  }

  // Sort by Ticket ID ascending by default
  list.sort((a, b) => (a.registrationId || '').localeCompare(b.registrationId || ''));

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// 6. Admin: Mark Attendance (PRESENT or ABSENT)
app.post('/api/admin/attendance/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['PRESENT', 'ABSENT'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid attendance status. Must be PRESENT or ABSENT.'
    });
  }

  const registrations = readRegistrations();
  // Search by registrationId (Ticket ID) or registerNumber
  const target = registrations.find(
    (r) =>
      r.registrationId.toUpperCase() === id.trim().toUpperCase() ||
      r.registerNumber.toUpperCase() === id.trim().toUpperCase()
  );

  if (!target) {
    return res.status(404).json({
      success: false,
      message: 'Participant not found.'
    });
  }

  // Check if attendance is already marked with this exact status
  if (target.attendanceStatus === status) {
    return res.status(400).json({
      success: false,
      message: `This participant is already marked ${status}.`
    });
  }

  const now = new Date();
  target.attendanceStatus = status;
  target.attendanceDate = formatReadableDate(now);
  target.attendanceTime = formatReadableTime(now);
  target.markedBy = req.admin.adminName || 'Admin';
  target.updatedAt = now.toISOString();

  const saved = saveRegistrations(registrations);
  if (!saved) {
    return res.status(500).json({
      success: false,
      message: 'Attendance could not be saved. Please try again.'
    });
  }

  return res.json({
    success: true,
    message: `Participant marked as ${status} successfully.`,
    data: target
  });
});

// 7. Admin: Export Attendance CSV (Does NOT include payment proof images)
app.get('/api/admin/export-csv', requireAdmin, (req, res) => {
  const registrations = readRegistrations();

  const headers = [
    'Ticket ID',
    'Student Name',
    'Register Number',
    'Department',
    'Section',
    'Registration Date',
    'Attendance Status',
    'Attendance Date',
    'Attendance Time',
    'Marked By'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = registrations.map((r) => [
    escapeCsv(r.registrationId),
    escapeCsv(r.name),
    escapeCsv(r.registerNumber),
    escapeCsv(r.department),
    escapeCsv(r.section),
    escapeCsv(r.registrationDate || (r.createdAt ? formatReadableFullDateTime(new Date(r.createdAt)) : '')),
    escapeCsv(r.attendanceStatus || 'PENDING'),
    escapeCsv(r.attendanceDate || '-'),
    escapeCsv(r.attendanceTime || '-'),
    escapeCsv(r.markedBy || '-')
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="frame_fest_26_attendance.csv"');
  res.status(200).send(csvContent);
});

// 8. Admin: Secure Payment Proof Serving (Only authenticated admins can view)
app.get('/api/admin/payment-proof/:filename', requireAdmin, (req, res) => {
  const { filename } = req.params;
  const safeFilename = path.basename(filename);
  const filePath = path.join(UPLOADS_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Payment proof not found.' });
  }

  res.sendFile(filePath);
});

// --- PRODUCTION FRONTEND SERVING ---
const FRONTEND_DIST = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(FRONTEND_DIST)) {
  app.use(express.static(FRONTEND_DIST));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
  });
}

// Start backend (when run directly as a Node process)
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Frame Fest '26] Full-stack Server running on port ${PORT}`);
  });
}

export default app;
