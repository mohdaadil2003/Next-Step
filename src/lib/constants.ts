export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918506880786";
export const CALL_NUMBER = process.env.NEXT_PUBLIC_CALL_NUMBER || "+918506880786";
export const EMAIL = process.env.NEXT_PUBLIC_EMAIL || "nextstep0026@gmail.com";

export const CATEGORIES = [
  { name: "Technology", icon: "\uD83D\uDCBB", bg: "#DBEAFE" },
  { name: "Marketing", icon: "\uD83D\uDCE3", bg: "#FCE7F3" },
  { name: "Finance", icon: "\uD83D\uDCB0", bg: "#D1FAE5" },
  { name: "Design", icon: "\uD83C\uDFA8", bg: "#EDE9FE" },
  { name: "Sales", icon: "\uD83E\uDD1D", bg: "#FEF3C7" },
  { name: "HR", icon: "\uD83D\uDC65", bg: "#FEE2E2" },
  { name: "Operations", icon: "\u2699\uFE0F", bg: "#E0F2FE" },
  { name: "Data & Analytics", icon: "\uD83D\uDCCA", bg: "#F0FDF4" },
  { name: "Content Writing", icon: "\u270D\uFE0F", bg: "#FFFBEB" },
  { name: "Education", icon: "\uD83D\uDCDA", bg: "#EFF6FF" },
] as const;

export const COLORS = [
  "#0A66C2", "#E91E63", "#7C3AED", "#059669",
  "#F59E0B", "#0891B2", "#EF4444", "#8B5CF6",
] as const;

export const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Freelance",
] as const;

export const EXPERIENCE_LEVELS = [
  "Fresher (0-1 yr)",
  "0-2 Years",
  "1-3 Years",
  "2-5 Years",
] as const;

export const CATEGORY_OPTIONS = [
  ...CATEGORIES.map((c) => c.name),
  "Healthcare",
  "Other",
] as const;

export const TESTIMONIALS = [
  {
    name: "Rahul Kumar", initials: "RK", role: "Software Developer",
    quote: '"I was struggling for months after graduation. NEXT STEP helped me land my first job as a Software Developer within 3 weeks!"',
    stars: 5, company: "TechSolutions Pvt. Ltd.",
  },
  {
    name: "Priya Sharma", initials: "PS", role: "Marketing Executive",
    quote: '"The career consulting helped me revamp my resume. Got 5 interview calls in 2 weeks. Now working as a Marketing Executive!"',
    stars: 5, company: "DigitalBoost Agency",
  },
  {
    name: "Arjun Verma", initials: "AV", role: "Finance Analyst",
    quote: '"The resources section changed the way I approached interviews. NEXT STEP is genuinely the best platform for freshers!"',
    stars: 5, company: "FinanceHub India",
  },
  {
    name: "Neha Singh", initials: "NS", role: "UI/UX Designer",
    quote: '"As a design graduate with no connections, I felt lost. NEXT STEP connected me with DesignStudio and I got an offer within 10 days!"',
    stars: 5, company: "DesignStudio Co.",
  },
  {
    name: "Karan Patel", initials: "KP", role: "Data Analyst",
    quote: '"The salary negotiation guide alone was worth it. I negotiated 20% more than the initial offer. This platform is a goldmine for freshers."',
    stars: 4, company: "DataMinds Analytics",
  },
  {
    name: "Shreya Mishra", initials: "SM", role: "Content Writer",
    quote: '"I used the cover letter templates and LinkedIn tips. Within a month, recruiters started reaching out to ME. Totally changed the game!"',
    stars: 5, company: "ContentPros Media",
  },
] as const;

export const PARTNER_COMPANIES = [
  "TechSolutions", "DigitalBoost", "FinanceHub", "DesignStudio",
  "PeopleFirst HR", "ContentPros", "GrowthLabs", "CloudNine Tech",
  "BrandForge", "DataMinds",
] as const;

