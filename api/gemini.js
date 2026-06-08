export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ text: "Solo POST" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ text: "❌ Error: GEMINI_API_KEY no configurada" });
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
        model: 'meta-llama/llama-3.1-8b-instruct:free', // ← MODELO QUE SÍ FUNCIONA
        messages: [{
          role: 'system',
          content: 'Eres MANGUITO-IA. Responde TODO directo, correcto y verificado. Si es matemática calcula bien y muestra pasos. Sé breve.'
        },{
          role: 'user',
          content: userPrompt
        }]
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(500).json({ text: `❌ Error OpenRouter: ${data.error.message}` });
    }
    if (!data.choices ||!data.choices[0]) {
      return res.status(500).json({ text: `❌ Respuesta vacía` });
    }

    res.status(200).json({ text: data.choices[0].message.content });

  } catch(e) {
    res.status(500).json({ text: `❌ Error: ${e.message}` });
  }
}
