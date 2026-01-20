// List of known AI/LLM domains for Shadow AI Detection
// Format: Domain -> { name, risk, type }

const AI_DOMAINS = {
    // OpenAI
    'openai.com': { name: 'Chat GPT (OpenAI)', risk: 'HIGH', type: 'Generative AI', sanctioned: false },
    'api.openai.com': { name: 'OpenAI API', risk: 'MEDIUM', type: 'API', sanctioned: false },
    'chat.openai.com': { name: 'ChatGPT Web', risk: 'HIGH', type: 'Generative AI', sanctioned: false },

    // Google
    'bard.google.com': { name: 'Google Bard', risk: 'HIGH', type: 'Generative AI', sanctioned: false },
    'gemini.google.com': { name: 'Google Gemini', risk: 'HIGH', type: 'Generative AI', sanctioned: false },

    // Anthropic
    'anthropic.com': { name: 'Claude (Anthropic)', risk: 'MEDIUM', type: 'Generative AI', sanctioned: false },
    'claude.ai': { name: 'Claude Web', risk: 'HIGH', type: 'Generative AI', sanctioned: false },

    // HuggingFace
    'huggingface.co': { name: 'HuggingFace', risk: 'MEDIUM', type: 'Model Repository', sanctioned: false },

    // Others
    'midjourney.com': { name: 'Midjourney', risk: 'MEDIUM', type: 'Image Gen', sanctioned: false },
    'jasper.ai': { name: 'Jasper AI', risk: 'HIGH', type: 'Content Gen', sanctioned: false },
    'copy.ai': { name: 'Copy.ai', risk: 'HIGH', type: 'Content Gen', sanctioned: false },
    'quillbot.com': { name: 'Quillbot', risk: 'LOW', type: 'Paraphrasing', sanctioned: true }, // Example sanctioned
    'grammarly.com': { name: 'Grammarly', risk: 'LOW', type: 'Writing Asst', sanctioned: true },

    // AWS (Often Sanctioned)
    'bedrock.us-east-1.amazonaws.com': { name: 'AWS Bedrock', risk: 'LOW', type: 'Infrastructure', sanctioned: true },
    'sagemaker.us-east-1.amazonaws.com': { name: 'AWS SageMaker', risk: 'LOW', type: 'ML Ops', sanctioned: true }
};

module.exports = AI_DOMAINS;