export const RESOURCE_DATA: Record<
  string,
  {
    icon: string;
    iconBg: string;
    title: string;
    subtitle: string;
    sections: { heading: string; tips: string[] }[];
    cta: string;
    downloadUrl?: string;
  }
> = {
  resume: {
    icon: "\uD83D\uDCC4", iconBg: "#DBEAFE", title: "Resume Writing Guide",
    subtitle: "Craft an ATS-friendly resume that gets noticed",
    sections: [
      {
        heading: "Format & Structure",
        tips: [
          "Use a clean, single-column format for ATS parsing",
          "Keep it to 1 page for freshers \u2014 concise is king",
          "Use consistent fonts: 11-12pt body, 14-16pt headings",
          "Sections: Contact \u2192 Summary \u2192 Skills \u2192 Experience \u2192 Education",
        ],
      },
      {
        heading: "Content Tips",
        tips: [
          "Include keywords from the job description (ATS matching)",
          "Add measurable achievements, not just duties",
          "Use action verbs: Led, Built, Developed, Achieved, Increased",
          'Quantify results: "Increased engagement by 35%"',
        ],
      },
      {
        heading: "Common Mistakes to Avoid",
        tips: [
          "No photos, graphics, or tables (breaks ATS)",
          'Never use "References available on request" \u2014 outdated',
          "Don\u2019t list every skill \u2014 focus on relevant ones",
          "Always save and send as PDF",
        ],
      },
    ],
    cta: "Download Resume Template",
    downloadUrl: "/downloads/resume-template.pdf",
  },
  coverletter: {
    icon: "\u2709\uFE0F", iconBg: "#D1FAE5", title: "Cover Letter Templates",
    subtitle: "Professional templates tailored for freshers",
    sections: [
      {
        heading: "Cover Letter Structure",
        tips: [
          "Para 1: Who you are + why this company excites you",
          "Para 2: Your top 2-3 relevant skills with proof/examples",
          "Para 3: What you will bring to the team \u2014 show enthusiasm",
          "Para 4: Call to action \u2014 request an interview politely",
        ],
      },
      {
        heading: "Pro Tips",
        tips: [
          "Keep it under 250 words \u2014 recruiters skim",
          "Personalize EVERY letter \u2014 generic letters get rejected",
          "Address it to a specific person if possible",
          "Mirror the company\u2019s tone (formal vs. casual)",
          "Mention a recent company achievement or news",
        ],
      },
      {
        heading: "Template Opening Lines",
        tips: [
          '"As a recent [degree] graduate passionate about [field]..."',
          '"Your posting for [role] immediately caught my attention because..."',
          '"I was thrilled to discover the [role] opportunity at [company]..."',
        ],
      },
    ],
    cta: "Download Cover Letter Templates",
    downloadUrl: "/downloads/cover-letter-templates.pdf",
  },
  interview: {
    icon: "\uD83C\uDFAF", iconBg: "#EDE9FE", title: "Interview Preparation",
    subtitle: "Ace your first interview with confidence",
    sections: [
      {
        heading: "Top Interview Questions",
        tips: [
          '"Tell me about yourself" \u2014 prepare a 60-second pitch',
          '"Why this company?" \u2014 research the brand thoroughly',
          '"Strength & weakness" \u2014 be honest + show growth mindset',
          '"Where do you see yourself in 5 years?" \u2014 show ambition',
          '"Why should we hire you?" \u2014 align skills with role needs',
        ],
      },
      {
        heading: "The STAR Method",
        tips: [
          "Situation: Set the context for your story",
          "Task: Describe the challenge or responsibility",
          "Action: Explain exactly what YOU did",
          "Result: Share the outcome with numbers if possible",
        ],
      },
      {
        heading: "Body Language & Etiquette",
        tips: [
          "Maintain eye contact \u2014 shows confidence",
          "Firm handshake, sit upright, smile naturally",
          "Arrive 10 minutes early, dress one level above",
          "Send a thank-you email within 24 hours",
        ],
      },
    ],
    cta: "Download Interview Prep Sheet",
    downloadUrl: "/downloads/interview-prep-sheet.pdf",
  },
  linkedin: {
    icon: "\uD83D\uDD17", iconBg: "#FEF3C7", title: "LinkedIn Profile Tips",
    subtitle: "Optimize your profile to attract recruiters",
    sections: [
      {
        heading: "Profile Essentials",
        tips: [
          "Professional headshot \u2014 profiles with photos get 70% more views",
          'Headline: "Fresh Graduate | Seeking [Role] | [Key Skill]"',
          "Summary: 3-4 lines covering achievements + passion",
          "Custom URL: linkedin.com/in/yourname",
        ],
      },
      {
        heading: "Content Strategy",
        tips: [
          "Add all internships, projects, and certifications",
          "Request recommendations from professors or mentors",
          "Post updates weekly \u2014 share learnings, insights, articles",
          "Engage with company pages you want to work for",
        ],
      },
      {
        heading: "Networking Tips",
        tips: [
          "Connect with 10 relevant people daily in your field",
          "Send personalized connection notes \u2014 not defaults",
          "Join industry groups and participate in discussions",
          "Follow and comment on posts by hiring managers",
        ],
      },
    ],
    cta: "Download LinkedIn Checklist",
    downloadUrl: "/downloads/linkedin-checklist.pdf",
  },
  salary: {
    icon: "\uD83D\uDCBC", iconBg: "#FEE2E2", title: "Salary Negotiation",
    subtitle: "Know your worth and negotiate confidently",
    sections: [
      {
        heading: "Research Phase",
        tips: [
          "Research market rates on Glassdoor, LinkedIn, AmbitionBox",
          "Check the company\u2019s typical pay range for the role",
          "Factor in city (metro vs tier-2), company size, and industry",
          "Know the difference between CTC, gross, and take-home",
        ],
      },
      {
        heading: "Negotiation Strategy",
        tips: [
          "Always negotiate \u2014 it\u2019s expected and respected",
          "Start 10-15% above your target to leave room",
          'Say: "Based on my research and skills, I was expecting X"',
          "Never accept on the spot \u2014 ask for 24-48 hours",
        ],
      },
      {
        heading: "Beyond Base Salary",
        tips: [
          "Consider WFH flexibility, learning budgets, health insurance",
          "Ask about performance bonuses and review cycles",
          "Joining bonus can compensate for lower base",
          "Get the final offer in writing before resigning",
        ],
      },
    ],
    cta: "Download Salary Guide",
    downloadUrl: "/downloads/salary-guide.pdf",
  },
  certifications: {
    icon: "\uD83C\uDFC6", iconBg: "#E0F2FE", title: "Free Certifications",
    subtitle: "Boost your resume with recognized certifications",
    sections: [
      {
        heading: "Technology & Data",
        tips: [
          "AWS Cloud Practitioner (Free tier labs)",
          "Google Data Analytics Certificate (Coursera)",
          "Microsoft Azure Fundamentals (AZ-900)",
          "IBM Data Science Professional (Coursera)",
        ],
      },
      {
        heading: "Marketing & Business",
        tips: [
          "Google Digital Marketing (Free \u2014 Google Skillshop)",
          "Meta Social Media Marketing (Coursera)",
          "HubSpot Content Marketing (Free)",
          "Google Analytics Certification (Free)",
        ],
      },
      {
        heading: "General Skills",
        tips: [
          "Microsoft Excel \u2014 LinkedIn Learning",
          "NPTEL courses (IIT certified \u2014 100% free)",
          "Coursera Project Management (Google)",
          "freeCodeCamp \u2014 Web Development (Free)",
        ],
      },
    ],
    cta: "View All Free Courses",
  },
};
