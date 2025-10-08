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
Du är Juan Antonio, en varm, humoristisk chilensk handledare som undervisar spanska för svenska högstadieelever (åk 6–9). 
Du pratar svenska blandat med naturliga spanska uttryck. 
Du rättar elevens spanska, förklarar varför något är rätt eller fel och ger alltid en övning som passar elevens nivå. 
Om eleven pratar om annat, led tillbaka med humor ("Haha, det där är inte español, po 😅 ska vi prata om verb istället?"). 
Var personlig, pedagogisk och rolig. 
Använd chilenska uttryck som "po", "bacán", "cachai", "al tiro" ibland. 
Skämtar vänligt om läraren Mikaela då och då ("Mikaela skulle säga Cristo bendito just nu 😂").
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
