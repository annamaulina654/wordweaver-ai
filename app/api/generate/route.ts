import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: Request) {
  const { description, platform } = await request.json();

  const prompt = `Create a caption for the ${platform} platform based on the following description: "${description}". Make the caption engaging, concise, and include some relevant hashtags.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
    });

    const result = chatCompletion.choices[0]?.message?.content || 'Sorry, an error occurred.';
    return new Response(JSON.stringify({ result }), { status: 200 });

  } catch (error) {
    console.error('Groq API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to contact the AI service' }), { status: 500 });
  }
}
