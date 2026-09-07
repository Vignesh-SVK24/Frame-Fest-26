import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin2026';

// Paths
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'registrations.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// Helper: read database
function readRegistrations() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data || '[]');
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin auth middleware
function requireAdmin(req, res, next) {
  const clientKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (!clientKey || clientKey !== ADMIN_KEY) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid admin credentials' });
  }
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

// Participant registration endpoint (Free registration + WhatsApp group)
app.post('/api/register', (req, res) => {
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

    // Generate unique registration ID
    const registrationId = generateRegistrationId(registrations);

    const newRegistration = {
      registrationId,
      name: name.trim(),
      registerNumber: normalizedRegNo,
      department: department.trim(),
      section: section.trim(),
      phone: cleanPhone,
      email: email.trim().toLowerCase(),
      whatsappJoined: true,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    registrations.push(newRegistration);
    saveRegistrations(registrations);

    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully.',
      data: {
        registrationId: newRegistration.registrationId,
        name: newRegistration.name,
        registerNumber: newRegistration.registerNumber,
        department: newRegistration.department,
        section: newRegistration.section,
        phone: newRegistration.phone,
        email: newRegistration.email,
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

// Admin: verify login key
app.post('/api/admin/login', (req, res) => {
  const { key } = req.body;
  if (key === ADMIN_KEY) {
    return res.json({ success: true, token: ADMIN_KEY });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin passkey' });
});

// Admin: get statistics
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const registrations = readRegistrations();
  const total = registrations.length;
  const confirmed = registrations.filter((r) => r.status === 'CONFIRMED' || r.status === 'VERIFIED').length;
  const pending = registrations.filter((r) => r.status === 'PENDING').length;
  const cancelled = registrations.filter((r) => r.status === 'CANCELLED' || r.status === 'REJECTED').length;

  res.json({
    total,
    confirmed,
    pending,
    cancelled
  });
});

// Admin: get all registrations with search and filter
app.get('/api/admin/registrations', requireAdmin, (req, res) => {
  const { search, department, section, status } = req.query;
  let list = readRegistrations();

  // Search filter
  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.registerNumber.toLowerCase().includes(q) ||
        r.registrationId.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.phone.includes(q)
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

  // Status filter
  if (status && status !== 'ALL') {
    list = list.filter((r) => r.status === status);
  }

  // Return sorted by newest first
  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({ success: true, count: list.length, data: list });
});

// Admin: update registration status
app.patch('/api/admin/registrations/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['CONFIRMED', 'PENDING', 'CANCELLED', 'VERIFIED', 'REJECTED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status value.' });
  }

  const registrations = readRegistrations();
  const target = registrations.find((r) => r.registrationId === id);

  if (!target) {
    return res.status(404).json({ success: false, message: 'Registration record not found.' });
  }

  target.status = status;
  target.updatedAt = new Date().toISOString();
  saveRegistrations(registrations);

  res.json({ success: true, message: 'Status updated successfully.', data: target });
});

// Admin: CSV Export
app.get('/api/admin/export-csv', requireAdmin, (req, res) => {
  const registrations = readRegistrations();

  const headers = [
    'Registration ID',
    'Name',
    'Register Number',
    'Department',
    'Section',
    'Phone',
    'Email',
    'Status',
    'Registration Date'
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
    escapeCsv(r.phone),
    escapeCsv(r.email),
    escapeCsv(r.status),
    escapeCsv(new Date(r.createdAt).toLocaleString())
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="frame_fest_26_registrations.csv"');
  res.status(200).send(csvContent);
});

// Start backend
app.listen(PORT, () => {
  console.log(`[Frame Fest '26] Backend API running on http://localhost:${PORT}`);
});
