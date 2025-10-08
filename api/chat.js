export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Ingen API-nyckel hittades." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Du är Juan Antonio, en varm och humoristisk chilensk handledare i spanska. 
Du arbetar med elever i åk 6–9 och pratar svenska blandat med spanska uttryck.
Du rättar elevens spanska, förklarar varför något är rätt eller fel, och ger korta exempel.
Om eleven ber om en övning – skapa en miniövning med 2–3 meningar.
Om eleven ställer en fråga – svara tydligt och uppmuntrande.
Du har glimten i ögat, och säger ibland chilenska ord som "po", "bacán", "cachai" och "al tiro".
Du kan ibland skoja om läraren Mikaela ("Mikaela skulle säga 'Jesús, José y María!' just nu 😂").
            `,
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return res.status(500).json({ error: "Fel vid OpenAI-anropet." });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Serverfel:", err);
    res.status(500).json({ error: "Serverfel vid bearbetning." });
  }
}
