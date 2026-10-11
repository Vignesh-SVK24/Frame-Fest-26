// FRAME FEST '26 - Central Event Configuration
// All event metadata, organizer info, leadership, and group assets are managed here.

export const EVENT_CONFIG = {
  name: "FRAME FEST ’26",
  titlePrefix: "FRAME FEST",
  titleYear: "’26",
  category: "Film & Editing Fest",
  subtitle: "A FILM & EDITING FEST",
  tagline: "SHOW YOUR SKILLS. CREATE IMPACT.",
  date: "November 4 & 5, 2026",
  fullDate: "Wednesday & Thursday, 4 & 5 November 2026",
  venue: "Marudham Hall, HICET",
  venueFull: "Marudham Hall, Hindusthan College of Engineering and Technology (HICET)",
  description: "Showcase your creativity, editing skills and visual storytelling at Frame Fest ’26.",
  aboutDescription: "Frame Fest ’26 is a film and editing fest designed to showcase creativity, storytelling and digital media skills.",
  
  // Organizer & Leadership details
  college: "HICET – Hindusthan College of Engineering and Technology",
  collegeShort: "HICET",
  department: "Department of Artificial Intelligence & Machine Learning",
  departmentShort: "Dept. of AI & ML",
  staffCoordinators: [
    "Dr. D. Satheesh Kumar",
    "Ms. V. Devi"
  ],
  convenor: {
    name: "Dr. R. Vidhya",
    designation: "Professor and Head"
  },
  patron: {
    name: "Dr. J. Jaya",
    designation: "PRINCIPAL"
  },
  
  // WhatsApp Community / Group
  whatsappQrImage: `${(import.meta.env.BASE_URL || '/').replace(/\/$/, '')}/whatsapp-qr.jpg`,
  whatsappGroupTitle: "FRAMEFEST'26 WhatsApp Group",
  whatsappGroupLink: "https://chat.whatsapp.com/Fn8LXvzLP1PFbsp5GFRdvs",
  whatsappNote: "Scan the QR code below or tap to join the official Frame Fest ’26 participant WhatsApp group for instant updates, announcements, and schedules.",
  
  // Contact info
  contactEmail: "framefest26@hicet.ac.in",
  contactPhone: "+91 98765 43210",
  
  // Options for registration form (17 Specific Departments + Other)
  departments: [
    "Artificial Intelligence and Machine Learning",
    "Cyber Security",
    "Computer Science",
    "Information Technology",
    "Electronic And Communication Engineering (ECE)",
    "Electrical and Electronics Engineering (EEE)",
    "Mechanical engineering",
    "Aeronautical engineering",
    "Electronic and Instrumentation Engineering",
    "Automobile Engineering",
    "Food Technology",
    "Chemical Engineering",
    "Mechatronics Engineering",
    "Civil Engineering",
    "Bio Medical Engineering",
    "Agriculture Engineering",
    "Computer Science and Business Systems",
    "Other"
  ],
  
  sections: [
    "A",
    "B",
    "C",
    "D",
    "Null"
  ],

  // Highlights cards for About section
  cards: [
    {
      id: "create",
      title: "CREATE",
      description: "Show your creativity.",
      icon: "camera"
    },
    {
      id: "compete",
      title: "COMPETE",
      description: "Challenge your editing and Videography skills.",
      icon: "film"
    },
    {
      id: "win",
      title: "WIN",
      description: "Compete for exciting prizes.",
      icon: "trophy"
    },
    {
      id: "inspire",
      title: "INSPIRE",
      description: "Create content that makes an impact.",
      icon: "clapperboard"
    }
  ],

  // 6 Official Competition / Fest Skill Categories
  festSkills: [
    {
      id: "videography",
      title: "VIDEOGRAPHY",
      name: "Videography",
      description: "Capture cinematic frames, camera movement, composition, and visual storytelling.",
      icon: "video"
    },
    {
      id: "video-editing",
      title: "VIDEO EDITING",
      name: "Video Editing",
      description: "Demonstrate cuts, color grading, motion pacing, VFX rhythm, and sound design mastery.",
      icon: "film"
    },
    {
      id: "photography",
      title: "PHOTOGRAPHY",
      name: "Photography",
      description: "Frame powerful still moments, creative perspectives, lighting, and portrait aesthetics.",
      icon: "camera"
    },
    {
      id: "photo-editing",
      title: "PHOTO EDITING",
      name: "Photo Editing",
      description: "Digital retouching, aesthetic mood creation, tone grading, and color balance.",
      icon: "image"
    },
    {
      id: "poster-designing",
      title: "POSTER DESIGNING",
      name: "Poster Designing",
      description: "Create eye-catching movie posters, typography layouts, and cinematic digital artwork.",
      icon: "palette"
    },
    {
      id: "web-designing",
      title: "WEB DESIGNING",
      name: "Web Designing",
      description: "Craft modern UI/UX digital experiences, responsive layouts, and creative web styling.",
      icon: "layout"
    }
  ],

  // Form options list
  festSkillOptions: [
    "Videography",
    "Video Editing",
    "Photography",
    "Photo Editing",
    "Poster Designing",
    "Web Designing"
  ]
};
