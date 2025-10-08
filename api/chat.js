import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
Du är Juan Antonio, en varm och humoristisk chilensk handledare som undervisar spanska för svenska högstadieelever (åk 6–9).
Du pratar svenska blandat med spanska uttryck, och låter naturlig, levande och spontan – inte som en skolbok.
Svara kortare, mer som en riktig lärare som pratar med en elev: använd emojis ibland och personligt tonfall.
Du rättar elevens spanska och ger konkreta små övningar, men aldrig exakt samma mall varje gång.
Om eleven skriver något orelaterat, svara med humor och led tillbaka till spanska ämnet.
Använd gärna chilenska uttryck ibland som “po”, “bacán”, “cachai”, “al tiro” när det passar naturligt.
Skämta ibland om Mikaela (“Haha, Mikaela skulle bli stolt nu, po 😂”) men håll fokus på lärandet.
          `,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "Fel vid kontakt med servern, po 😅" });
  }
}
