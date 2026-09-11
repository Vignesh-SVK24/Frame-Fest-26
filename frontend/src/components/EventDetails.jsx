import React from 'react';
import { Calendar, Film, Award, Building2, GraduationCap, Users, UserCheck, ShieldCheck } from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function EventDetails() {
  const details = [
    {
      label: "EVENT",
      value: EVENT_CONFIG.name,
      subvalue: "Annual Media Fest",
      icon: <Film className="w-5 h-5 text-[#e50914]" />
    },
    {
      label: "DATE",
      value: EVENT_CONFIG.date,
      subvalue: "Friday • Full Day",
      icon: <Calendar className="w-5 h-5 text-[#e50914]" />
    },
    {
      label: "CATEGORY",
      value: EVENT_CONFIG.category,
      subvalue: "Creative & Media Competition",
      icon: <Award className="w-5 h-5 text-[#e50914]" />
    },
    {
      label: "ORGANIZED BY",
      value: EVENT_CONFIG.department,
      subvalue: "AIML Association",
      icon: <Building2 className="w-5 h-5 text-[#e50914]" />
    },
    {
      label: "COLLEGE",
      value: EVENT_CONFIG.college,
      subvalue: "Autonomous Institution, Coimbatore",
      icon: <GraduationCap className="w-5 h-5 text-[#e50914]" />
    }
  ];

  const leadership = [
    {
      role: "STAFF COORDINATOR",
      type: "list",
      names: EVENT_CONFIG.staffCoordinators,
      subtitle: "Faculty Coordinators",
      icon: <Users className="w-5 h-5 text-[#e50914]" />,
      orderClass: "order-3 md:order-1"
    },
    {
      role: "CONVENOR",
      type: "person",
      name: EVENT_CONFIG.convenor.name,
      designation: EVENT_CONFIG.convenor.designation,
      subtitle: "Department Leadership",
      icon: <UserCheck className="w-5 h-5 text-[#e50914]" />,
      orderClass: "order-2 md:order-2"
    },
    {
      role: "PATRON",
      type: "person",
      name: EVENT_CONFIG.patron.name,
      designation: EVENT_CONFIG.patron.designation,
      subtitle: "Institutional Patron",
      icon: <ShieldCheck className="w-5 h-5 text-[#e50914]" />,
      orderClass: "order-1 md:order-3"
    }
  ];

  return (
    <section id="event-details" className="py-20 bg-[#080808]/75 backdrop-blur-sm relative border-b border-[#1f1f1f]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Key Specifications */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-[#e50914] uppercase mb-2">
            KEY SPECIFICATIONS
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold font-cinematic text-white uppercase tracking-tight">
            EVENT DETAILS
          </p>
        </div>

        {/* Clean Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {details.map((item, idx) => (
            <div
              key={idx}
              className={`bg-[#121212]/80 backdrop-blur-sm border border-[#222222]/80 rounded-xl p-6 transition-all hover:border-[#383838] shadow-md flex items-start space-x-4 ${
                idx === 3 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#282828] shrink-0">
                {item.icon}
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#e50914] uppercase block mb-1">
                  {item.label}
                </span>
                <span className="text-base sm:text-lg font-bold text-white block leading-snug">
                  {item.value}
                </span>
                <span className="text-xs text-neutral-400 mt-1 block">
                  {item.subvalue}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Spacing and Divider */}
        <div className="my-16 flex items-center justify-center space-x-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-[#e50914]/60"></div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent"></div>
        </div>

        {/* Section 2: Leadership & Coordinators */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xs font-bold tracking-[0.25em] text-[#e50914] uppercase mb-2">
            FEST LEADERSHIP & COORDINATORS
          </h3>
          <p className="text-2xl sm:text-3xl font-extrabold font-cinematic text-white uppercase tracking-tight">
            ORGANIZING COMMITTEE
          </p>
        </div>

        {/* Leadership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {leadership.map((item, idx) => (
            <div
              key={idx}
              className={`bg-[#121212]/80 backdrop-blur-sm border border-[#222222]/80 hover:border-[#e50914]/40 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between ${item.orderClass}`}
            >
              <div>
                {/* Header with Role & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#e50914] uppercase">
                    {item.role}
                  </span>
                  <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#282828]">
                    {item.icon}
                  </div>
                </div>

                {/* Content: List for Staff Coordinator, Person + Designation for Convenor & Patron */}
                {item.type === 'list' ? (
                  <div className="space-y-1.5">
                    {item.names.map((name, i) => (
                      <div key={i} className="text-base sm:text-lg font-bold text-white leading-snug">
                        {name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white leading-snug">
                      {item.name}
                    </div>
                    <div className="text-sm font-semibold text-neutral-300 tracking-wide mt-1.5">
                      {item.designation}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Category */}
              <div className="mt-5 pt-3 border-t border-[#1e1e1e] text-xs text-neutral-400 font-medium">
                {item.subtitle}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
