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
      <div className="bg-[#140f26] border border-[#2d224e] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="border-b border-[#251b3f] pb-4 mb-6">
          <span className="text-xs font-mono font-bold tracking-widest text-[#c084fc] uppercase block mb-1">
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
        <div className="space-y-3 bg-[#0d0a17] border border-[#251b3f] rounded-xl p-4 sm:p-5 text-sm">
          <div className="flex justify-between items-center py-1 border-b border-[#1c1530]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Full Name</span>
            <span className="text-white font-bold text-right">{formData.name}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1530]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Register Number</span>
            <span className="text-[#c084fc] font-mono font-bold text-right">{formData.registerNumber}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1530]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Department</span>
            <span className="text-white font-medium text-right max-w-[240px] truncate">{formData.department}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1530]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Section</span>
            <span className="text-white font-bold text-right">{formData.section}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1530]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Phone Number</span>
            <span className="text-white font-mono text-right">{formData.phone}</span>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1530]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Email Address</span>
            <span className="text-white text-right max-w-[240px] truncate">{formData.email}</span>
          </div>

          <div className="flex justify-between items-start py-1 border-b border-[#1c1530]">
            <span className="text-neutral-400 text-xs uppercase font-medium pt-0.5">Fest Skill(s)</span>
            <div className="text-right max-w-[240px]">
              {Array.isArray(formData.festSkills) && formData.festSkills.length > 0 ? (
                <div className="flex flex-wrap justify-end gap-1">
                  {formData.festSkills.map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#c084fc] text-[11px] font-semibold">
                      {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[#c084fc] font-bold">{formData.festSkill || '-'}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center py-1 border-b border-[#1c1530]">
            <span className="text-neutral-400 text-xs uppercase font-medium">Venue</span>
            <span className="text-white font-medium text-right text-xs">{EVENT_CONFIG.venue}</span>
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
            className="flex-1 py-3 px-4 rounded-lg bg-[#221c38] hover:bg-[#2c2447] text-neutral-200 text-sm font-bold tracking-wider uppercase transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Edit3 className="w-4 h-4" />
            <span>EDIT</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 rounded-lg bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
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
