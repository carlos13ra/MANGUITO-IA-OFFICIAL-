export default async function handler(req, res) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ text: "Error: API Key no configurada en Vercel" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Eres MANGUITO-IA. Responde TODO directo, correcto y verificado como ChatGPT o Gemini. Si es matemática calcula bien y muestra pasos. Si es código da código funcional. Si es tarea explica fácil. Pregunta: ${req.body.prompt}`
          }]
        }]
      })
    });

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    res.json({ text });

  } catch(e) {
    res.status(500).json({ text: "Error conectando con Gemini" });
  }
}
