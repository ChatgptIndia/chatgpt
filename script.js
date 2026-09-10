```javascript
// script.js

const chat = document.getElementById("chat");
const input = document.getElementById("input");
const form = document.getElementById("form");
const history = document.getElementById("history");

let messages = [];

function addMessage(role, text) {
  document.querySelector(".welcome")?.remove();

  const row = document.createElement("div");
  row.className = "message-row " + role;

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

  row.className = "message-row ai";
  row.id = "typing";

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

function getAIResponse(text) {
  const msg = text.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello bhai! 👋 How can I help you?";
  }

  if (msg.includes("ai")) {
    return "AI यानी Artificial Intelligence ऐसी technology है जो computers को language समझने, patterns पहचानने और useful responses बनाने जैसे काम करने देती है।";
  }

  if (msg.includes("javascript")) {
    return `JavaScript webpage को interactive बनाने के लिए इस्तेमाल होती है.

Example:

const name = "Aman";
console.log("Hello " + name);`;
  }

  if (msg.includes("english")) {
    return "English सीखने के लिए रोज़ थोड़े vocabulary words पढ़ो, उनके अपने sentences बनाओ और daily conversation practice करो।";
  }

  return `मैंने आपका message पढ़ा:

"${text}"

यह अभी एक front-end AI-chat demo है। असली AI response के लिए इसे अपने backend/API से connect करना होगा।`;
}

function sendMessage(text) {
  text = text.trim();

  if (!text) return;

  addMessage("user", text);
  messages.push({
    role: "user",
    text: text
  });

  input.value = "";
  input.style.height = "auto";

  showTyping();

  setTimeout(() => {
    document.getElementById("typing")?.remove();

    const response = getAIResponse(text);

    addMessage("ai", response);

    messages.push({
      role: "ai",
      text: response
    });

    saveChats();
  }, 700);
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  sendMessage(input.value);
});

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

input.addEventListener("input", function() {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 150) + "px";
});

document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => {
    input.value = button.dataset.prompt;
    input.focus();
  });
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  localStorage.setItem(
    "nova_theme",
    dark ? "dark" : "light"
  );
});

document.getElementById("clearBtn").addEventListener("click", () => {
  localStorage.removeItem("nova_chats");
  messages = [];
  history.innerHTML = "";
  document.getElementById("newChat").click();
});

document.getElementById("newChat").addEventListener("click", () => {
  messages = [];

  chat.innerHTML = `
    <div class="welcome">
      <div class="logo">✦</div>
      <h1>How can I help?</h1>
      <p>Ask me anything or choose a suggestion below.</p>

      <div class="suggestions">
        <button data-prompt="Explain AI in simple words">
          Explain AI simply
        </button>

        <button data-prompt="Give me 5 project ideas">
          Give project ideas
        </button>

        <button data-prompt="Help me learn English">
          Learn English
        </button>

        <button data-prompt="Write a JavaScript program">
          Write JavaScript
        </button>
      </div>
    </div>
  `;

  document.querySelectorAll("[data-prompt]").forEach(button => {
    button.onclick = () => {
      input.value = button.dataset.prompt;
      input.focus();
    };
  });
});

document.getElementById("menuBtn").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

function saveChats() {
  localStorage.setItem(
    "nova_chats",
    JSON.stringify(messages)
  );

  history.innerHTML = "";

  const firstUserMessage =
    messages.find(m => m.role === "user");

  if (firstUserMessage) {
    const item = document.createElement("button");

    item.textContent =
      firstUserMessage.text.slice(0, 40);

    item.onclick = () => {
      chat.innerHTML = "";

      messages.forEach(m => {
        addMessage(m.role, m.text);
      });
    };

    history.appendChild(item);
  }
}

const savedTheme =
  localStorage.getItem("nova_theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}
```
