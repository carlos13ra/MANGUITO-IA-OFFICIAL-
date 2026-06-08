export default async function handler(req, res) {
  const API_KEY = process.env.GEMINI_API_KEY;
  const BASE_URL = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';

  if (!API_KEY) {
    return res.status(500).json({ text: "Error: GEMINI_API_KEY no configurada" });
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://manguito-ia.vercel.app',
        'X-Title': 'Manguito IA'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [{
          role: 'user',
          content: `Eres MANGUITO-IA. Responde directo y correcto. Pregunta: ${req.body.prompt}`
        }]
      })
    });

    const data = await response.json();

    // Si hay error de OpenRouter, lo mostramos
    if (data.error) {
      return res.status(500).json({ text: "Error OpenRouter: " + data.error.message });
    }

    if (!data.choices ||!data.choices[0]) {
      return res.status(500).json({ text: "Error: Respuesta vacía de OpenRouter. Data: " + JSON.stringify(data) });
    }

    const text = data.choices[0].message.content;
    res.json({ text });

  } catch(e) {
    res.status(500).json({ text: "Error conectando: " + e.message });
  }
}
