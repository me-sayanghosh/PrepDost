const {GoogleGenerativeAI} = require("@google/generative-ai");
const {z} = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

function getApiKey() {
    return String(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "").trim();
}

function getAiClient() {
    const apiKey = getApiKey();
    if (!apiKey) {
        const missingKeyError = new Error("Missing Gemini API key. Set GOOGLE_API_KEY (or GEMINI_API_KEY) in Backend/.env");
        missingKeyError.statusCode = 500;
        throw missingKeyError;
    }

    return new GoogleGenerativeAI(apiKey);
}

const GENERATION_MODELS = ["gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro", "gemini-1.5-flash"];

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isServiceUnavailableError(error) {
    const message = String(error?.message || "");
    return message.includes('"code":503') || message.includes('"status":"UNAVAILABLE"');
}

function isQuotaExceededError(error) {
    const message = String(error?.message || "");
    return message.includes('"code":429') || message.includes('"status":"RESOURCE_EXHAUSTED"') || message.toLowerCase().includes("quota exceeded");
}

function parseRetryAfterSeconds(error) {
    const message = String(error?.message || "");
    const retryDelayMatch = message.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
    if (retryDelayMatch) {
        return Number(retryDelayMatch[1]);
    }

    const retryInMatch = message.match(/retry\s+in\s+([\d.]+)s/i);
    if (retryInMatch) {
        return Math.ceil(Number(retryInMatch[1]));
    }

    return null;
}

function extractJsonPayload(text) {
    if (typeof text !== "string" || text.trim().length === 0) {
        throw new Error("AI response is empty");
    }

    const fencedJson = text.match(/```json\s*([\s\S]*?)\s*```/i);
    return fencedJson ? fencedJson[1] : text;
}




const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The match score between the candidate and the job description based on the resume and self declaration"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical questions asked in the interview"),
        intension: z.string().describe("The intention of the interviewer behind the question"),
        answer: z.string().describe("how to answer the question,what points to be covered in the answer, what approach to be taken to answer the question,etc."),
    })).describe("Technical questions that can be asked in the interview based on the job description and resume"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral questions asked in the interview"),
        intension: z.string().describe("The intention of the interviewer behind the question"),
        answer: z.string().describe("how to answer the question,what points to be covered in the answer, what approach to be taken to answer the question,etc."),
    })).describe("The behavioral questions that can be asked in the interview based on the job description and resume"),
    skillAssessments: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["Low", "Medium", "High"]).describe("The severity of the skill gap"),
    })).describe("The skill assessments that can be conducted in the interview based on the job description and resume"),
    preparationStrategy: z.array(z.object({
        day:z.number().describe("The day number of the preparation strategy"),
        focus: z.string().describe("The focus of the preparation strategy for the day"),
        task: z.string().describe("The task to be completed for the day"),
    })).describe("The preparation strategy for the interview based on the job description and resume"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
});

function toTitleSeverity(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized === "low") return "Low";
    if (normalized === "medium") return "Medium";
    if (normalized === "high") return "High";
    return "Medium";
}

function cleanText(value, fallback) {
    const text = String(value ?? "").trim();
    return text.length > 0 ? text : fallback;
}

