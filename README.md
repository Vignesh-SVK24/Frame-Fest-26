# FRAME FEST ’26 — Official Event Registration Platform

A fast, cinematic, and responsive event registration platform for **FRAME FEST ’26** (A Film & Editing Fest organized by the Department of Artificial Intelligence & Machine Learning, HICET).

---

## 🎬 Features

- **Cinematic Aesthetic**: Black background (`#080808`), white bold typography, vivid red highlights (`#e50914`), film strip borders, and clapperboard motifs.
- **Complete Participant Registration**:
  - Full Name
  - Register Number
  - Department & Section dropdowns
  - 10-Digit Indian Mobile Number validation
  - Email format validation
  - Configurable payment QR code
  - Payment proof screenshot upload (PNG, JPG, JPEG <= 5MB) with image preview & remove/change options.
- **Duplicate Prevention**: Rejects duplicate register numbers with:
  > *"This register number is already registered for Frame Fest ’26."*
- **Review Step**: Verify details before final submission.
- **Success Screen & Receipt**:
  - Generates unique ID format (e.g. `FF26-0001`).
  - Celebratory confetti feedback.
  - One-click **Download Receipt / Print Pass**.
- **Organizer Admin Console (`/admin`)**:
  - Protected with passkey (`admin2026`).
  - Real-time registration metrics (Total, Pending, Verified, Rejected).
  - Search by Name, Register Number, or Registration ID.
  - Filter by Department, Section, and Status.
  - Inspect participant payment screenshots.
  - Update status (`PENDING`, `VERIFIED`, `REJECTED`).
  - **Export CSV** download.

---

## 🚀 Running the Project

### 1. Backend Server
```bash
cd backend
npm install
node server.js
```
*Runs on `http://localhost:5001`*

### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
*Runs on `http://localhost:5173`*

---

## ⚙️ Configuration

All event information, college details, payment QR code, and department options are centrally managed in:
[`frontend/src/config/eventConfig.js`](file:///C:/Users/selva/.gemini/antigravity/scratch/frame-fest-26/frontend/src/config/eventConfig.js)

---

## 🧪 Automated Testing
Run the complete E2E test suite:
```bash
npm test
```
