// Portfolio data - centralized content management

export const BIRTH_DATE = new Date(Date.UTC(2005, 5, 16));
export const PERSONAL_INFO = {
  name: "Utpal",
  tagline: "been here for",
  bio: {
    tldr: "seeking full-stack roles",
    line1: "into ai/ml, devops, scalable and distributed systems.",
    line2: "building full-stack and mobile apps.",
    line3: "create. explore. expand. conquer.",
    blogLink: "read my blogs here",
    resumeLink: {
      text: "resume",
      url: "https://example.com/resume",
    },
  },
  avatar: "/avatar.jpg",
};

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  image?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "Cool Project One",
    description: "A project that does something amazing and innovative.",
    tech: ["Next.js", "TypeScript", "Tailwind"],
    link: "https://example.com",
    github: "https://github.com/username/project",
    featured: true,
  },
  {
    id: "project-2",
    title: "Another Great Project",
    description: "Building the future, one line of code at a time.",
    tech: ["React", "Node.js", "PostgreSQL"],
    github: "https://github.com/username/project2",
  },
  {
    id: "project-3",
    title: "Open Source Tool",
    description: "A helpful tool for developers worldwide.",
    tech: ["Rust", "WebAssembly"],
    github: "https://github.com/username/tool",
  },
  {
    id: "project-4",
    title: "Side Project",
    description: "Weekend hack that turned into something useful.",
    tech: ["Python", "FastAPI"],
    link: "https://example.com",
  },
];

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  period: string;
  description?: string;
}

export const EDUCATION: Education[] = [
  {
    id: "edu-1",
    institution: "University Name",
    degree: "Bachelor of Technology",
    field: "Computer Science",
    period: "2021 - Present",
    description: "Learning, building, and breaking things.",
  },
  {
    id: "edu-2",
    institution: "High School Name",
    degree: "High School",
    field: "Science",
    period: "2019 - 2021",
  },
];

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  link: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Building a Portfolio with Next.js",
    excerpt: "How I built this portfolio using modern web technologies.",
    date: "2026-01-15T00:00:00Z",
    readTime: "5 min",
    link: "/blog/portfolio",
  },
  {
    id: "blog-2",
    title: "Why TypeScript is Worth It",
    excerpt: "The case for type safety in JavaScript projects.",
    date: "2025-12-15T00:00:00Z",
    readTime: "8 min",
    link: "/blog/typescript",
  },
  {
    id: "blog-3",
    title: "The Art of Minimalism in Design",
    excerpt: "Less is more when it comes to user interfaces.",
    date: "2025-11-15T00:00:00Z",
    readTime: "4 min",
    link: "/blog/minimalism",
  },
];

export interface Game {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const GAMES: Game[] = [
  {
    id: "snake",
    name: "Snake",
    description: "Classic snake game",
    icon: "🐍",
  },
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    description: "Play against yourself",
    icon: "⭕",
  },
  {
    id: "memory",
    name: "Memory",
    description: "Test your memory",
    icon: "🧠",
  },
  {
    id: "typing",
    name: "Typing Test",
    description: "How fast can you type?",
    icon: "⌨️",
  },
];

export const NAV_ITEMS = [
  { id: "hero", label: "Home", href: "hero" },
  { id: "about", label: "About", href: "about" },
  { id: "projects", label: "Projects", href: "projects" },
  { id: "education", label: "Education", href: "education" },
  { id: "blogs", label: "Blogs", href: "blogs" },
  { id: "fun", label: "Fun", href: "fun" },
] as const;
