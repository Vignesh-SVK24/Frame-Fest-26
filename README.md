# FRAME FEST ’26 — Official Event Registration Platform

A fast, cinematic, and responsive event registration platform for **FRAME FEST ’26** (A Film & Editing Fest organized by the Department of Artificial Intelligence & Machine Learning, HICET — Hindusthan College of Engineering and Technology).

🌐 **Live Website**: [https://vignesh-svk24.github.io/Frame-Fest-26/](https://vignesh-svk24.github.io/Frame-Fest-26/)

---

## 🎥 Background Video & Media Assets

The platform features an ultra-cinematic looping background video with ambient dark overlays, subtle red lighting, and atmospheric fest music:

- 🎬 **Hero Background Video**: [`public/video/framefest-video-2.mp4`](./public/video/framefest-video-2.mp4) (Also available at [`public/video/framefest video 2.mp4`](./public/video/framefest%20video%202.mp4))
- 🎵 **Fest Soundtrack**: [`public/audio/frame fest music.mp3.mpeg`](./public/audio/frame%20fest%20music.mp3.mpeg) with floating interactive volume/mute controller
- 💬 **WhatsApp Community QR**: [`public/whatsapp-qr.jpg`](./public/whatsapp-qr.jpg) for instant participant group access

---

## 🏆 Fest Highlights: Why Join Frame Fest ’26?

- **Top 5 Winners Induction**: The Top 5 winners will earn a coveted place in the official **HICET VIRTUAL VANGUARDS** Digital Media Team!
- **Participant Pass Generation**: Instant digital pass with custom barcode, participant verification details, and single-page **PDF & PNG download** options.
- **17 Engineering Departments**: Tailored registration for AI & ML, Cyber Security, Computer Science, IT, ECE, EEE, Mechanical, Aeronautical, and more.

---

## 🎬 Core Features

- **Cinematic Aesthetic**: Black background (`#080808`), white bold typography, vivid red highlights (`#e50914`), film strip borders, and video background.
- **Participant Registration**:
  - Full Name
  - Register Number
  - 17 Branch Department & Section selection
  - 10-Digit Mobile validation & Email validation
  - Official WhatsApp participant community integration
- **Duplicate Prevention**: Immediate detection of duplicate register numbers.
- **Success Screen & Pass Download**:
  - Generates unique ID format (e.g. `FF26-0001`).
  - Single-page **PDF Ticket Pass** download.
  - High-res **PNG Ticket Pass** download.
- **Organizer Admin Console (`/#admin`)**:
  - Protected with passkey (`admin2026`).
  - Real-time registration statistics (Total, Confirmed, Pending, Cancelled).
  - Search by Name, Register Number, or Registration ID.
  - Filter by Department, Section, and Status.
  - **Export CSV** download.

---

## 🚀 Running the Project Locally

### 1. Unified Full-Stack Run
```bash
# Install all dependencies and build
npm run build

# Start the full-stack server
npm start
```
*Accessible on `http://localhost:5001`*

### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
*Accessible on `http://localhost:5173`*

---

## 🌐 Deployments

- **GitHub Pages**: [https://vignesh-svk24.github.io/Frame-Fest-26/](https://vignesh-svk24.github.io/Frame-Fest-26/)
- **Render Dynamic Cloud (Optional)**: Connect repository to [render.com](https://render.com) using the included `render.yaml`.
