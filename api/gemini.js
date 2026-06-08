export default async function handler(req, res) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const BASE_URL = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';

  if (!API_KEY) {
    return res.status(500).json({ text: "Error: API Key no configurada en Vercel" });
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{
          role: 'user',
          content: `Eres MANGUITO-IA. Responde TODO directo, correcto y verificado como ChatGPT o Gemini. Si es matemática calcula bien y muestra pasos. Si es código da código funcional. Si es tarea explica fácil. Pregunta: ${req.body.prompt}`
        }]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;
    res.json({ text });

  } catch(e) {
    res.status(500).json({ text: "Error conectando con Manguito: " + e.message });
  }
}
