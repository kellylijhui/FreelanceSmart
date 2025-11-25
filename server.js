import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenAI from 'openai';

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.post('/api/analyze-work', upload.single('image'), async (req, res) => {
  try {
    if (!openai) {
      return res.status(503).json({ 
        error: 'AI service not configured. Please add your OpenAI API key.' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    const projectType = req.body.projectType || 'general creative work';

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an expert freelance pricing consultant. Analyze the uploaded image of creative work and suggest appropriate hourly rates based on the quality, complexity, and market standards. Consider:
- Quality and professionalism of the work
- Technical complexity
- Industry standards for ${projectType}
- Time likely invested

Respond with JSON in this exact format:
{
  "suggestedHourlyRate": number (between 25-250),
  "rateRange": { "min": number, "max": number },
  "qualityAssessment": "string describing quality level",
  "reasoning": "brief explanation of why you suggest this rate",
  "skillLevel": "beginner" | "intermediate" | "advanced" | "expert"
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this ${projectType} sample and suggest an appropriate hourly rate for the creator.`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    res.json(analysis);

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ 
      error: 'Failed to analyze image', 
      details: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', aiConfigured: !!openai });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running on port ${PORT}`);
  if (!openai) {
    console.log('Warning: OPENAI_API_KEY not set. AI features will be unavailable.');
  }
});
