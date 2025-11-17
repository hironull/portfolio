// Portfolio Configuration - Customize everything from this single file
export const portfolioConfig = {
  // Personal Information
  personal: {
    name: "Hiro",
    title: "Full-Stack Web Developer",
    tagline: "Hello, I'm Hiro, a professional web developer specializing in modern digital solutions. I create reliable, scalable applications that help businesses grow and succeed online.",
    email: "me@hironull.lol",
    location: "N/A",
    avatar: "/src/assets/pixel-avatar.png",
    // Set these to your GIF URLs to use animated avatars/banners
    avatarUrl: null, // e.g., "https://i.imgur.com/yourimage.gif" 
    bannerUrl: null  // e.g., "https://i.imgur.com/yourbanner.gif"
  },

  // SEO & Meta
  seo: {
    title: "Hiro - Full Stack Developer Portfolio",
    description: "Professional full-stack developer creating modern web applications. View my portfolio showcasing recent projects and technical expertise.",
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
      description: "Professional hosting platform providing custom development and premium digital solutions for modern businesses and gaming communities.",
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
      description: "A comprehensive development platform and community hub for programmers and coders.",
      tags: ["Discord.py", "Python3", "Nodejs"],
      status: "production",
      featured: true,
      links: {
        github: "https://github.com/hiro/strelizia",
        live: "https://discord.gg/ZVz7CgTy5v"
      }
    },
    {
      name: "Anirox",
      year: "2025",
      description: "A sleek anime streaming website with subbed & dubbed episodes, episode tracking, and completely free access with no sign-up required.",
      tags: ["React", "TypeScript", "Node.js"],
      status: "production",
      featured: true,
      links: {
        github: "https://github.com/hiro/adios",
        live: "https://anime.hironull.lol/"
      }
    },
    {
      name: "Strelixactyl",
      year: "2025",
      description: "Modern alternative to Pterodactyl panel featuring enhanced functionality and contemporary design.",
      tags: ["Next.js", "Supabase", "TypeScript"],
      status: "coming soon",
      featured: false,
      links: {
        github: "https://github.com/hiro/cloudsync",
        live: "https://discord.gg/strelix"
      }
    },
    {
      name: "Strelix Selfbot",
      year: "2025",
      description: "Interactive data visualization and analytics platform for creating comprehensive dashboards with real-time insights.",
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
      title: "About Me",
      paragraphs: [
        "I am a dedicated full-stack web developer with expertise in creating efficient, user-friendly applications. I focus on delivering high-quality solutions that meet business requirements and exceed user expectations.",
        "I stay current with industry trends and best practices, continuously expanding my technical skills to provide the most effective solutions for each project."
      ],
      availability: "Currently available for new projects"
    },
    contact: {
      title: "Get In Touch",
      description: "I am always interested in discussing new opportunities and projects. Feel free to reach out to explore how we can work together.",
      cta: "Thank you for visiting my portfolio!"
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
