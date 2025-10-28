// Importamos la librería de Google AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Obtenemos nuestra API Key secreta desde las variables de entorno de Vercel
// ¡NUNCA escribas la clave directamente aquí!
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Esta es la función principal que Vercel ejecutará
export default async function handler(req, res) {

  // Solo permitimos peticiones de tipo POST (que envían datos)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // 1. Obtenemos el "prompt" (el mensaje) que Roblox nos envía
    // Nos aseguramos de que el cuerpo de la petición sea parseado como JSON
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const prompt = body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "No se proporcionó un 'prompt'" });
    }

    // 2. Inicializamos el modelo de IA (usamos "flash" que es el más rápido)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // 3. Enviamos el prompt a la IA y esperamos el resultado
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Enviamos la respuesta de la IA de vuelta a Roblox
    res.status(200).json({ reply: text });

  } catch (error) {
    // 5. Si algo sale mal, informamos el error
    console.error(error);
    res.status(500).json({ error: "Error al contactar la IA" });
  }
}
