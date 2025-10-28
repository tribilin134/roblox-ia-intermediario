// ¡Usamos la nueva librería de Groq!
import Groq from 'groq-sdk';

// Inicializamos el cliente de Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Esta es la función principal que Vercel ejecutará
export default async function handler(req, res) {

  // Solo permitimos peticiones de tipo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 1. Obtenemos el "prompt" que Roblox nos envía
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "No se proporcionó un 'prompt'" });
    }

    // 2. Hacemos la llamada a la API de Groq
    // Usamos 'llama3-8b-8192', un modelo súper rápido
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user', // Pasamos todo el prompt (reglas + contexto + pregunta) como un solo mensaje
          content: prompt,
        },
      ],
      model: 'llama3-8b-8192',
    });

    // 3. Obtenemos la respuesta
    const reply = completion.choices[0]?.message?.content || "No pude pensar en una respuesta.";

    // 4. Enviamos la respuesta de la IA de vuelta a Roblox
    res.status(200).json({ reply: reply });

  } catch (error) {
    // 5. Si algo sale mal, informamos el error
    console.error(error);
    res.status(500).json({ error: "Error al contactar la IA (Groq)" });
  }
}
