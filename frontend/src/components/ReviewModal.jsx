import React from 'react';
import { Edit3, Send, MessageCircle } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function ReviewModal({
  isOpen,
  formData,
  onEdit,
  onConfirm,
  isSubmitting
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#141414] border border-[#2e2e2e] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="border-b border-[#242424] pb-4 mb-6">
          <span className="text-xs font-mono font-bold tracking-widest text-[#e50914] uppercase block mb-1">
            STEP 2 OF 2 • VERIFY DETAILS
          </span>
          <h3 className="text-2xl font-black font-cinematic uppercase tracking-tight text-white">
            REVIEW REGISTRATION
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Please confirm your details carefully before submitting to {EVENT_CONFIG.name}.
          </p>
        </div>

        {/* Details Summary Table */}
        <div className="space-y-3 bg-[#0d0d0d] border border-[#222] rounded-xl p-4 sm:p-5 text-sm">
          <div className="flex justify-between items-center py-1 border-b border-[#1c1c1c]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Full Name</span>
            <span className="text-white font-bold text-right">{formData.name}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1c1c]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Register Number</span>
            <span className="text-[#e50914] font-mono font-bold text-right">{formData.registerNumber}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1c1c]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Department</span>
            <span className="text-white font-medium text-right max-w-[240px] truncate">{formData.department}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1c1c]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Section</span>
            <span className="text-white font-bold text-right">{formData.section}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1c1c]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Phone Number</span>
            <span className="text-white font-mono text-right">{formData.phone}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1c1c]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Email Address</span>
            <span className="text-white text-right max-w-[240px] truncate">{formData.email}</span>
          </div>

          <div className="flex justify-between items-center pt-2 text-[#25D366]">
            <span className="text-neutral-400 text-xs uppercase font-medium flex items-center space-x-1">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp Group</span>
            </span>
            <span className="text-xs font-semibold">QR Displayed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 mt-6">
          <button
            type="button"
            onClick={onEdit}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-lg bg-[#222] hover:bg-[#2b2b2b] text-neutral-200 text-sm font-bold tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4" />
            <span>EDIT</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-lg bg-[#e50914] hover:bg-[#b80710] text-white text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_25px_rgba(229,9,20,0.6)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>SUBMITTING...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>CONFIRM & SUBMIT</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