function normalizeReportShape(input) {
    const report = input && typeof input === "object" ? input : {};

    const technicalQuestions = Array.isArray(report.technicalQuestions)
        ? report.technicalQuestions.map((q, idx) => ({
            question: cleanText(
                q?.question || q?.prompt || q?.title,
                `Explain your approach for technical area #${idx + 1}.`
            ),
            intension: cleanText(
                q?.intension || q?.intention || q?.purpose,
                "Assess technical depth and structured problem-solving."
            ),
            answer: cleanText(
                q?.answer || q?.sampleAnswer || q?.guidance,
                "Give a concise, example-driven answer with trade-offs and measurable outcome."
            ),
        }))
        : [];

    const behavioralQuestions = Array.isArray(report.behavioralQuestions)
        ? report.behavioralQuestions.map((q, idx) => ({
            question: cleanText(
                q?.question || q?.prompt || q?.title,
                `Share a behavioral example relevant to competency #${idx + 1}.`
            ),
            intension: cleanText(
                q?.intension || q?.intention || q?.purpose,
                "Evaluate communication, ownership, and collaboration behaviors."
            ),
            answer: cleanText(
                q?.answer || q?.sampleAnswer || q?.guidance,
                "Answer in STAR format and include concrete impact metrics."
            ),
        }))
        : [];

    const skillAssessments = Array.isArray(report.skillAssessments)
        ? report.skillAssessments.map((s, idx) => ({
            skill: cleanText(
                s?.skill || s?.skillGap || s?.skillGaps || s?.name,
                `Core skill area #${idx + 1}`
            ),
            severity: toTitleSeverity(s?.severity),
        }))
        : [];

    const sourcePreparation = Array.isArray(report.preparationStrategy)
        ? report.preparationStrategy
        : Array.isArray(report.packagedPreparationStrategy)
            ? report.packagedPreparationStrategy
            : [];

    const preparationStrategy = sourcePreparation.map((p, idx) => ({
        day: Number(p?.day ?? idx + 1),
        focus: cleanText(p?.focus || p?.area, `Interview preparation focus for day ${idx + 1}`),
        task: cleanText(
            Array.isArray(p?.tasks) ? p.tasks.join("; ") : (p?.task || p?.action),
            "Review role fundamentals, practice one mock answer, and refine examples."
        ),
    }));

    return {
        title: cleanText(report.title, "Software Engineer"),
        matchScore: Number.isFinite(Number(report.matchScore)) ? Number(report.matchScore) : 0,
        technicalQuestions,
        behavioralQuestions,
        skillAssessments,
        preparationStrategy,
    };
}

function buildQuotaFallbackReport({ selfDeclaration, jobDescription }) {
    const combined = `${selfDeclaration || ""} ${jobDescription || ""}`.toLowerCase();
    const hasExperienceSignal = /(year|experience|worked|project|intern|developed|built)/.test(combined);
    const hasLeadershipSignal = /(lead|owner|mento|manage|team|collaborat)/.test(combined);

    return {
        title: "Software Engineer Default Role",
        matchScore: hasExperienceSignal ? 62 : 54,
        technicalQuestions: [
            {
                question: "Can you walk me through one relevant project from your resume and your exact contribution?",
                intension: "Assess hands-on ownership and technical depth.",
                answer: "Explain problem, architecture, stack choices, trade-offs, and measurable impact in STAR format.",
            },
            {
                question: "How would you design a scalable version of this role's core feature?",
                intension: "Evaluate system design thinking and scalability awareness.",
                answer: "Start with requirements, propose architecture, discuss bottlenecks, and mention monitoring/reliability.",
            },
            {
                question: "Describe a bug or production issue you solved and how you approached debugging.",
                intension: "Check troubleshooting approach and engineering discipline.",
                answer: "Share context, reproduction steps, root-cause analysis, fix, and prevention strategy.",
            },
        ],
        behavioralQuestions: [
            {
                question: "Tell me about a time you handled tight deadlines with multiple priorities.",
                intension: "Understand prioritization and time management behavior.",
                answer: "Use STAR and highlight prioritization framework, communication, and outcome.",
            },
            {
                question: "Describe a disagreement with a teammate and how you resolved it.",
                intension: "Assess collaboration and conflict-resolution skills.",
                answer: "Show empathy, evidence-based discussion, compromise, and team-first resolution.",
            },
            {
                question: "What feedback have you received recently and what did you change?",
                intension: "Measure growth mindset and coachability.",
                answer: "State feedback clearly, action taken, and observable improvement.",
            },
        ],
        skillAssessments: [
            {
                skill: "Role-specific domain depth",
                severity: hasExperienceSignal ? "Medium" : "High",
            },
            {
                skill: "System design communication",
                severity: "Medium",
            },
            {
                skill: "Behavioral storytelling with measurable outcomes",
                severity: hasLeadershipSignal ? "Low" : "Medium",
            },
        ],
        preparationStrategy: [
            { day: 1, focus: "Role & JD mapping", task: "Map 8-10 JD requirements to resume evidence with specific examples." },
            { day: 2, focus: "Project deep-dive", task: "Prepare one primary and one backup project story with architecture diagram." },
            { day: 3, focus: "Core technical revision", task: "Revise core concepts and prepare concise explanations for fundamentals." },
            { day: 4, focus: "Problem solving", task: "Practice 3-5 medium interview problems and explain thought process aloud." },
            { day: 5, focus: "Behavioral prep", task: "Draft STAR answers for leadership, conflict, failure, and achievement." },
            { day: 6, focus: "Mock interview", task: "Run a timed mock interview and identify weak areas for refinement." },
            { day: 7, focus: "Final polish", task: "Refine elevator pitch, questions for interviewer, and final checklist." },
        ],
    };
}

