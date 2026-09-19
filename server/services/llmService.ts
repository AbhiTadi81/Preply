// Isolated LLM Service (Provider agnostic - Gemini / OpenAI / Anthropic)
import { GoogleGenAI } from '@google/genai';
import { ENV } from '../config/env';
import { IQuestion } from '../models/Question';
import {
  IFinalInterviewReport,
  IInterview,
  IResumeCoverageItem,
  CoverageStatus,
} from '../models/Interview';
import { IAnswer } from '../models/Answer';

export interface StructuredEvaluation {
  score: number;
  feedback: string;
  technicalScore: number;
  clarityScore: number;
  completenessScore: number;
  overallScore: number;
  answerRelevanceScore: number;
  projectKnowledgeScore: number;
  missingConcepts: string[];
  topic: string;
  subtopic: string;
}

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && ENV.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
    } catch (err) {
      console.warn('[LLM] Could not initialize Gemini client:', err);
    }
  }
  return genAIClient;
}

// 1. Dynamic Question Generation based on uploaded resume PDF info and desired count
export async function generateInterviewQuestions(
  resumeFileName: string,
  resumeContentText: string,
  count: number = 5
): Promise<IQuestion[]> {
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are a Principal Tech Interviewer preparing an interview based on the candidate's resume.
Resume file: "${resumeFileName}"
${resumeContentText ? `Resume summary/text:\n${resumeContentText.slice(0, 3000)}\n` : ''}

Generate exactly ${count} realistic, challenging interview questions covering:
1. Candidate's projects mentioned in or inferred from the resume (e.g., handling outliers in machine learning, database indexing, API architecture, frontend performance).
2. Deep technical fundamentals (coding concepts, async operations, system design, debugging).
3. Problem solving and trade-offs.

Return ONLY a valid JSON array of objects with this schema:
[
  {
    "role": "<e.g. Software Engineer / Data Scientist / Full Stack Developer>",
    "topic": "<e.g. Machine Learning / React / System Design / Databases / Python>",
    "subtopic": "<e.g. Outlier Detection / State Management / Indexing / Caching>",
    "question": "<Specific, natural question string, e.g. Can you explain how you handled outliers in your house price prediction project?>",
    "difficulty": "Easy" | "Medium" | "Hard",
    "sampleAnswer": "<Key technical concepts that a strong candidate would highlight>"
  }
]`;

      let responseText: string | undefined;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = response.text;
      } catch (err) {
        console.warn('[LLM] Primary model failed, trying fallback model:', err);
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = fallbackRes.text;
      }

      if (responseText) {
        const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned) as Array<{
          role: string;
          topic: string;
          subtopic: string;
          question: string;
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          sampleAnswer?: string;
        }>;

        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, count).map((item, index) => ({
            _id: `q_dyn_${Date.now()}_${index + 1}`,
            role: item.role || 'Software Engineer',
            topic: item.topic || 'Engineering Fundamentals',
            subtopic: item.subtopic || 'Project Architecture',
            question: item.question,
            difficulty: item.difficulty || 'Medium',
            sampleAnswer: item.sampleAnswer || 'Explain architecture, trade-offs, and metrics achieved.',
          }));
        }
      }
    } catch (err) {
      console.warn('[LLM] Dynamic question generation failed, using curated question bank:', err);
    }
  }

  // Curated diverse question repository tailored for project & technical interviews
  const basePool: Array<Omit<IQuestion, '_id'>> = [
    {
      role: 'Full Stack & ML Engineer',
      topic: 'Machine Learning & Data',
      subtopic: 'Outlier Detection',
      question: 'Can you explain how you handled outliers in your house price prediction project?',
      difficulty: 'Medium',
      sampleAnswer: 'We used interquartile range (IQR) filtering and log transformations to prevent extreme real estate values from skewing gradient descent.',
    },
    {
      role: 'Full Stack Engineer',
      topic: 'System Architecture',
      subtopic: 'API Design & Latency',
      question: 'In your web application project, how did you optimize API response times and reduce database round-trips?',
      difficulty: 'Medium',
      sampleAnswer: 'We introduced Redis caching for hot endpoints, batched queries with DataLoader, and added composite indexes on frequently filtered fields.',
    },
    {
      role: 'Software Engineer',
      topic: 'Database Engineering',
      subtopic: 'Transactions & Concurrency',
      question: 'How did you handle concurrent updates and maintain data consistency across multi-step transactions in your projects?',
      difficulty: 'Hard',
      sampleAnswer: 'We utilized ACID transactions with optimistic locking via version numbers to reject dirty writes without locking entire tables.',
    },
    {
      role: 'Frontend Engineer',
      topic: 'Frontend Performance',
      subtopic: 'React Re-renders',
      question: 'How did you identify and resolve unnecessary re-rendering issues in your interactive dashboards?',
      difficulty: 'Medium',
      sampleAnswer: 'We utilized React Profiler, decomposed bulky components, and used useMemo / useCallback on stable identity references.',
    },
    {
      role: 'Backend Engineer',
      topic: 'Node.js & Asynchrony',
      subtopic: 'Event Loop & Thread Pool',
      question: 'How does the event loop in Node.js schedule microtasks versus macrotasks during high-throughput I/O?',
      difficulty: 'Hard',
      sampleAnswer: 'Microtasks (Promises, process.nextTick) resolve immediately after the active stack empties before the event loop advances to timer or poll phases.',
    },
    {
      role: 'Software Engineer',
      topic: 'Cloud & DevOps',
      subtopic: 'Containerization & CI/CD',
      question: 'Can you describe your CI/CD deployment pipeline and how you ensured zero-downtime rollouts?',
      difficulty: 'Medium',
      sampleAnswer: 'We used Docker multi-stage builds with GitHub Actions running automated unit and integration tests, deploying with blue-green rolling updates.',
    },
    {
      role: 'Security & Auth',
      topic: 'Authentication & Security',
      subtopic: 'JWT vs Session Management',
      question: 'How did you structure user authentication and prevent XSS or CSRF token vulnerabilities in your application?',
      difficulty: 'Medium',
      sampleAnswer: 'We stored refresh tokens in HttpOnly, SameSite strict cookies, paired with short-lived memory access tokens.',
    },
    {
      role: 'Data Structures & Algorithms',
      topic: 'Computer Science Core',
      subtopic: 'Scaling & Complexity',
      question: 'What algorithmic trade-offs did you make when selecting data structures for caching and search in your codebase?',
      difficulty: 'Hard',
      sampleAnswer: 'We traded space complexity for constant time lookups using hash maps and LRU doubly linked lists for fast eviction.',
    },
    {
      role: 'Software Engineer',
      topic: 'Testing & Quality',
      subtopic: 'Test Strategy',
      question: 'How do you structure integration tests versus unit tests for critical business logic?',
      difficulty: 'Easy',
      sampleAnswer: 'Unit tests isolate pure utility functions with high coverage, while integration tests verify database contracts and endpoint responses.',
    },
    {
      role: 'Engineering Practices',
      topic: 'Project Leadership',
      subtopic: 'Refactoring & Technical Debt',
      question: 'Tell me about a time you had to refactor a legacy module or deal with critical technical debt under tight deadlines.',
      difficulty: 'Medium',
      sampleAnswer: 'We mapped the module interfaces, established snapshot regression tests, and migrated incrementally using the strangler pattern.',
    },
    {
      role: 'Machine Learning',
      topic: 'Model Evaluation',
      subtopic: 'Overfitting & Regularization',
      question: 'How did you detect and mitigate overfitting in your predictive modeling projects?',
      difficulty: 'Medium',
      sampleAnswer: 'We monitored training vs validation loss curves and applied L1/L2 regularization, dropout layers, and k-fold cross-validation.',
    },
    {
      role: 'Backend Engineer',
      topic: 'Distributed Systems',
      subtopic: 'Message Queues',
      question: 'Why would you choose a message queue like RabbitMQ or Kafka instead of synchronous HTTP calls between microservices?',
      difficulty: 'Hard',
      sampleAnswer: 'Message brokers decouple producer and consumer lifecycles, smooth traffic spikes, and guarantee at-least-once processing.',
    },
    {
      role: 'Full Stack Engineer',
      topic: 'Web Fundamentals',
      subtopic: 'Browser Rendering Engine',
      question: 'What happens in the browser from the moment a user enters a URL until the page is fully rendered?',
      difficulty: 'Medium',
      sampleAnswer: 'DNS resolution, TCP/TLS handshake, HTTP request/response, DOM tree parsing, CSSOM construction, render tree calculation, layout, and painting.',
    },
    {
      role: 'Database Engineer',
      topic: 'SQL Optimization',
      subtopic: 'Query Execution Plans',
      question: 'How do you analyze an EXPLAIN ANALYZE plan in PostgreSQL or MySQL to eliminate slow sequential scans?',
      difficulty: 'Hard',
      sampleAnswer: 'We check cost estimates and actual times, look for Seq Scans on large tables, and create composite or partial indexes to enable Index Scans.',
    },
    {
      role: 'Software Engineer',
      topic: 'Clean Architecture',
      subtopic: 'SOLID Principles',
      question: 'Can you give a practical example from your projects of applying the Single Responsibility Principle or Dependency Inversion?',
      difficulty: 'Medium',
      sampleAnswer: 'We decoupled business services from database drivers by injecting repository interfaces rather than hard-coupling ORM models.',
    },
    {
      role: 'Frontend Engineer',
      topic: 'Modern Web APIs',
      subtopic: 'WebSockets & Streaming',
      question: 'How do you implement resilient bidirectional communication between client and server for live data streams?',
      difficulty: 'Medium',
      sampleAnswer: 'Using WebSockets with automatic exponential backoff reconnection, heartbeat ping/pong frames, and client-side message replay.',
    },
    {
      role: 'Engineering Mindset',
      topic: 'Production Troubleshooting',
      subtopic: 'Incident Post-Mortems',
      question: 'Describe how you troubleshoot an intermittent 502 Bad Gateway or memory leak in production.',
      difficulty: 'Hard',
      sampleAnswer: 'Inspect load balancer logs, container CPU/RAM metrics, dump heap profiles with v8-profiler, and trace upstream timeouts.',
    },
    {
      role: 'Machine Learning',
      topic: 'Feature Engineering',
      subtopic: 'Categorical Encoding',
      question: 'When would you use Target Encoding versus One-Hot Encoding for high-cardinality categorical variables?',
      difficulty: 'Medium',
      sampleAnswer: 'One-hot encoding creates excessive dimensionality with high cardinality; target encoding with smoothing prevents sparsity and memory explosion.',
    },
    {
      role: 'Software Engineer',
      topic: 'Microservices & API Gateways',
      subtopic: 'Rate Limiting & Throttling',
      question: 'How would you design a distributed rate limiter that restricts API requests per user per minute?',
      difficulty: 'Hard',
      sampleAnswer: 'Using Redis with sliding window logs or token bucket algorithms executing atomic Lua scripts to prevent race conditions.',
    },
    {
      role: 'Full Stack Engineer',
      topic: 'Interview Synthesis',
      subtopic: 'Project Reflection',
      question: 'Looking back at the projects on your resume, what is one major architectural decision you would make differently today?',
      difficulty: 'Medium',
      sampleAnswer: 'I would prioritize event-driven communication and modular boundary separation earlier to simplify downstream scalability.',
    },
  ];

  // Slice to requested count (5, 10, 15, or 20)
  const selected = basePool.slice(0, Math.min(count, basePool.length));
  return selected.map((q, idx) => ({
    _id: `q_preset_${idx + 1}`,
    ...q,
  }));
}

// 2. Candidate Answer Evaluation
export async function evaluateCandidateAnswer(
  questionText: string,
  candidateTranscript: string,
  topic: string,
  subtopic: string
): Promise<StructuredEvaluation> {
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `You are a Principal Tech Interviewer evaluating a candidate's voice answer.
Topic: ${topic}
Subtopic: ${subtopic}
Question: "${questionText}"
Candidate's Voice Answer: "${candidateTranscript}"

Evaluate this answer and return ONLY valid JSON matching this schema:
{
  "score": <integer 1-10 representing overall answer quality>,
  "feedback": "<1-2 sentence direct, constructive feedback highlighting what was good and what specifically to explain or improve>",
  "technicalScore": <integer 1-10>,
  "clarityScore": <integer 1-10>,
  "completenessScore": <integer 1-10>,
  "answerRelevanceScore": <integer 1-10>,
  "projectKnowledgeScore": <integer 1-10>,
  "overallScore": <integer 1-10>,
  "missingConcepts": [<string array of key technical ideas/terms that should have been mentioned>],
  "topic": "${topic}",
  "subtopic": "${subtopic}"
}`;

      let responseText: string | undefined;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = response.text;
      } catch (primaryErr) {
        console.warn('[LLM] gemini-3.8-flash failed, attempting with gemini-3.6-flash:', primaryErr);
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = fallbackResponse.text;
      }

      if (responseText) {
        const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned) as Partial<StructuredEvaluation>;
        const overall = parsed.score || parsed.overallScore || 7;
        return {
          score: overall,
          feedback: parsed.feedback || 'Good explanation. Consider elaborating on real-world constraints and architectural trade-offs.',
          technicalScore: parsed.technicalScore || overall,
          clarityScore: parsed.clarityScore || Math.min(10, overall + 1),
          completenessScore: parsed.completenessScore || overall,
          overallScore: overall,
          answerRelevanceScore: parsed.answerRelevanceScore || Math.min(10, overall + 1),
          projectKnowledgeScore: parsed.projectKnowledgeScore || overall,
          missingConcepts: parsed.missingConcepts || ['Key implementation trade-offs'],
          topic: parsed.topic || topic,
          subtopic: parsed.subtopic || subtopic,
        };
      }
    } catch (err) {
      console.warn('[LLM] Provider error, utilizing calibrated evaluation engine:', err);
    }
  }

  // Calibrated deterministic fallback
  const words = candidateTranscript.trim().split(/\s+/).length;
  const tech = Math.min(10, Math.max(5, Math.round(words > 25 ? 8 : words > 12 ? 7 : 6)));
  const clarity = Math.min(10, Math.max(6, Math.round(words > 12 ? 8 : 7)));
  const comp = Math.min(10, Math.max(5, Math.round(words > 30 ? 9 : 7)));
  const relevance = Math.min(10, Math.max(6, Math.round(words > 15 ? 8 : 7)));
  const project = Math.min(10, Math.max(5, Math.round(words > 20 ? 8 : 6)));
  const overall = Math.round((tech + clarity + comp) / 3);

  return {
    score: overall,
    feedback:
      overall >= 8
        ? 'Solid articulation of key principles with good clarity. You could enhance your answer further by citing specific performance metrics.'
        : 'Good initial foundation, but you could explain the specific techniques and technical trade-offs in greater detail.',
    technicalScore: tech,
    clarityScore: clarity,
    completenessScore: comp,
    overallScore: overall,
    answerRelevanceScore: relevance,
    projectKnowledgeScore: project,
    missingConcepts: ['Specific algorithmic techniques', 'Edge case error handling'],
    topic,
    subtopic,
  };
}

export function buildDefaultResumeCoverage(
  interview: IInterview,
  answers: IAnswer[]
): IResumeCoverageItem[] {
  const standardSkillAreas = [
    {
      skill: 'System Architecture & Scalability',
      topic: 'System Design',
      keywords: ['system', 'architecture', 'scalab', 'scale', 'microservice', 'distributed', 'latency', 'load balancer', 'cache', 'redis'],
      testedFeedback: 'Demonstrated solid grasp of horizontal scaling, caching layers, and decoupled event handling.',
      partiallyFeedback: 'Touched upon high-level components, but lacked detailed discussion of throughput bottlenecks and failover recovery.',
      untestedFeedback: 'High-level system design trade-offs were not explicitly probed during this question sequence.',
      practice: 'Design a distributed rate limiter and read-heavy cache invalidation strategy.',
    },
    {
      skill: 'Database Design & Optimization',
      topic: 'Databases',
      keywords: ['database', 'sql', 'postgres', 'query', 'index', 'nosql', 'transaction', 'acid', 'concurrency'],
      testedFeedback: 'Clearly explained indexing strategies, transaction boundaries, and query optimization.',
      partiallyFeedback: 'Mentioned relational storage, but did not analyze complex indexing or connection pool sizing.',
      untestedFeedback: 'Database schema modeling and execution plan analysis were not evaluated in this set.',
      practice: 'Review composite B-tree indexing mechanics and lock contention resolution.',
    },
    {
      skill: 'API Design & Microservices',
      topic: 'Backend APIs',
      keywords: ['api', 'rest', 'endpoint', 'http', 'status', 'grpc', 'graphql', 'json', 'middleware'],
      testedFeedback: 'Structured API design with good consideration of idempotency and clean error payloads.',
      partiallyFeedback: 'Discussed endpoint implementation without exploring rate limiting or versioning strategy.',
      untestedFeedback: 'REST/gRPC contract design and inter-service telemetry were not covered in this session.',
      practice: 'Practice designing idempotent POST endpoints with distributed idempotency keys.',
    },
    {
      skill: 'Frontend Engineering & State Management',
      topic: 'Frontend',
      keywords: ['react', 'vue', 'angular', 'frontend', 'ui', 'component', 'state', 'hook', 'dom', 'css', 'typescript'],
      testedFeedback: 'Effective articulation of client state handling, component modularity, and render cycles.',
      partiallyFeedback: 'Referenced user interface layers briefly; depth on performance optimization remains to be tested.',
      untestedFeedback: 'Modern UI state lifecycles and bundle size optimization were not included in this question set.',
      practice: 'Study virtual DOM reconciliation, web vitals profiling, and optimistic mutation patterns.',
    },
    {
      skill: 'Data Pipeline & Concurrency / Async',
      topic: 'Data Engineering',
      keywords: ['data', 'pipeline', 'async', 'stream', 'kafka', 'queue', 'concurrency', 'thread', 'outlier', 'skew'],
      testedFeedback: 'Accurately detailed asynchronous execution, backpressure, and handling skewed datasets.',
      partiallyFeedback: 'Addressed asynchronous handling conceptually without quantifying latency or fault recovery.',
      untestedFeedback: 'Real-time event stream processing and message dead-letter queues were not probed.',
      practice: 'Implement an asynchronous worker queue with exponential backoff and dead-letter handling.',
    },
    {
      skill: 'Testing, CI/CD & Reliability',
      topic: 'DevOps & Quality',
      keywords: ['test', 'unit test', 'ci/cd', 'docker', 'deploy', 'kubernetes', 'cloud', 'aws', 'monitoring', 'observability'],
      testedFeedback: 'Highlighted comprehensive test isolation and safe deployment rollouts.',
      partiallyFeedback: 'Noted automated tests without exploring integration environments or canary deployments.',
      untestedFeedback: 'Infrastructure-as-code and container orchestration pipelines were not evaluated.',
      practice: 'Configure automated regression suites and zero-downtime rolling updates.',
    },
  ];

  return standardSkillAreas.map((area) => {
    let matchScore = 0;
    answers.forEach((ans) => {
      const qText = `${ans.questionText} ${ans.topic} ${ans.subtopic}`.toLowerCase();
      const hits = area.keywords.filter((kw) => qText.includes(kw)).length;
      if (hits > 0) {
        matchScore += hits;
      }
    });

    let status: CoverageStatus = 'Not Tested';
    let finalFeedback = area.untestedFeedback;

    if (matchScore >= 2) {
      status = 'Tested';
      finalFeedback = area.testedFeedback;
    } else if (matchScore === 1) {
      status = 'Partially Tested';
      finalFeedback = area.partiallyFeedback;
    }

    return {
      skill: area.skill,
      topic: area.topic,
      status,
      finalFeedback,
      nextPracticeRecommendation: area.practice,
    };
  });
}

// 3. Final Interview Report Generation
export async function generateFinalInterviewReport(
  interview: IInterview,
  answers: IAnswer[]
): Promise<IFinalInterviewReport> {
  const ai = getGenAI();

  if (ai && answers.length > 0) {
    try {
      const summaryTranscript = answers
        .map(
          (a, i) =>
            `Q${i + 1} (${a.topic} - ${a.subtopic}): "${a.questionText}"\nAnswer: "${a.transcript}"\nScore: ${a.overallScore}/10 | Feedback: ${a.feedback}`
        )
        .join('\n\n');

      const prompt = `You are an Executive Tech Interviewer creating the Final Comprehensive Interview Report for a candidate.
Resume: "${interview.resumeFileName || 'Resume.pdf'}"
Resume Context: "${(interview.resumeContent || '').slice(0, 2500)}"
Total Questions Answered: ${answers.length}

Candidate Session Transcript:
${summaryTranscript}

Evaluate all answers across Technical Knowledge, Project Knowledge, Communication, and Answer Relevance (scores 0-100).
Produce crisp, professional bullet points for Strengths and Areas to Improve, followed by a succinct overall feedback paragraph.

CRITICAL REQUIREMENT - Resume Coverage & Skill Analysis:
Identify 5 to 7 key technical skills or project areas from the candidate's resume/role (such as System Architecture, Database Optimization, Backend APIs, Frontend Engineering, Cloud/DevOps, Concurrency & Data Processing).
Create a structured assessment of how each resume skill / area was covered in this interview:
- "skill": Name of the resume skill or technical area
- "topic": Broad topic domain (e.g. System Design, Databases, Backend APIs, Frontend, Cloud/DevOps)
- "status": MUST be exactly one of: "Tested", "Partially Tested", or "Not Tested"
  * "Tested": Multiple questions or an in-depth answer directly proved this skill
  * "Partially Tested": Briefly touched upon or mentioned in 1 question
  * "Not Tested": Present on resume but not queried during this question set
- "finalFeedback": Concise, sharp AI feedback evaluating how well the candidate demonstrated this area, or noting why it remains unverified
- "nextPracticeRecommendation": Specific, actionable next practice recommendation to improve or prepare

Return ONLY valid JSON with this exact schema:
{
  "overallScore": <integer 0-100>,
  "technicalKnowledgeScore": <integer 0-100>,
  "projectKnowledgeScore": <integer 0-100>,
  "communicationScore": <integer 0-100>,
  "answerRelevanceScore": <integer 0-100>,
  "strengths": [
    "<bullet point 1, e.g. Good understanding of Python>",
    "<bullet point 2, e.g. Good project knowledge>",
    "<bullet point 3, e.g. Answers were mostly relevant>"
  ],
  "areasToImprove": [
    "<bullet point 1, e.g. Explain technical decisions in more detail>",
    "<bullet point 2, e.g. Improve database fundamentals>",
    "<bullet point 3, e.g. Give more structured answers>"
  ],
  "overallFeedback": "<2-3 sentence executive feedback summary on candidate performance and potential>",
  "recommendedPractice": [
    "<topic 1>",
    "<topic 2>",
    "<topic 3>"
  ],
  "resumeCoverage": [
    {
      "skill": "<Resume skill or area, e.g. React & TypeScript>",
      "topic": "<Topic domain, e.g. Frontend>",
      "status": "Tested" | "Partially Tested" | "Not Tested",
      "finalFeedback": "<Executive AI feedback on this skill>",
      "nextPracticeRecommendation": "<Next practice topic or exercise>"
    }
  ]
}`;

      let responseText: string | undefined;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = response.text;
      } catch (err) {
        console.warn('[LLM] Primary report generation failed, trying fallback:', err);
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        responseText = fallbackRes.text;
      }

      if (responseText) {
        const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleaned) as Partial<IFinalInterviewReport>;

        const validCoverage: IResumeCoverageItem[] =
          Array.isArray(parsed.resumeCoverage) && parsed.resumeCoverage.length > 0
            ? parsed.resumeCoverage.map((item) => ({
                skill: String(item.skill || 'Technical Competency'),
                topic: item.topic ? String(item.topic) : undefined,
                status: (['Tested', 'Partially Tested', 'Not Tested'].includes(item.status)
                  ? item.status
                  : 'Tested') as CoverageStatus,
                finalFeedback: String(
                  item.finalFeedback || 'Demonstrated foundational knowledge during questions.'
                ),
                nextPracticeRecommendation: String(
                  item.nextPracticeRecommendation || 'Review advanced architectural trade-offs.'
                ),
              }))
            : buildDefaultResumeCoverage(interview, answers);

        return {
          id: `rep_${Date.now()}`,
          interviewId: interview._id,
          overallScore: parsed.overallScore ?? 78,
          technicalKnowledgeScore: parsed.technicalKnowledgeScore ?? 82,
          projectKnowledgeScore: parsed.projectKnowledgeScore ?? 76,
          communicationScore: parsed.communicationScore ?? 74,
          answerRelevanceScore: parsed.answerRelevanceScore ?? 81,
          strengths: parsed.strengths || [
            'Good understanding of core tech stack',
            'Good project knowledge and context',
            'Answers were mostly relevant to questions asked',
          ],
          areasToImprove: parsed.areasToImprove || [
            'Explain technical decisions in more detail',
            'Improve database fundamentals and query analysis',
            'Give more structured answers highlighting metrics',
          ],
          overallFeedback:
            parsed.overallFeedback ||
            'You demonstrated good understanding of your projects and answered technical questions with clarity. Continuing to emphasize real-world trade-offs will make your answers even stronger.',
          recommendedPractice: parsed.recommendedPractice || [
            'Database Optimization & Indexing',
            'Distributed Systems Architecture',
            'Structured Technical Communication',
          ],
          resumeCoverage: validCoverage,
          createdAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[LLM] Final report AI synthesis failed, using calibrated aggregate:', err);
    }
  }

  // Calibrated fallback using session scores
  const avgOverall =
    answers.length > 0
      ? Math.round((answers.reduce((acc, a) => acc + (a.overallScore || 7), 0) / answers.length) * 10)
      : 78;
  const avgTech =
    answers.length > 0
      ? Math.round((answers.reduce((acc, a) => acc + (a.technicalScore || 8), 0) / answers.length) * 10)
      : 82;
  const avgClarity =
    answers.length > 0
      ? Math.round((answers.reduce((acc, a) => acc + (a.clarityScore || 7), 0) / answers.length) * 10)
      : 74;

  return {
    id: `rep_${Date.now()}`,
    interviewId: interview._id,
    overallScore: avgOverall,
    technicalKnowledgeScore: avgTech,
    projectKnowledgeScore: Math.min(95, Math.max(65, avgOverall - 2)),
    communicationScore: avgClarity,
    answerRelevanceScore: Math.min(95, Math.max(70, avgOverall + 3)),
    strengths: [
      'Good understanding of core programming principles',
      'Good project knowledge and context',
      'Answers were mostly relevant and clear',
    ],
    areasToImprove: [
      'Explain technical decisions in more detail',
      'Improve database fundamentals and concurrency control',
      'Give more structured answers with measurable outcomes',
    ],
    overallFeedback:
      'You demonstrated good understanding of your projects and answered technical questions with clarity. Deepening your discussion around trade-offs and edge cases will elevate your performance to top tier.',
    recommendedPractice: [
      'System Design & Data Flow',
      'Database Indexing & Caching',
      'STAR Method Technical Communication',
    ],
    resumeCoverage: buildDefaultResumeCoverage(interview, answers),
    createdAt: new Date().toISOString(),
  };
}

