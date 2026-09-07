import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Home, 
  UserPlus, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Image as ImageIcon 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function SuccessCard({ registrationData, onGoHome, onRegisterAnother }) {
  const [copiedId, setCopiedId] = useState(false);
  const [downloadingType, setDownloadingType] = useState(null);

  useEffect(() => {
    // Celebratory confetti
    try {
      confetti({
        particleCount: 70,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#e50914', '#ffffff', '#25D366', '#ff4d4d']
      });
    } catch (_) {}
  }, []);

  const handleCopyId = () => {
    if (registrationData?.registrationId) {
      navigator.clipboard.writeText(registrationData.registrationId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // 1. GENERATE & DOWNLOAD AS HIGH-RES IMAGE (PNG)
  const handleDownloadImage = () => {
    setDownloadingType('image');
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = 800;
      const height = 1100;
      canvas.width = width;
      canvas.height = height;

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      // Outer Red Border
      ctx.strokeStyle = '#e50914';
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, width - 48, height - 48);

      // Inner Dark Surface
      ctx.fillStyle = '#121212';
      ctx.fillRect(36, 36, width - 72, height - 72);

      // Header Banner
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(36, 36, width - 72, 170);

      // Top Red Stripe
      ctx.fillStyle = '#e50914';
      ctx.fillRect(36, 36, width - 72, 6);

      // College & Dept
      ctx.fillStyle = '#a0a0a0';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(EVENT_CONFIG.college.toUpperCase(), width / 2, 75);

      ctx.fillStyle = '#ffffff';
      ctx.font = '600 13px sans-serif';
      ctx.fillText(EVENT_CONFIG.department.toUpperCase(), width / 2, 100);

      // Main Event Title
      ctx.font = '900 48px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('FRAME FEST ', width / 2 - 40, 160);
      ctx.fillStyle = '#e50914';
      ctx.fillText('’26', width / 2 + 155, 160);

      // Subtitle
      ctx.fillStyle = '#d0d0d0';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('A FILM & EDITING FEST', width / 2, 188);

      // Perforated divider line
      ctx.strokeStyle = '#333333';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(40, 230);
      ctx.lineTo(width - 40, 230);
      ctx.stroke();
      ctx.setLineDash([]);

      // Registration ID Box
      ctx.fillStyle = '#090909';
      ctx.fillRect(80, 260, width - 160, 120);
      ctx.strokeStyle = '#e50914';
      ctx.lineWidth = 2;
      ctx.strokeRect(80, 260, width - 160, 120);

      ctx.fillStyle = '#888888';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('OFFICIAL REGISTRATION PASS ID', width / 2, 290);

      ctx.fillStyle = '#e50914';
      ctx.font = '900 46px monospace';
      ctx.fillText(registrationData?.registrationId || 'FF26-0001', width / 2, 345);

      // Participant Details Card
      ctx.fillStyle = '#161616';
      ctx.fillRect(80, 420, width - 160, 360);
      ctx.strokeStyle = '#262626';
      ctx.strokeRect(80, 420, width - 160, 360);

      const drawRow = (label, value, y) => {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#888888';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(label.toUpperCase(), 110, y);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(value || '-', width - 110, y);

        // Divider
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(110, y + 15);
        ctx.lineTo(width - 110, y + 15);
        ctx.stroke();
      };

      drawRow('Participant Name', registrationData?.name, 470);
      drawRow('Register Number', registrationData?.registerNumber, 530);
      drawRow('Department', registrationData?.department, 590);
      drawRow('Section', `Section ${registrationData?.section}`, 650);
      drawRow('Event Date', EVENT_CONFIG.date, 710);

      // Status Badge
      ctx.textAlign = 'center';
      ctx.fillStyle = '#059669';
      ctx.fillRect(width / 2 - 100, 810, 200, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('✓ CONFIRMED ENTRY', width / 2, 834);

      // Decorative Barcode Lines
      const barcodeY = 880;
      const barWidths = [3, 1, 4, 2, 1, 5, 2, 4, 1, 3, 2, 1, 4, 3, 2, 5, 1, 2, 4, 1, 3, 2, 4, 1, 5, 2, 3, 1, 4, 2];
      let startX = 140;
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < barWidths.length; i++) {
        ctx.fillRect(startX, barcodeY, barWidths[i] * 2, 50);
        startX += barWidths[i] * 2 + 10;
      }

      // Footer
      ctx.fillStyle = '#777777';
      ctx.font = '12px sans-serif';
      ctx.fillText('Present this pass at the HICET Campus registration desk on 18 September 2026.', width / 2, 970);
      ctx.fillText('© 2026 FRAME FEST ’26 • Department of Artificial Intelligence & Machine Learning', width / 2, 995);

      // Trigger download
      const link = document.createElement('a');
      link.download = `FrameFest26_Pass_${registrationData?.registrationId || 'Entry'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating image pass:', err);
      alert('Failed to generate image pass.');
    } finally {
      setDownloadingType(null);
    }
  };

  // 2. DOWNLOAD AS SINGLE-PAGE PDF PASS
  const handleDownloadPdf = () => {
    setDownloadingType('pdf');
    try {
      const printWin = window.open('', '_blank', 'width=800,height=950');
      if (!printWin) {
        alert('Please allow popups to download or print your single-page PDF pass.');
        setDownloadingType(null);
        return;
      }

      const receiptHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>FrameFest26_Pass_${registrationData?.registrationId || 'Ticket'}</title>
          <meta charset="utf-8" />
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              margin: 0;
              padding: 0;
              background-color: #ffffff;
              color: #111111;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              height: 100%;
              overflow: hidden;
            }
            .page-container {
              width: 100%;
              max-width: 680px;
              margin: 0 auto;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            .ticket-card {
              border: 3px solid #111111;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 14px rgba(0,0,0,0.06);
            }
            .ticket-top {
              background: #0d0d0d;
              color: #ffffff;
              padding: 24px 28px 18px 28px;
              text-align: center;
              border-bottom: 3px solid #e50914;
              position: relative;
            }
            .college-title {
              font-size: 13px;
              font-weight: 800;
              letter-spacing: 1.2px;
              text-transform: uppercase;
              color: #cccccc;
              margin-bottom: 2px;
            }
            .dept-title {
              font-size: 12px;
              font-weight: 600;
              color: #999999;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              margin-bottom: 12px;
            }
            .event-main-title {
              font-size: 38px;
              font-weight: 900;
              letter-spacing: 2px;
              line-height: 1;
              margin: 0;
              text-transform: uppercase;
            }
            .event-main-title span {
              color: #e50914;
            }
            .event-tagline {
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 2.5px;
              color: #e50914;
              text-transform: uppercase;
              margin-top: 6px;
            }
            .ticket-body {
              padding: 24px 28px;
              background: #ffffff;
            }
            .id-box {
              background: #fbfbfb;
              border: 2px solid #e50914;
              border-radius: 10px;
              padding: 14px;
              text-align: center;
              margin-bottom: 20px;
            }
            .id-label {
              font-size: 11px;
              font-weight: 800;
              letter-spacing: 1.5px;
              color: #666666;
              text-transform: uppercase;
            }
            .id-value {
              font-size: 34px;
              font-family: "Courier New", Courier, monospace;
              font-weight: 900;
              color: #e50914;
              letter-spacing: 3px;
              margin-top: 4px;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 18px;
            }
            .details-table tr {
              border-bottom: 1px solid #eeeeee;
            }
            .details-table td {
              padding: 9px 4px;
              font-size: 13.5px;
            }
            .details-table .label {
              font-weight: 700;
              color: #555555;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 0.8px;
              width: 38%;
            }
            .details-table .value {
              font-weight: 800;
              color: #111111;
            }
            .badge-confirmed {
              display: inline-block;
              background: #dcfce7;
              color: #15803d;
              border: 1px solid #86efac;
              font-size: 11px;
              font-weight: 900;
              padding: 3px 10px;
              border-radius: 20px;
              letter-spacing: 1px;
            }
            .barcode-strip {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 4px;
              height: 40px;
              margin: 16px 0 10px 0;
            }
            .barcode-bar {
              height: 100%;
              background: #111111;
            }
            .ticket-footer {
              background: #f9f9f9;
              border-top: 2px dashed #cccccc;
              padding: 16px 24px;
              text-align: center;
              font-size: 11px;
              color: #555555;
              line-height: 1.5;
            }
            .ticket-footer strong {
              color: #111111;
            }
            @media print {
              body {
                padding: 0;
              }
              .page-container {
                max-width: 100%;
              }
            }
          </style>
        </head>
        <body>
          <div class="page-container">
            <div class="ticket-card">
              
              <!-- Header Section -->
              <div class="ticket-top">
                <div class="college-title">${EVENT_CONFIG.college}</div>
                <div class="dept-title">${EVENT_CONFIG.department}</div>
                <h1 class="event-main-title">${EVENT_CONFIG.titlePrefix} <span>${EVENT_CONFIG.titleYear}</span></h1>
                <div class="event-tagline">${EVENT_CONFIG.subtitle} • OFFICIAL ENTRY PASS</div>
              </div>

              <!-- Pass Content -->
              <div class="ticket-body">
                
                <div class="id-box">
                  <div class="id-label">Official Participant Registration ID</div>
                  <div class="id-value">${registrationData?.registrationId || 'FF26-0001'}</div>
                </div>

                <table class="details-table">
                  <tr>
                    <td class="label">Participant Name</td>
                    <td class="value">${registrationData?.name || '-'}</td>
                  </tr>
                  <tr>
                    <td class="label">Register Number</td>
                    <td class="value">${registrationData?.registerNumber || '-'}</td>
                  </tr>
                  <tr>
                    <td class="label">Department</td>
                    <td class="value">${registrationData?.department || '-'}</td>
                  </tr>
                  <tr>
                    <td class="label">Section</td>
                    <td class="value">Section ${registrationData?.section || '-'}</td>
                  </tr>
                  <tr>
                    <td class="label">Event Date</td>
                    <td class="value">${EVENT_CONFIG.date} (Full Day)</td>
                  </tr>
                  <tr>
                    <td class="label">Venue</td>
                    <td class="value">HICET Campus, Coimbatore</td>
                  </tr>
                  <tr>
                    <td class="label">Entry Authorization</td>
                    <td class="value"><span class="badge-confirmed">✓ CONFIRMED ENTRY</span></td>
                  </tr>
                </table>

                <!-- Barcode Graphics -->
                <div class="barcode-strip">
                  <div class="barcode-bar" style="width:3px;"></div>
                  <div class="barcode-bar" style="width:1px;"></div>
                  <div class="barcode-bar" style="width:4px;"></div>
                  <div class="barcode-bar" style="width:2px;"></div>
                  <div class="barcode-bar" style="width:5px;"></div>
                  <div class="barcode-bar" style="width:1px;"></div>
                  <div class="barcode-bar" style="width:3px;"></div>
                  <div class="barcode-bar" style="width:4px;"></div>
                  <div class="barcode-bar" style="width:2px;"></div>
                  <div class="barcode-bar" style="width:6px;"></div>
                  <div class="barcode-bar" style="width:1px;"></div>
                  <div class="barcode-bar" style="width:3px;"></div>
                  <div class="barcode-bar" style="width:5px;"></div>
                  <div class="barcode-bar" style="width:2px;"></div>
                  <div class="barcode-bar" style="width:4px;"></div>
                  <div class="barcode-bar" style="width:1px;"></div>
                  <div class="barcode-bar" style="width:3px;"></div>
                  <div class="barcode-bar" style="width:5px;"></div>
                  <div class="barcode-bar" style="width:2px;"></div>
                  <div class="barcode-bar" style="width:4px;"></div>
                  <div class="barcode-bar" style="width:2px;"></div>
                  <div class="barcode-bar" style="width:5px;"></div>
                  <div class="barcode-bar" style="width:1px;"></div>
                  <div class="barcode-bar" style="width:4px;"></div>
                </div>
                <div style="text-align: center; font-family: monospace; font-size: 11px; color: #777; letter-spacing: 2px;">
                  *${registrationData?.registrationId || 'FF26-0001'}*
                </div>

              </div>

              <!-- Footer Section -->
              <div class="ticket-footer">
                <strong>Important Instructions:</strong><br/>
                Please present this single-page pass at the registration desk on <strong>${EVENT_CONFIG.date}</strong>.<br/>
                Join the official WhatsApp group for live event updates, schedules, and film screening locations.<br/>
                © 2026 FRAME FEST ’26 • Department of Artificial Intelligence & Machine Learning
              </div>

            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `;

      printWin.document.write(receiptHtml);
      printWin.document.close();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingType(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="bg-[#141414] border border-[#2e2e2e] rounded-2xl max-w-xl w-full p-6 sm:p-10 shadow-2xl relative text-center">
        
        {/* Animated Checkmark Circle */}
        <div className="w-20 h-20 rounded-full bg-green-950/40 border-2 border-green-500/80 text-green-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-black font-cinematic uppercase tracking-tight text-white mb-2">
          REGISTRATION SUCCESSFUL
        </h2>

        {/* Message */}
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6 max-w-md mx-auto">
          “Your registration for Frame Fest ’26 has been successfully submitted.”
        </p>

        {/* Highlighted Registration ID Card */}
        <div className="bg-[#0b0b0b] border-2 border-[#e50914]/60 rounded-xl p-6 mb-6 relative shadow-lg">
          <div className="text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase mb-1">
            OFFICIAL REGISTRATION ID
          </div>

          <div className="flex items-center justify-center space-x-3 mb-3">
            <span className="text-3xl sm:text-4xl font-mono font-black text-[#e50914] tracking-widest">
              {registrationData?.registrationId || 'FF26-0001'}
            </span>
            <button
              onClick={handleCopyId}
              className="p-2 rounded-lg bg-[#1f1f1f] hover:bg-[#2b2b2b] text-neutral-300 hover:text-white transition-colors"
              title="Copy Registration ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {copiedId && (
            <span className="text-xs text-green-400 font-semibold block mb-2">
              Copied to clipboard!
            </span>
          )}

          {/* Participant Name & Date */}
          <div className="pt-4 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-300 gap-2">
            <div>
              <span className="text-neutral-500">PARTICIPANT: </span>
              <span className="font-bold text-white">{registrationData?.name}</span>
            </div>
            <div className="flex items-center space-x-1.5 font-bold text-white">
              <Calendar className="w-3.5 h-3.5 text-[#e50914]" />
              <span>{EVENT_CONFIG.date.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* WhatsApp Group Reminder (Clickable directly to WhatsApp Group) */}
        <a
          href={EVENT_CONFIG.whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Click to join official WhatsApp group"
          className="bg-[#101913] border border-[#25D366]/50 hover:border-[#25D366] rounded-xl p-4 mb-8 text-left flex items-center gap-4 transition-all hover:bg-[#122216] group cursor-pointer block"
        >
          <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center border border-neutral-600 group-hover:scale-105 transition-transform">
            <img
              src={EVENT_CONFIG.whatsappQrImage}
              alt="WhatsApp QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-xs flex-1">
            <div className="font-bold text-white flex items-center space-x-1.5 mb-1 group-hover:text-[#25D366] transition-colors">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>Join Official WhatsApp Group</span>
            </div>
            <p className="text-neutral-300">
              Tap here or scan this QR to receive event day schedules, slot timings, and guidelines.
            </p>
            <span className="inline-block text-[11px] font-bold text-[#25D366] mt-1.5 underline">
              Tap to open WhatsApp &rarr;
            </span>
          </div>
        </a>

        {/* DOWNLOAD TICKET / PASS OPTIONS (PDF & IMAGE ONLY) */}
        <div className="space-y-3 mb-6 text-left">
          <div className="text-xs font-bold font-mono tracking-widest text-neutral-400 uppercase text-center mb-2">
            DOWNLOAD ENTRY PASS & TICKET
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Download as Single-Page PDF Pass */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingType === 'pdf'}
              className="py-3.5 px-4 rounded-xl bg-[#e50914] hover:bg-[#b80710] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_25px_rgba(229,9,20,0.6)]"
              title="Download Single-Page PDF Pass"
            >
              <FileText className="w-5 h-5 text-white" />
              <div className="text-left">
                <div className="font-extrabold text-sm">DOWNLOAD PDF PASS</div>
                <div className="text-[10px] text-red-200 lowercase font-normal">single-page ticket (.pdf)</div>
              </div>
            </button>

            {/* 2. Download as Image */}
            <button
              onClick={handleDownloadImage}
              disabled={downloadingType === 'image'}
              className="py-3.5 px-4 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] hover:border-[#e50914] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2 group shadow-md"
              title="Download as high-res PNG image pass"
            >
              <ImageIcon className="w-5 h-5 text-[#e50914] group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="font-extrabold text-sm">DOWNLOAD PASS IMAGE</div>
                <div className="text-[10px] text-neutral-400 font-normal">high-resolution (.png)</div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#222]">
          <button
            onClick={onRegisterAnother}
            className="py-3 px-4 rounded-lg bg-[#1a1a1a] hover:bg-[#242424] border border-[#333] text-neutral-200 font-semibold tracking-wide text-xs uppercase transition-colors flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4 text-[#e50914]" />
            <span>REGISTER ANOTHER</span>
          </button>

          <button
            onClick={onGoHome}
            className="py-3 px-4 rounded-lg bg-[#1a1a1a] hover:bg-[#242424] border border-[#333] text-neutral-200 font-semibold tracking-wide text-xs uppercase transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4 text-[#e50914]" />
            <span>GO TO HOME</span>
          </button>
        </div>

      </div>
    </div>
  );
}
