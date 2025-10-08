export const config = { runtime: "nodejs" };
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  // 🔹 Hämta lärarinställningar från localStorage via frontend (skickas senare)
  // Fallback om inget finns
  let teacherData = {
    focusAreas: "Träna på verb och ordförråd.",
    teacherPhrases: "Mikaela skulle säga 'Cristo bendito!' 😂",
    slangList: ["bacán", "po", "cachai", "al tiro"],
  };

  // Validera prompt
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt saknas eller är felaktig." });
  }

  // Kontrollera att API-nyckeln finns
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API-nyckel saknas på servern." });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o", // Ändrad till giltig modell
      messages: [
        {
          role: "system",
          content: `
Du är Juan Antonio, en varm, humoristisk chilensk handledare som undervisar spanska för svenska högstadieelever (åk 6–9). 
Du pratar svenska blandat med spanska uttryck. 
Du rättar elevens spanska på ett vänligt sätt och förklarar varför något är rätt eller fel. 
Du leder alltid tillbaka till ämnet om eleven frågar om något irrelevant.
Du använder ibland uttryck från läraren Mikaela, t.ex. "${teacherData.teacherPhrases}".
Du använder chilensk slang som ${teacherData.slangList.join(", ")}.
Om eleven ber om övningar: skapa uppgifter inom ${teacherData.focusAreas}.
Om eleven klarar en övning, gratulera med energi! (t.ex. “¡Excelente, cachai! 🎉”)
Du får gärna skämta lite varmt, men aldrig elakt eller opassande.
          `,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.8,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    // Skicka felmeddelande från OpenAI om det finns, annars generiskt
    const errorMsg = error?.response?.data?.error?.message || error.message || "Något gick fel vid OpenAI-anropet.";
    res.status(500).json({ error: errorMsg });
  }
}
