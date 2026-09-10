```javascript
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const form = document.getElementById("form");

let messages = [];

function addMessage(role, text) {
  document.querySelector(".welcome")?.remove();

  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "You" : "✦";

  const message = document.createElement("div");
  message.className = "message";
  message.textContent = text;

  if (role === "user") {
    row.append(message, avatar);
  } else {
    row.append(avatar, message);
  }

  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

function showTyping() {
  const row = document.createElement("div");

  row.id = "typing";
  row.className = "message-row ai";

  row.innerHTML = `
    <div class="avatar">✦</div>
    <div class="message">
      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;

  chat.appendChild(row);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage(text) {
  text = text.trim();

  if (!text) return;

  addMessage("user", text);

  messages.push({
    role: "user",
    content: text
  });

  input.value = "";
  input.style.height = "auto";

  showTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        messages: messages
      })
    });

    const data = await response.json();

    document.getElementById("typing")?.remove();

    if (!response.ok) {
      throw new Error(
        data.error || "Request failed"
      );
    }

    addMessage("ai", data.reply);

    messages.push({
      role: "assistant",
      content: data.reply
    });

  } catch (error) {

    document.getElementById("typing")?.remove();

    addMessage(
      "ai",
      "❌ Error: " + error.message
    );
  }
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  sendMessage(input.value);
});

input.addEventListener("keydown", function(event) {

  if (
    event.key === "Enter" &&
    !event.shiftKey
  ) {
    event.preventDefault();

    form.requestSubmit();
  }

});

input.addEventListener("input", function() {

  input.style.height = "auto";

  input.style.height =
    Math.min(input.scrollHeight, 150) + "px";

});
```
