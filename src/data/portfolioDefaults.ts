export interface HeroData {
  name: string;
  subtitle: string;
  roles: string[];
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  phone: string;
  location: string;
  orbitalTech: { label: string; color: string }[];
  profileImage?: string;
}

export interface AboutStat {
  label: string;
  value: number;
  suffix: string;
  color: string;
}

export interface WhatIDo {
  label: string;
  desc: string;
}

export interface AboutData {
  storyParagraphs: string[];
  whatIDo: WhatIDo[];
  stats: AboutStat[];
}

export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  period: string;
  year: string;
  color: string;
  highlights: string[];
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface SkillsData {
  categories: Record<string, SkillItem[]>;
  categoryColors: Record<string, string>;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  color: string;
  achievements: string[];
  tech: string[];
}

export interface MediaItem {
  type: 'image' | 'video';
  src: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  period: string;
  context: string;
  category?: string;
  description: string;
  longDesc: string;
  tech: string[];
  features: string[];
  github: string;
  demo: string;
  gradient: string;
  accent: string;
  emoji: string;
  images?: string[];
  media?: MediaItem[];
}

export interface CourseEntry {
  id: string;
  title: string;
  provider: string;
  period: string;
  badge: string;
  color: string;
}

export interface VolunteerEntry {
  id: string;
  role: string;
  organization: string;
  period: string;
  color: string;
  description: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  facebookUrl: string;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  education: EducationEntry[];
  skills: SkillsData;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  courses: CourseEntry[];
  volunteer: VolunteerEntry[];
  contact: ContactData;
}

