export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method!== 'POST') {
    return res.status(405).json({ text: "Solo POST" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ text: "❌ Error: GEMINI_API_KEY no configurada en Vercel" });
  }

  const userPrompt = req.body.prompt || req.body.message;

  if (!userPrompt) {
    return res.status(400).json({ text: "❌ Error: No enviaste pregunta" });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          role: 'system',
          content: 'Eres MANGUITO-IA. Responde TODO directo, correcto y verificado. Si es matemática calcula bien y muestra pasos. Si es código da código funcional. Si es tarea explica fácil. Sé breve.'
        },{
          role: 'user',
          content: userPrompt
        }]
      })
    });

    const data = await response.json();

    // Si OpenRouter devuelve error
    if (data.error) {
      return res.status(500).json({ text: `❌ Error OpenRouter: ${data.error.message}` });
    }

    // Si no hay respuesta
    if (!data.choices ||!data.choices[0] ||!data.choices[0].message) {
      return res.status(500).json({ text: `❌ Respuesta vacía. Debug: ${JSON.stringify(data)}` });
    }

    const text = data.choices[0].message.content;
    res.status(200).json({ text });

  } catch(e) {
    res.status(500).json({ text: `❌ Error de conexión: ${e.message}` });
  }
}
