import React, { useRef } from 'react';
import { QrCode, Upload, Trash2, RefreshCw, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function PaymentSection({
  paymentFile,
  paymentPreview,
  onFileSelect,
  onFileRemove,
  error
}) {
  const fileInputRef = useRef(null);
  const [copiedUpi, setCopiedUpi] = React.useState(false);

  const handleCopyUpi = () => {
    if (EVENT_CONFIG.upiId) {
      navigator.clipboard.writeText(EVENT_CONFIG.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-[#262626]">
      {/* Section Header */}
      <div>
        <h3 className="text-xl font-black font-cinematic uppercase tracking-wider text-white flex items-center space-x-2">
          <QrCode className="w-5 h-5 text-[#e50914]" />
          <span>PAYMENT DETAILS</span>
        </h3>
        <p className="text-sm text-neutral-400 mt-1">
          Complete the registration payment and upload your payment screenshot below.
        </p>
      </div>

      {/* QR Code Card & Instructions */}
      <div className="bg-[#121212] border border-[#242424] rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        
        {/* Payment QR Code Box */}
        <div className="w-44 h-44 bg-white p-2.5 rounded-xl shadow-lg shrink-0 flex items-center justify-center border-2 border-neutral-300">
          <img
            src={EVENT_CONFIG.paymentQrImage}
            alt="Registration Payment QR Code"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Payment Instructions */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="inline-block px-2.5 py-1 rounded bg-[#e50914]/15 border border-[#e50914]/30 text-xs font-bold text-[#e50914] uppercase tracking-wider">
            REGISTRATION PAYMENT
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {EVENT_CONFIG.paymentNote}
          </p>

          {/* Configurable Payment Amount if defined */}
          {EVENT_CONFIG.paymentAmount && (
            <div className="text-sm font-semibold text-white">
              Fee: <span className="text-[#e50914] font-bold text-lg">{EVENT_CONFIG.paymentAmount}</span>
            </div>
          )}

          {/* UPI ID block with copy */}
          {EVENT_CONFIG.upiId && (
            <div className="inline-flex items-center space-x-2 bg-[#1b1b1b] border border-[#333] px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-300">
              <span className="text-neutral-500">UPI ID:</span>
              <span className="text-white font-bold">{EVENT_CONFIG.upiId}</span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="ml-2 text-neutral-400 hover:text-white transition-colors"
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          <div className="text-xs text-neutral-400">
            Accepts GPay, PhonePe, Paytm, and all standard UPI apps.
          </div>
        </div>

      </div>

      {/* Payment Proof Upload Area */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
          PAYMENT PROOF <span className="text-[#e50914]">*</span>
        </label>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileInputChange}
          className="hidden"
          id="paymentProofInput"
        />

        {/* If no file uploaded yet */}
        {!paymentPreview ? (
          <div
            onClick={handleTriggerUpload}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              error
                ? 'border-red-500/70 bg-red-950/10'
                : 'border-[#333] hover:border-[#e50914] bg-[#121212] hover:bg-[#161616]'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#1e1e1e] text-[#e50914] flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-white mb-1">
              Click to upload payment screenshot
            </div>
            <p className="text-xs text-neutral-400">
              PNG, JPG, or JPEG (Max file size: 5 MB)
            </p>
          </div>
        ) : (
          /* File Preview Box */
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-[#333] bg-[#0c0c0c] shrink-0">
              <img
                src={paymentPreview}
                alt="Payment proof preview"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center sm:text-left min-w-0">
              <div className="flex items-center justify-center sm:justify-start space-x-1.5 text-green-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Screenshot Selected</span>
              </div>
              <p className="text-sm font-medium text-white truncate">
                {paymentFile?.name || 'payment_proof.jpg'}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {paymentFile ? `${(paymentFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-center sm:justify-start space-x-3 mt-3">
                <button
                  type="button"
                  onClick={handleTriggerUpload}
                  className="px-3 py-1.5 rounded bg-[#222] hover:bg-[#2c2c2c] text-neutral-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>CHANGE IMAGE</span>
                </button>
                <button
                  type="button"
                  onClick={onFileRemove}
                  className="px-3 py-1.5 rounded bg-red-950/30 hover:bg-red-950/60 border border-red-800/40 text-red-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>REMOVE</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center space-x-1.5 text-xs text-red-400 mt-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
