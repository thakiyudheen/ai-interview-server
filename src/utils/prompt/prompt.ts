import { ISession } from "../../model/session-model";

type ConceptPrompt = (question: string) => string;

type TQAQuestionPrompt = (propmt: ISession) => string;

export const conceptExplainPrompt: ConceptPrompt = (question) => `
You are an AI trained to generate explanations for a given interview question.

Task:
- Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
- Question: "${question}"
- After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
- If the explanation includes a code example, provide a small code block.
- Keep the formatting very clean and clear.
- Return the result as a valid JSON object in the following format:

{
  "title": "Short title here?",
  "explanation": "Explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;
export const questionAnswerPrompt: TQAQuestionPrompt = ({
  role,
  experience,
  topicsToFocus,
  noOfQuestions,
}) => `
You are an AI that generates high-quality technical interview QUESTIONS ONLY.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Generate exactly ${noOfQuestions} interview QUESTIONS.
- Each question should be clear, relevant, and difficulty matched to experience level.
- Do NOT include answers.
- Do NOT include numbering.
- Do NOT include explanations.

Return ONLY a pure JSON array of strings like:

[
  "Question 1 here",
  "Question 2 here",
  ...
]

Important:
- No extra text.
- No markdown.
- No comments.
- Only valid JSON array of strings.
`;


export const interviewFeedbackPrompt = (conversation: string) => `
You are an expert AI technical interviewer.

Analyze the entire INTERVIEW CONVERSATION below:

--- START OF CONVERSATION ---
${conversation}
--- END OF CONVERSATION ---

Your task:
Evaluate the candidate’s performance ONLY based on the conversation.
You must judge suitability WITHOUT needing any job role.

Return feedback ONLY in the following strict JSON format:

{
  "communication": {
    "score": number (0-10),
    "feedback": string
  },
  "technical": {
    "score": number (0-10),
    "feedback": string
  },
  "strengths": [ "string", ... ],
  "mistakes": [ "string", ... ],
  "improvements": [ "string", ... ],
  "finalRating": number (0-10),
  "verdict": "Accepted" | "Rejected",
  "summary": "2-4 line short summary"
}

Rules:
- Be extremely honest and detailed.
- If the conversation is weak or incomplete, reduce points.
- Communication score = clarity, confidence, structure.
- Technical score = accuracy, depth, correctness.
- finalRating = (communication + technical) / 2.
- verdict = "Accepted" if finalRating >= 6.5, else "Rejected".
`;