export const defaultPortfolioData: PortfolioData = {
  hero: {
    name: "Ahmed Wael",
    subtitle: "Data Science & AI",
    roles: ["Data Science Student", "AI & ML Engineer", "Software Developer", "Problem Solver"],
    bio: "Third-year Data Science & AI student at Alexandria National University. Passionate about leveraging machine learning, data analysis, and software development to solve real-world problems.",
    email: "aw7065051@gmail.com",
    githubUrl: "https://github.com/AhmedWael25",
    linkedinUrl: "https://linkedin.com/in/ahmed-wael-8485a1302",
    phone: "+20 122 983 7943",
    location: "Alexandria, Egypt",
    orbitalTech: [
      { label: "Python", color: "#4FC3F7" },
      { label: "ML / AI", color: "#00C8FF" },
      { label: "React", color: "#61DAFB" },
    ],
  },
  about: {
    storyParagraphs: [
      "I'm Ahmed Wael, a third-year Data Science and AI student at Alexandria National University. I'm passionate about leveraging data to solve real-world problems, with a strong foundation in statistics, programming, and machine learning.",
      "I'm actively developing my skills through hands-on projects — from building ML models that predict customer churn with 86% accuracy, to creating full desktop applications and face recognition systems using Python, Java, and modern web technologies.",
      "Beyond academics, I'm involved in the robotics and tech community, contributed as an organizer in multiple youth organizations, and continuously expanding my knowledge through certifications from AWS, IBM, NVIDIA, and Kaggle.",
    ],
    whatIDo: [
      { label: "Machine Learning & AI", desc: "Building predictive models, classifiers, and NLP systems using Python, scikit-learn, TensorFlow and OpenCV" },
      { label: "Data Analysis", desc: "Transforming raw data into insights using Pandas, NumPy, and data visualization tools" },
      { label: "Software Development", desc: "Building desktop apps, web systems, and backends with React, Next.js, Java, MySQL, and Electron" },
      { label: "Cloud & Certifications", desc: "Certified by AWS, IBM, NVIDIA — applying cloud and big data knowledge to real projects" },
    ],
    stats: [
      { label: "Year of Study", value: 3, suffix: "rd", color: "hsl(210 100% 60%)" },
      { label: "Projects Built", value: 5, suffix: "+", color: "hsl(185 100% 55%)" },
      { label: "Technologies", value: 15, suffix: "+", color: "hsl(220 100% 70%)" },
      { label: "Organizations", value: 3, suffix: "", color: "hsl(195 100% 60%)" },
    ],
  },
  education: [
    {
      degree: "Bachelor's Degree — Data Science and Artificial Intelligence",
      institution: "Alexandria National University",
      location: "Alexandria, Egypt",
      period: "09/2023 – Present",
      year: "3rd Year",
      color: "hsl(210 100% 60%)",
      highlights: [
        "Specializing in Data Science, Machine Learning, and Artificial Intelligence",
        "Coursework: Statistics, Algorithms, Database Systems, Machine Learning, Computer Vision",
        "Hands-on projects in ML, NLP, and software development",
        "Active member of university tech and robotics communities",
      ],
    },
  ],
  skills: {
    categories: {
      Programming: [
        { name: "Python", level: 88 },
        { name: "Java", level: 78 },
        { name: "JavaScript / TypeScript", level: 82 },
        { name: "C++", level: 65 },
        { name: "SQL", level: 80 },
      ],
      "Data Science": [
        { name: "Pandas & NumPy", level: 85 },
        { name: "Data Analysis", level: 82 },
        { name: "Data Visualization", level: 78 },
        { name: "Statistical Analysis", level: 75 },
        { name: "Data Preprocessing", level: 83 },
      ],
      Frontend: [
        { name: "React / Next.js", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "Tailwind CSS", level: 88 },
        { name: "HTML / CSS", level: 90 },
        { name: "Electron (Desktop)", level: 72 },
      ],
      Database: [
        { name: "MySQL", level: 82 },
        { name: "SQL & JDBC", level: 80 },
        { name: "Database Design", level: 76 },
        { name: "Data Management", level: 78 },
      ],
      "AI & ML": [
        { name: "Machine Learning", level: 80 },
        { name: "scikit-learn", level: 78 },
        { name: "Deep Learning", level: 68 },
        { name: "Computer Vision (OpenCV)", level: 72 },
        { name: "NLP & Text Processing", level: 70 },
        { name: "TensorFlow", level: 62 },
      ],
      Tools: [
        { name: "Git & GitHub", level: 82 },
        { name: "Problem Solving", level: 85 },
        { name: "Team Collaboration", level: 90 },
        { name: "Critical Thinking", level: 88 },
        { name: "Arduino / Embedded", level: 65 },
      ],
    },
    categoryColors: {
      Programming: "hsl(210 100% 60%)",
      "Data Science": "hsl(185 100% 55%)",
      Frontend: "hsl(200 100% 60%)",
      Database: "hsl(220 100% 65%)",
      "AI & ML": "hsl(170 100% 50%)",
      Tools: "hsl(250 100% 72%)",
    },
  },
  experience: [
    {
      id: "exp-1",
      role: "Training Intern — Robotics & Control Systems",
      company: "Vortex Robotics",
      location: "Alexandria, Egypt",
      period: "09/2025 – 05/2026",
      type: "Training",
      color: "hsl(210 100% 60%)",
      achievements: [
        "Collaborated with a software team on robotics control systems",
        "Utilized Python and Arduino for hardware-software integration",
        "Worked on automation and embedded systems programming",
      ],
      tech: ["Python", "Arduino", "Control Systems", "Embedded"],
    },
    {
      id: "exp-2",
      role: "Machine Learning Summer Training",
      company: "National Telecommunication Institute — NTI",
      location: "Egypt",
      period: "08/2025 – 09/2025",
      type: "Training",
      color: "hsl(185 100% 55%)",
      achievements: [
        "Completed 120 hours of intensive ML training (90 hours Technical + 30 hours Freelancing)",
        "Achieved a final score of 85% across all modules",
        "Covered supervised/unsupervised learning, model evaluation, and deployment",
      ],
      tech: ["Machine Learning", "Python", "scikit-learn", "Data Science"],
    },
    {
      id: "exp-3",
      role: "Software Developer",
      company: "Target Construction",
      location: "Alexandria, Egypt",
      period: "08/2025 – Present",
      type: "Part-time",
      color: "hsl(220 100% 65%)",
      achievements: [
        "Developed a full desktop system application with SQL database integration",
        "Built efficient data management and reporting features",
        "Implemented business logic for construction project tracking",
      ],
      tech: ["Desktop App", "SQL", "Database", "Software Dev"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Advanced HR System",
      period: "07/2025 – 01/2026",
      context: "Freelance",
      category: "Web & Desktop",
      description: "A desktop-friendly HR app for companies to track attendance, handle vacations/days off, and calculate paychecks with QR check-in support.",
      longDesc: "A full-featured desktop HR management system built for companies. Employees can check in/out via QR codes or fingerprint machines (ZKTeco). The system handles vacation tracking, payroll calculations (hours, bonuses, taxes/deductions), and generates PDF reports and charts.",
      tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "MySQL", "Electron"],
      features: [
        "QR code & fingerprint (ZKTeco) check-in/check-out",
        "Vacation & days-off management",
        "Payroll calculation (hours, bonuses, taxes, deductions)",
        "PDF report generation & data charts",
        "Windows desktop app via Electron",
      ],
      github: "https://github.com/AhmedWael25",
      demo: "",
      gradient: "linear-gradient(135deg, #0055ff22, #00aaff22)",
      accent: "hsl(210 100% 60%)",
      emoji: "💼",
    },
    {
      id: "proj-2",
      title: "Banking Customer Churn Predictor",
      period: "05/2025",
      context: "Alexandria National University",
      category: "Machine Learning",
      description: "ML model using Random Forest Classifier to predict banking customer churn with 86.45% accuracy on 10,000 records.",
      longDesc: "This Machine Learning project utilized a Random Forest Classifier to predict banking customer churn. By preprocessing 10,000 records — including age, credit score, and active membership status — with feature scaling and label encoding, the model identified age and activity status as the primary churn drivers, achieving 86.45% accuracy.",
      tech: ["Python", "Random Forest", "scikit-learn", "Pandas", "NumPy", "Data Science"],
      features: [
        "86.45% prediction accuracy on 10,000 records",
        "Feature scaling & label encoding pipeline",
        "Identified age & activity status as top churn drivers",
        "Credit score and membership analysis",
        "Comprehensive model evaluation metrics",
      ],
      github: "https://github.com/AhmedWael25",
      demo: "",
      gradient: "linear-gradient(135deg, #00ff8822, #00ffcc22)",
      accent: "hsl(185 100% 55%)",
      emoji: "📊",
    },
    {
      id: "proj-3",
      title: "Text Summarization System",
      period: "04/2025",
      context: "Alexandria National University",
      category: "NLP / AI",
      description: "Python-based text summarizer using the Ant Colony Algorithm to intelligently select key sentences with NLP evaluation metrics.",
      longDesc: "A bio-inspired NLP system that leverages the Ant Colony Algorithm to optimize sentence selection for summarization. Evaluates output using compression ratio, cosine similarity, redundancy penalty, readability scores, and BERT Score.",
      tech: ["Python", "NLP", "Ant Colony Algorithm", "BERT Score", "Cosine Similarity"],
      features: [
        "Ant Colony bio-inspired sentence optimization",
        "BERT Score & cosine similarity evaluation",
        "Compression ratio & readability measurement",
        "Redundancy penalty to avoid repetition",
        "Balanced conciseness with semantic fidelity",
      ],
      github: "https://github.com/AhmedWael25",
      demo: "",
      gradient: "linear-gradient(135deg, #8800ff22, #cc00ff22)",
      accent: "hsl(250 100% 70%)",
      emoji: "📝",
    },
    {
      id: "proj-4",
      title: "Face Recognition System",
      period: "01/2025",
      context: "Alexandria National University",
      category: "Computer Vision",
      description: "Dual-stage face recognition system using PCA/LDA feature extraction and KNN classification with OpenCV.",
      longDesc: "This system uses PCA/LDA for facial feature extraction and KNN classification in Python to not only recognize faces but also distinguish between face photos and non-face images. By analyzing texture and geometric patterns with OpenCV, it filters out non-faces before processing.",
      tech: ["Python", "PCA / LDA", "KNN", "OpenCV", "Computer Vision"],
      features: [
        "PCA & LDA dimensionality reduction for facial features",
        "KNN classifier for face recognition",
        "OpenCV texture & geometric pattern analysis",
        "Dual-stage: face detection then recognition",
        "Non-face image filtering before classification",
      ],
      github: "https://github.com/AhmedWael25",
      demo: "",
      gradient: "linear-gradient(135deg, #ff880022, #ffcc0022)",
      accent: "hsl(30 100% 60%)",
      emoji: "👁️",
    },
    {
      id: "proj-5",
      title: "Car Rental System",
      period: "01/2025",
      context: "Alexandria National University",
      category: "Web & Desktop",
      description: "Java + MySQL car rental management system with booking, admin inventory control, automated billing, and OOP-based modular design.",
      longDesc: "Built with Java and a MySQL database, this system allows users to book vehicles and admins to manage inventory, bookings, and payments. Features a console interface, secure data storage, and automated billing via JDBC and OOP principles.",
      tech: ["Java", "MySQL", "JDBC", "OOP", "Console App"],
      features: [
        "Vehicle booking & reservation management",
        "Admin inventory and fleet control",
        "Automated billing & payment tracking",
        "JDBC database connectivity",
        "OOP modular architecture",
      ],
      github: "https://github.com/AhmedWael25",
      demo: "",
      gradient: "linear-gradient(135deg, #ff00aa22, #ff006622)",
      accent: "hsl(300 100% 70%)",
      emoji: "🚗",
    },
  ],
  courses: [
    { id: "c-1", title: "Introduction to Generative AI — Art of the Possible", provider: "Amazon Web Services (AWS)", period: "03/2026", badge: "AWS", color: "hsl(30 100% 60%)" },
    { id: "c-2", title: "Academy Graduate: Cloud Foundations", provider: "Amazon Web Services (AWS)", period: "10/2025 – 12/2025", badge: "AWS", color: "hsl(30 100% 60%)" },
    { id: "c-3", title: "Machine Learning", provider: "IBM", period: "09/2025", badge: "IBM", color: "hsl(210 100% 60%)" },
    { id: "c-4", title: "Deep Learning", provider: "NVIDIA", period: "08/2025 – 09/2025", badge: "NVIDIA", color: "hsl(120 80% 50%)" },
    { id: "c-5", title: "Data Science Methodology", provider: "IBM", period: "06/2025", badge: "IBM", color: "hsl(210 100% 60%)" },
    { id: "c-6", title: "Big Data", provider: "IBM", period: "05/2025", badge: "IBM", color: "hsl(210 100% 60%)" },
    { id: "c-7", title: "Computer Vision", provider: "Kaggle", period: "04/2025", badge: "Kaggle", color: "hsl(185 100% 55%)" },
    { id: "c-8", title: "Python Mega Build — 20 Apps in 60 Days", provider: "Udemy", period: "03/2025 – 06/2025", badge: "Udemy", color: "hsl(250 100% 70%)" },
    { id: "c-9", title: "Pandas", provider: "Kaggle", period: "12/2024", badge: "Kaggle", color: "hsl(185 100% 55%)" },
  ],
  volunteer: [
    {
      id: "v-1",
      role: "Member",
      organization: "Rotaract — Rac Renaissance Royal",
      period: "05/2025 – Present",
      color: "hsl(210 100% 60%)",
      description: "Active member contributing to community service initiatives, social impact projects, and youth development programs.",
    },
    {
      id: "v-2",
      role: "Organizer",
      organization: "Pivots FCDS",
      period: "11/2023 – Present",
      color: "hsl(185 100% 55%)",
      description: "Organizing events and activities focused on technology, computer science, and student development within the faculty community.",
    },
    {
      id: "v-3",
      role: "Organizer",
      organization: "EYE — Egyptian Youth Entity",
      period: "10/2023 – 04/2024",
      color: "hsl(220 100% 65%)",
      description: "Helped organize youth-focused events and workshops, fostering leadership and civic engagement among Egyptian students.",
    },
  ],
  contact: {
    email: "aw7065051@gmail.com",
    phone: "+20 122 983 7943",
    location: "Alexandria, Egypt",
    githubUrl: "https://github.com/AhmedWael25",
    linkedinUrl: "https://linkedin.com/in/ahmed-wael-8485a1302",
    instagramUrl: "",
    facebookUrl: "",
  },
};
