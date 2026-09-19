// Question Model
export interface IQuestion {
  _id: string;
  role: string;
  topic: string;
  subtopic: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleAnswer?: string;
}

export const questionsStore: IQuestion[] = [
  {
    _id: 'q1',
    role: 'Frontend Developer',
    topic: 'JavaScript',
    subtopic: 'Closures & Scope',
    question: 'Explain closures in JavaScript and provide a common use case.',
    difficulty: 'Medium',
    sampleAnswer: 'A closure is when a function retains access to variables from its outer lexical scope even after that outer function has executed.',
  },
  {
    _id: 'q2',
    role: 'Frontend Developer',
    topic: 'React',
    subtopic: 'Hooks & Rendering',
    question: 'What is the purpose of useEffect dependency array, and what happens when an object or array is passed without memoization?',
    difficulty: 'Medium',
    sampleAnswer: 'The dependency array instructs React when to trigger effects based on referential equality checks.',
  },
  {
    _id: 'q3',
    role: 'Backend Developer',
    topic: 'Node.js',
    subtopic: 'Event Loop & Asynchrony',
    question: 'How does the Node.js event loop handle asynchronous I/O operations without blocking the main execution thread?',
    difficulty: 'Hard',
    sampleAnswer: 'Node uses libuv to handle async I/O in the kernel thread pool and queues callbacks into event loop phases.',
  },
  {
    _id: 'q4',
    role: 'Backend Developer',
    topic: 'SQL',
    subtopic: 'Indexing & Queries',
    question: 'How do database indexes speed up query performance, and what are the trade-offs when adding multiple indexes?',
    difficulty: 'Medium',
    sampleAnswer: 'Indexes maintain balanced search trees allowing logarithmic lookups, at the expense of slower writes.',
  },
];
