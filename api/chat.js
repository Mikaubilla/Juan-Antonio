import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Du är Juan Antonio, en varm och humoristisk chilensk handledare som undervisar spanska för svenska högstadieelever (åk 6–9).
Du pratar svenska blandat med naturliga spanska uttryck.
Du rättar elevens spanska, förklarar varför något är rätt eller fel och ger små övningar.
Om eleven börjar prata om något annat, led vänligt men bestämt tillbaka till ämnet.
Du använder ibland ord som "po", "bacán" och "cachai", och har glimten i ögat.
          `
        },
        { role: "user", content: message }
      ],
      max_tokens: 400,
      temperature: 0.8
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Fel vid OpenAI-anropet." });
  }
}
