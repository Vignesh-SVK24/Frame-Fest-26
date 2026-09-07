// FRAME FEST '26 - Central Event Configuration
// All event metadata, organizer info, leadership, and group assets are managed here.

export const EVENT_CONFIG = {
  name: "FRAME FEST ’26",
  titlePrefix: "FRAME FEST",
  titleYear: "’26",
  category: "Film & Editing Fest",
  subtitle: "A FILM & EDITING FEST",
  tagline: "SHOW YOUR SKILLS. CREATE IMPACT.",
  date: "18 September 2026",
  fullDate: "Friday, 18 September 2026",
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
  whatsappQrImage: "/whatsapp-qr.jpg",
  whatsappGroupTitle: "FRAMEFEST'26 WhatsApp Group",
  whatsappNote: "Scan the QR code below using WhatsApp or your camera to join the official Frame Fest ’26 participant group for instant updates, announcements, and schedules.",
  
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
    "Other"
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
  ]
};
