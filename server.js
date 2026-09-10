```javascript
require("dotenv").config();

const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing in .env");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json({ limit: "1mb" }));

// Frontend files
app.use(express.static(path.join(__dirname, "public")));

// AI Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body.messages)
      ? req.body.messages
      : [];

    if (!messages.length) {
      return res.status(400).json({
        error: "No messages provided."
      });
    }

    const safeMessages = messages
      .filter(
        message =>
          message &&
          (message.role === "user" ||
           message.role === "assistant")
      )
      .map(message => ({
        role: message.role,
        content: String(message.content || "").slice(0, 12000)
      }))
      .slice(-20);

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL,
      input: safeMessages
    });

    res.json({
      reply:
        response.output_text ||
        "Sorry, I could not generate a response."
    });

  } catch (error) {
    console.error("OpenAI Error:", error);

    res.status(500).json({
      error: "AI request failed."
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Nova AI running at http://localhost:${PORT}`);
});
```
