const express = require('express');
const bodyParser = require('body-parser');
// const { Configuration, OpenAIApi } = require('openai');
const OpenAIApi = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);
const openai = new OpenAIApi({
  api_key: process.env.OPENAI_API_KEY
});

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.createCompletion({
      model: 'gpt-4o', // Use your fine-tuned model ID here after fine-tuning
      prompt: prompt,
      max_tokens: 100,
    });
    res.json({ response: response.data.choices[0].text });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
