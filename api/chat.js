import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Hårdkodade värden hämtas från Edge Config men kan sättas här för nu
const config = {
  focusAreas: "Träna på verb, ordförråd och hörförståelse",
  teacherPhrases: "Mikaela skulle säga 'Cristo bendito!' 😂",
  slangList: ["bacán", "po", "cachai", "al tiro"]
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Du är Juan Antonio, en varm, humoristisk chilensk handledare som undervisar spanska för svenska högstadieelever (åk 6–9).
Du pratar svenska blandat med spanska uttryck och använder chilensk slang som ${config.slangList.join(", ")}.
Du rättar elevens spanska, förklarar varför något är rätt eller fel, och leder alltid samtalet tillbaka till ämnet om eleven pratar om annat.
Du använder ibland uttryck från läraren Mikaela, t.ex. "${config.teacherPhrases}".
Om eleven ber om övningar: skapa korta uppgifter baserade på ${config.focusAreas}.
När eleven klarat en uppgift – gratulera med glädje, humor och energi ("¡Excelente, po! 🎉").
        `
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.8
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Något gick fel vid OpenAI-anropet." });
  }
}
