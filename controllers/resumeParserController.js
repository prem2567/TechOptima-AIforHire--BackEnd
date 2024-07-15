import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
});

const MAX_TOKENS = 250;  // Set to a safe value below the maximum limit

const splitText = (text, maxLength) => {
    const parts = [];
    let currentIndex = 0;
    while (currentIndex < text.length) {
        parts.push(text.slice(currentIndex, currentIndex + maxLength));
        currentIndex += maxLength;
    }
    return parts;
};

const cleanJSON = (text) => {
    return text.replace(/```json/g, '').replace(/```/g, '');
};

export const parseResume = async (req, res) => {
    const { resumeContent } = req.body;

    if (!resumeContent) {
        return res.status(400).json({ message: 'Resume content is required.' });
    }

    console.log('Received resume content:', resumeContent);

    const resumeParts = splitText(resumeContent, MAX_TOKENS);

    try {
        const parsedResults = [];

        for (const part of resumeParts) {
            const parsedData = await openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'system', content: `Extract the name, email, phone, experience, and skills from the following resume and format it as JSON:\n\n${part}` }],
            });

            if (!parsedData || !parsedData.choices || !parsedData.choices[0] || !parsedData.choices[0].message) {
                console.log('Parsed data structure is unexpected:', parsedData);
                return res.status(500).json({ message: 'Unexpected response from OpenAI' });
            }

            let response = parsedData.choices[0].message.content;
            console.log('Raw OpenAI Response:', response);

            response = cleanJSON(response);

            try {
                const parsedResume = JSON.parse(response);
                parsedResults.push(parsedResume);
            } catch (jsonError) {
                console.error('[ERROR_PARSE_RESUME_JSON]', jsonError);
                return res.status(500).json({ message: 'Error parsing JSON from OpenAI response', rawResponse: response });
            }
        }

        // Merge parsed results if necessary
        const mergedResult = parsedResults.reduce((acc, curr) => {
            // Customize merging logic based on your data structure
            return {
                name: acc.name || curr.name,
                email: acc.email || curr.email,
                phone: acc.phone || curr.phone,
                experience: (acc.experience || []).concat(curr.experience || []),
                skills: (acc.skills || []).concat(curr.skills || [])
            };
        }, {});

        res.status(200).json(mergedResult);
    } catch (error) {
        console.error('[ERROR_PARSE_RESUME]', error);
        res.status(500).json({ message: 'Something went wrong while parsing the resume.' });
    }
};