async function generateInterviewReport({resume, selfDeclaration, jobDescription}) {

    const ai = getAiClient();

        const prompt =`
        Generate an interview report for a candidate with the following details:
        - Resume: ${resume}
        - Self Declaration: ${selfDeclaration}
        - Job Description: ${jobDescription}

        Return only valid JSON using this exact structure and key names:
        {
            "title": string,
            "matchScore": number,
            "technicalQuestions": [{ "question": string, "intension": string, "answer": string }],
            "behavioralQuestions": [{ "question": string, "intension": string, "answer": string }],
            "skillAssessments": [{ "skill": string, "severity": "Low" | "Medium" | "High" }],
            "preparationStrategy": [{ "day": number, "focus": string, "task": string }]
        }
     `


    let response;
    let lastError;
    let lastQuotaRetryAfter = null;

    for (let attempt = 1; attempt <= 4; attempt += 1) {
        let shouldRetryAfterQuotaWindow = false;
        for (const model of GENERATION_MODELS) {
            try {
                // Determine whether calling from current official SDK @google/genai syntax or legacy @google/generative-ai
                const aiModel = ai.getGenerativeModel({ model: model });
                const result = await aiModel.generateContent(prompt);
                
                response = result.response;
                break;
            } catch (error) {
                lastError = error;
                if (isQuotaExceededError(error)) {
                    const retryAfter = parseRetryAfterSeconds(error);
                    lastQuotaRetryAfter = retryAfter;
                    // If Google provides a retry window, wait and retry instead of failing fast.
                    if (retryAfter && retryAfter <= 90 && attempt < 4) {
                        await wait(retryAfter * 1000);
                        shouldRetryAfterQuotaWindow = true;
                        break;
                    }

                    continue;
                }

                // If a model is not found (404) or completely unsupported for the tier, try the next fallback model.
                if (error.status === 404 || String(error.message).includes("404") || String(error.message).includes("not found")) {
                    continue;
                }

                // Let it loop and try the next model instead of throwing immediately.
                continue;
            }
        }

        if (response) {
            break;
        }

        if (!shouldRetryAfterQuotaWindow) {
            break;
        }
    }

    if (!response) {
        console.warn("AI Generation failed entirely, falling back to local heuristic reporting.", lastError?.message || lastError);
        return interviewReportSchema.parse(normalizeReportShape(buildQuotaFallbackReport({ selfDeclaration, jobDescription })));
    }

    let parsedReport;
    try {
        const rawText = extractJsonPayload(response.text());
        parsedReport = JSON.parse(rawText);
    } catch (parseError) {
        console.error("Failed to parse AI JSON response:", parseError);
        return interviewReportSchema.parse(normalizeReportShape(buildQuotaFallbackReport({ selfDeclaration, jobDescription })));
    }
}

module.exports = { generateInterviewReport }
