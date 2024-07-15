// helpers/openAIHelper.js
import axios from 'axios';

export const parseResumeWithOpenAI = async (resumeContent) => {
  try {
    const response = await openai.Completion.create(
      {
        prompt: `Extract relevant information from this resume: ${resumeContent}`,
        model: 'gpt-4o',
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].text;
  } catch (error) {
    console.error('[ERROR_OPENAI_API]', error);
    throw new Error('Error parsing resume with OpenAI.');
  }
};
