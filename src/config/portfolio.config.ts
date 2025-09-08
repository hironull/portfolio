// Portfolio Configuration - Customize everything from this single file
export const portfolioConfig = {
  // Personal Information
  personal: {
    name: "Hiro",
    title: "Full-Stack Web Developer",
    tagline: "Hi I'm Hiro and I'm passionate about crafting digital experiences. Welcome to my little corner on the internet. I make, bake and break software for the most innovative projects.",
    email: "me@hironull.lol",
    location: "N/A",
    avatar: "/src/assets/pixel-avatar.png"
  },

  // SEO & Meta
  seo: {
    title: "Hiro - Full Stack Developer Portfolio",
    description: "Passionate full-stack developer crafting digital experiences. Welcome to my terminal-inspired portfolio showcasing my projects and skills.",
    keywords: ["full-stack developer", "react", "typescript", "node.js", "python", "web development"],
    ogImage: "/og-image.png"
  },

  // Theme & Design
  theme: {
    primaryColor: "120 100% 50%", // Terminal green
    accentColor: "0 0% 100%", // White
    backgroundColor: "0 0% 4%", // Deep black
    terminalColors: {
      window: "0 0% 12%",
      border: "0 0% 20%",
      header: "0 0% 8%"
    },
    animations: {
      typingSpeed: 50,
      staggerDelay: 0.1,
      transitionDuration: 300,
      hoverScale: 1.05
    }
  },

  // Navigation
  navigation: {
    showScrollProgress: true,
    smoothScroll: true,
    sections: ["about", "skills", "projects", "contact"]
  },

  // Skills Configuration
  skills: [
    { name: "React", category: "Frontend", level: 95 },
    { name: "TypeScript", category: "Language", level: 90 },
    { name: "Node.js", category: "Backend", level: 85 },
    { name: "Python", category: "Language", level: 80 },
    { name: "Databases", category: "Backend", level: 68 },
    { name: "UI/UX", category: "Design", level: 95 },
    { name: "Infrastructure", category: "DevOps", level: 94 },
    { name: "DevOps", category: "DevOps", level: 70 }
  ],

  // Projects Configuration
  projects: [
    {
      name: "StrelixCloud",
      year: "2025",
      description: "High-performance hosting, custom development, and premium digital solutions for modern businesses and gaming communities.",
      tags: ["Pterodactyl", "Proxmox", "Docker"],
      status: "production",
      featured: true,
      links: {
        github: "https://github.com/hironull",
        live: "https://strelixcloud.com"
      }
    },
    {
      name: "Aerox",
      year: "2025", 
      description: "An Development and coders hub.",
      tags: ["Discord.py", "Python3", "Nodejs"],
      status: "production",
      featured: true,
      links: {
        github: "https://github.com/hiro/strelizia",
        live: "https://discord.gg/ZVz7CgTy5v"
      }
    },
    {
      name: "Addiee",
      year: "2025",
      description: "An Next Generation Discord bot.",
      tags: ["React", "TypeScript", "Node.js"],
      status: "coming soon",
      featured: false,
      links: {
        github: "https://github.com/hiro/adios",
        live: "https://discord.gg/strelix"
      }
    },
    {
      name: "Strelixactyl",
      year: "2025",
      description: "Pterodactyl panel's alternative with more features and modern design.",
      tags: ["Next.js", "Supabase", "TypeScript"],
      status: "coming soon",
      featured: false,
      links: {
        github: "https://github.com/hiro/cloudsync",
        live: "https://discord.gg/strelix"
      }
    },
    {
      name: "Strelix selfbot",
      year: "2025",
      description: "Interactive data visualization toolkit for creating beautiful charts and dashboards with real-time analytics.",
      tags: ["JavaScript", "nodejs", "selfbot.js"],
      status: "coming soon",
      featured: false,
      links: {
        github: "https://github.com/hiro/dataviz-pro",
        live: "https://discord.gg/strelix"
      }
    }
  ],

  // Social Links
  social: {
    github: "https://github.com/hironull",
    linkedin: "https://linkedin.com/in/hiro",
    twitter: "https://twitter.com/hiro",
    email: "mailto:me@hironull.lol"
  },

  // Content Sections
  content: {
    about: {
      title: "About",
      paragraphs: [
        "Passionate full-stack web developer who loves creating elegant solutions to complex problems. I blend creativity with technical expertise to build applications that are both functional and beautiful.",
        "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community."
      ],
      availability: "Available for freelance projects"
    },
    contact: {
      title: "Contact",
      description: "Let's build something amazing together. I'm always excited to discuss new projects and opportunities.",
      cta: "Thanks for visiting!"
    }
  },

  // Feature Flags
  features: {
    particles: true,
    matrixRain: true,
    soundEffects: false,
    darkMode: true, // Always dark for terminal theme
    analytics: false,
    showCodeButtons: false // Toggle to show/hide code buttons in projects
  }
};
