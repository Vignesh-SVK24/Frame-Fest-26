import React from 'react';
import { MessageCircle, QrCode, CheckCircle2, Smartphone, BellRing } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function WhatsAppSection() {
  return (
    <div className="space-y-6 pt-6 border-t border-[#262626]">
      {/* Section Header */}
      <div>
        <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-[#25D366] uppercase mb-1">
          <MessageCircle className="w-4 h-4" />
          <span>OFFICIAL PARTICIPANT COMMUNITY</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black font-cinematic uppercase tracking-wider text-white flex items-center space-x-2">
          <span>JOIN WHATSAPP GROUP</span>
        </h3>
        <p className="text-sm text-neutral-400 mt-1">
          Connect with organizers and fellow participants for instant event updates and announcements.
        </p>
      </div>

      {/* WhatsApp QR Card */}
      <div className="bg-[#121212] border border-[#242424] hover:border-[#25D366]/40 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 transition-all shadow-xl">
        
        {/* WhatsApp QR Code Image Box */}
        <div className="w-44 h-44 sm:w-56 sm:h-56 max-w-full bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl shrink-0 flex items-center justify-center border-2 border-neutral-700/60 relative group">
          <img
            src={EVENT_CONFIG.whatsappQrImage}
            alt="Frame Fest '26 Official WhatsApp Group QR Code"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        {/* Instructions & Community Features */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-xs font-bold text-[#25D366] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            <span>{EVENT_CONFIG.whatsappGroupTitle}</span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {EVENT_CONFIG.whatsappNote}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-neutral-400">
            <div className="flex items-center space-x-2 bg-[#181818] p-2.5 rounded-lg border border-[#262626]">
              <Smartphone className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Scan directly via WhatsApp</span>
            </div>
            <div className="flex items-center space-x-2 bg-[#181818] p-2.5 rounded-lg border border-[#262626]">
              <BellRing className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Live schedule & alerts</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#181818] border border-[#262626] text-xs text-neutral-400 flex items-center justify-center md:justify-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>Free Registration • No payment required</span>
          </div>
        </div>

      </div>
    </div>
  );
}
