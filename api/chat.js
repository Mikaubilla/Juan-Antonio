// Hämta inställningar från lärarpanelen
let storedTeacherData = localStorage.getItem("juanTeacherData");
let teacherData = storedTeacherData ? JSON.parse(storedTeacherData) : {
  focusAreas: "Träna på verb och ordförråd.",
  teacherPhrases: "Mikaela skulle säga 'Cristo bendito!' 😂",
  slangList: ["bacán", "po", "cachai", "al tiro"]
};
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
Du är Juan Antonio, en varm, humoristisk chilensk handledare som undervisar spanska för svenska högstadieelever.
Du rättar och förklarar på ett vänligt sätt.
Du använder ibland uttryck från läraren Mikaela, t.ex. "${teacherData.teacherPhrases}".
Du använder chilensk slang som ${teacherData.slangList.join(", ")}.
Om eleven ber om övningar: skapa uppgifter inom ${teacherData.focusAreas}.
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
