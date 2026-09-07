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
        
        {/* WhatsApp QR Code Image Box (Clickable directly to WhatsApp Group) */}
        <a
          href={EVENT_CONFIG.whatsappGroupLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Click to join the official Frame Fest ’26 WhatsApp group"
          className="w-44 h-44 sm:w-56 sm:h-56 max-w-full bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl shrink-0 flex items-center justify-center border-2 border-neutral-700/60 hover:border-[#25D366] transition-all transform hover:scale-105 active:scale-95 relative group cursor-pointer"
        >
          <img
            src={EVENT_CONFIG.whatsappQrImage}
            alt="Frame Fest '26 Official WhatsApp Group QR Code"
            className="w-full h-full object-contain rounded-xl"
          />
          {/* Tap to Join Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white p-3 text-center">
            <MessageCircle className="w-9 h-9 text-[#25D366] mb-1.5 drop-shadow" />
            <span className="text-xs font-bold font-mono tracking-wider uppercase bg-[#25D366] text-black px-3 py-1 rounded-full shadow-lg">
              TAP TO JOIN
            </span>
          </div>
        </a>

        {/* Instructions & Community Features */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/30 text-xs font-bold text-[#25D366] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            <span>{EVENT_CONFIG.whatsappGroupTitle}</span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {EVENT_CONFIG.whatsappNote}
          </p>

          {/* Direct WhatsApp Join Link Button */}
          <div className="pt-1">
            <a
              href={EVENT_CONFIG.whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(37,211,102,0.35)] hover:shadow-[0_0_25px_rgba(37,211,102,0.6)] transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>CLICK TO JOIN WHATSAPP GROUP</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-neutral-400">
            <div className="flex items-center space-x-2 bg-[#181818] p-2.5 rounded-lg border border-[#262626]">
              <Smartphone className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Tap or scan via WhatsApp</span>
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
