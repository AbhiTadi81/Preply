export const APP_NAME = "preply.";
export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" }
];
export const TARGET_ROLES = [
  { id: "frontend", title: "Frontend Developer", skills: ["JavaScript", "React", "CSS/HTML", "Performance", "Browser APIs"] },
  { id: "backend", title: "Backend Developer", skills: ["Node.js", "Express", "SQL", "MongoDB", "REST APIs", "System Design"] },
  { id: "fullstack", title: "Full Stack Engineer", skills: ["React", "Node.js", "TypeScript", "Databases", "Authentication", "DevOps"] },
  { id: "data-eng", title: "Data / Python Engineer", skills: ["Python", "SQL", "Data Modeling", "Pipelines", "Optimization"] }
];
export const MOCK_QUESTIONS = [
  {
    id: "q1",
    role: "frontend",
    topic: "JavaScript",
    subtopic: "Closures & Scope",
    question: "Explain closures in JavaScript and provide a common use case.",
    difficulty: "Medium",
    sampleAnswer: "A closure is the combination of a function bundled together with references to its surrounding state (lexical environment). Closures give functions access to outer scope variables even after the outer function has executed."
  },
  {
    id: "q2",
    role: "frontend",
    topic: "React",
    subtopic: "Hooks & Rendering",
    question: "What is the purpose of useEffect dependency array, and what happens when an object or array is passed without memoization?",
    difficulty: "Medium",
    sampleAnswer: "The dependency array tells React when to re-run the effect. Passing an un-memoized object or array causes referential equality checks to fail on every render, triggering infinite loops or unnecessary side effects."
  },
  {
    id: "q3",
    role: "backend",
    topic: "Node.js",
    subtopic: "Event Loop & Asynchrony",
    question: "How does the Node.js event loop handle asynchronous I/O operations without blocking the main execution thread?",
    difficulty: "Hard",
    sampleAnswer: "Node.js delegates non-blocking I/O operations to the operating system kernel via libuv thread pool. When operations finish, callbacks are pushed to event loop phases (timers, poll, check) and executed sequentially on the single main thread."
  },
  {
    id: "q4",
    role: "backend",
    topic: "SQL",
    subtopic: "Indexing & Queries",
    question: "How do database indexes speed up query performance, and what are the trade-offs when adding multiple indexes?",
    difficulty: "Medium",
    sampleAnswer: "Indexes create balanced B-Tree structures that avoid full table scans for lookup queries. The trade-off is slower INSERT, UPDATE, and DELETE operations and increased storage overhead because indexes must be updated continuously."
  }
];
