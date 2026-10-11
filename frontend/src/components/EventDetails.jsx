import React from 'react';
import { 
  Calendar, 
  Film, 
  Award, 
  Building2, 
  GraduationCap, 
  Users, 
  UserCheck, 
  ShieldCheck,
  Video,
  Camera,
  Image as ImageIcon,
  Palette,
  Layout,
  Sparkles,
  MapPin
} from 'lucide-react';
import { EVENT_CONFIG } from '../config/eventConfig';

export default function EventDetails() {
  const details = [
    {
      label: "EVENT",
      value: EVENT_CONFIG.name,
      subvalue: "Annual Media & Design Fest",
      icon: <Film className="w-5 h-5 text-[#c084fc]" />
    },
    {
      label: "DATE",
      value: EVENT_CONFIG.date,
      subvalue: "Wednesday & Thursday • 2-Day Fest",
      icon: <Calendar className="w-5 h-5 text-[#c084fc]" />
    },
    {
      label: "VENUE",
      value: EVENT_CONFIG.venue,
      subvalue: "HICET Campus, Coimbatore",
      icon: <MapPin className="w-5 h-5 text-[#c084fc]" />
    },
    {
      label: "CATEGORY",
      value: EVENT_CONFIG.category,
      subvalue: "6 Skill Tracks • Media & Creative",
      icon: <Award className="w-5 h-5 text-[#c084fc]" />
    },
    {
      label: "ORGANIZED BY",
      value: EVENT_CONFIG.department,
      subvalue: "AIML Association",
      icon: <Building2 className="w-5 h-5 text-[#c084fc]" />
    },
    {
      label: "COLLEGE",
      value: EVENT_CONFIG.college,
      subvalue: "Autonomous Institution, Coimbatore",
      icon: <GraduationCap className="w-5 h-5 text-[#c084fc]" />
    }
  ];

  const getSkillIcon = (iconName) => {
    switch (iconName) {
      case 'video':
        return <Video className="w-6 h-6 text-[#c084fc]" />;
      case 'film':
        return <Film className="w-6 h-6 text-[#c084fc]" />;
      case 'camera':
        return <Camera className="w-6 h-6 text-[#c084fc]" />;
      case 'image':
        return <ImageIcon className="w-6 h-6 text-[#c084fc]" />;
      case 'palette':
        return <Palette className="w-6 h-6 text-[#c084fc]" />;
      case 'layout':
      default:
        return <Layout className="w-6 h-6 text-[#c084fc]" />;
    }
  };

  const leadership = [
    {
      role: "STAFF COORDINATOR",
      type: "list",
      names: EVENT_CONFIG.staffCoordinators,
      subtitle: "Faculty Coordinators",
      icon: <Users className="w-5 h-5 text-[#c084fc]" />,
      orderClass: "order-3 md:order-1"
    },
    {
      role: "CONVENOR",
      type: "person",
      name: EVENT_CONFIG.convenor.name,
      designation: EVENT_CONFIG.convenor.designation,
      subtitle: "Department Leadership",
      icon: <UserCheck className="w-5 h-5 text-[#c084fc]" />,
      orderClass: "order-2 md:order-2"
    },
    {
      role: "PATRON",
      type: "person",
      name: EVENT_CONFIG.patron.name,
      designation: EVENT_CONFIG.patron.designation,
      subtitle: "Institutional Patron",
      icon: <ShieldCheck className="w-5 h-5 text-[#c084fc]" />,
      orderClass: "order-1 md:order-3"
    }
  ];

  return (
    <section id="event-details" className="py-20 bg-[#07050d]/75 backdrop-blur-sm relative border-b border-[#221a38]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section 1: Key Specifications */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-[0.25em] text-[#c084fc] uppercase mb-2">
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
              className="bg-[#130f24]/80 backdrop-blur-sm border border-[#271e46]/80 rounded-xl p-6 transition-all hover:border-[#8b5cf6]/50 shadow-md flex items-start space-x-4"
            >
              <div className="p-3 rounded-lg bg-[#1a1433] border border-[#312557] shrink-0">
                {item.icon}
              </div>
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#c084fc] uppercase block mb-1">
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
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#2f2452] to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6]/60"></div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#2f2452] to-transparent"></div>
        </div>

        {/* Section 2: 6 Competition Categories & Fest Skills */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 text-xs font-bold tracking-[0.25em] text-[#c084fc] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL COMPETITION TRACKS</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-cinematic text-white uppercase tracking-tight">
            6 FEST SKILL CATEGORIES
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Select your specialized skill category during registration to compete and showcase your talents at FRAME FEST ’26.
          </p>
        </div>

        {/* 6 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {EVENT_CONFIG.festSkills.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-[#130f24]/80 backdrop-blur-sm border border-[#271e46]/80 hover:border-[#8b5cf6]/60 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-[0_10px_30px_rgba(139,92,246,0.25)] flex flex-col justify-between group relative"
            >
              <div className="absolute top-4 right-4 text-xs font-mono font-bold text-neutral-500 group-hover:text-[#c084fc] transition-colors">
                0{idx + 1}
              </div>
              <div>
                <div className="w-12 h-12 rounded-lg bg-[#1a1433] border border-[#312557] group-hover:border-[#8b5cf6] group-hover:bg-[#8b5cf6]/20 transition-all flex items-center justify-center mb-4">
                  {getSkillIcon(cat.icon)}
                </div>
                <h4 className="text-lg font-bold font-cinematic tracking-wider text-white uppercase mb-2 group-hover:text-[#c084fc] transition-colors">
                  {cat.name}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-[#231a3d] flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-wider text-[#c084fc] uppercase font-bold">
                  Skill 0{idx + 1}
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold bg-[#1a1433] px-2 py-0.5 rounded border border-[#2c204d]">
                  Official Event
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Spacing and Divider */}
        <div className="my-16 flex items-center justify-center space-x-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#2f2452] to-transparent"></div>
          <div className="w-2 h-2 rounded-full bg-[#8b5cf6]/60"></div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#2f2452] to-transparent"></div>
        </div>

        {/* Section 3: Leadership & Coordinators */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xs font-bold tracking-[0.25em] text-[#c084fc] uppercase mb-2">
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
              className={`bg-[#130f24]/80 backdrop-blur-sm border border-[#271e46]/80 hover:border-[#8b5cf6]/50 rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between ${item.orderClass}`}
            >
              <div>
                {/* Header with Role & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#c084fc] uppercase">
                    {item.role}
                  </span>
                  <div className="p-2 rounded-lg bg-[#1a1433] border border-[#312557]">
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
