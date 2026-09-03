export const site = {
  name: "Stephen Hung",
  shortName: "stpn.",
  url: "https://stephenhung.me",
  updatedAt: "2026-07-21",
  email: "stephenhung@berkeley.edu",
  location: "Berkeley, CA",
  role: "AI/ML engineer and product builder",
  description:
    "Stephen Hung is a UC Berkeley EECS student and AI/ML engineer building agentic systems, computer-vision products, and real-time interfaces.",
  headline: "I build AI agents and full stack apps.",
  bio:
    "UC Berkeley EECS ’28. I build agentic systems, computer-vision products, and real-time interfaces. Previously AI/ML engineer intern at Walmart Global Tech.",
  bioDetail:
    "I’ve shipped projects across voice agents, computer vision, developer tools, and onchain infrastructure. Recent work includes a top-five OpenAI Codex hackathon project, a Pump Fund investment, and award-winning builds at Caltech, UC Berkeley, UC Davis, UCSB, UCR, etc.",
  resume: "/resume.pdf",
  socials: {
    linkedin: "https://www.linkedin.com/in/stephen-h-hung/",
    x: "https://x.com/stpnhh",
    github: "https://github.com/stephenhungg",
  },
  routes: {
    home: "/",
    works: "/works",
    about: "/about",
    contact: "/contact",
  },
  nav: [
    { label: "works", href: "/works" },
    { label: "about", href: "/about" },
    { label: "contact", href: "/contact" },
  ],
} as const;
