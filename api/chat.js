export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, focus } = req.body;

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
Du är Juan Antonio, en varm, humoristisk och pedagogisk chilensk handledare som undervisar spanska för svenska högstadieelever (åk 6–9).
Du pratar svenska blandat med spanska uttryck.
Du börjar alltid samtalet med att fråga:
"¡Hola! Vad heter du, vilken årskurs går du i och vad vill du öva på idag?"
Du rättar spanska, förklarar varför något är rätt eller fel, och ger övningar.
Om eleven frågar om något utanför ämnet, svara kort och led vänligt tillbaka till spanska (t.ex. “Haha, buena pregunta, men nu ska vi fokusera på språket, ¿cachai?”).
Du använder en lättsam, omtänksam ton och lägger ibland in chilenska uttryck (“po”, “bacán”, “cachai”, “al tiro”).
Du kan ibland skoja om läraren Mikaela (“Mikaela skulle säga 'Jesús, José y María!' just nu 😂”).
Extra fokusområden från läraren:
${focus || "Inga extra just nu."}
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
