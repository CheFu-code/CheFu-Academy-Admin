import { Content } from "@/types/ai";

export const GenerateTopicsAIModel = [
    {
        role: "user",
        parts: [
            {
                text: `Learn Python: As you are coaching teacher
    - User want to learn about the topic
    - Generate 5-7 Course title for study (Short)
    - Make sure it is related to description
    - Output will be ARRAY of String in JSON FORMAT only
    - Do not add any plain text in output,
    `,
            },
        ],
    },
    {
        role: "model",
        parts: [
            {
                text: `\`\`\`json
[
  "Python Basics: A Gentle Introduction",
  "Data Structures & Algorithms in Python",
  "Object-Oriented Programming with Python",
  "Web Development with Python & Flask",
  "Data Science with Python: NumPy & Pandas",
  "Machine Learning with Python: scikit-learn",
  "Automating Tasks with Python"
]
\`\`\``,
            },
        ],
    },
    {
        role: "user",
        parts: [
            {
                text: `INSERT_INPUT_HERE`,
            },
        ],
    },
];

export async function generateTopics(contents: Content[]): Promise<string> {
    return generateAIContent(contents);
}

export async function generateCourse(contents: Content[]): Promise<string> {
    return generateAIContent(contents);
}

async function generateAIContent(contents: Content[]): Promise<string> {
    const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contents }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Failed to generate AI content');
    }

    return data.result || '';
}
