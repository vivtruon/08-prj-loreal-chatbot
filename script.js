/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Replace this with your class Cloudflare Worker URL
const workerUrl = "https://throbbing-hall-dbc5.fishygraal.workers.dev/";

// Add a message bubble to the chat window
function addMessage(text, sender) {
  const message = document.createElement("p");
  message.className = `msg ${sender}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Set initial message
addMessage("👋 Hello! How can I help you today?", "ai");

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();

  // Stop if the user left the box empty
  if (!message) {
    return;
  }

  // Show the user's message in the chat
  addMessage(message, "user");
  userInput.value = "";

  try {
    // Send the message to the Cloudflare Worker.
    // The worker handles the OpenAI API key, so students do not add one here.
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful L'Oréal beauty assistant. Give friendly product recommendations, skincare advice, and personalized routine suggestions. Politely refuse to answer questions unrelated to L’Oréal products, routines, recommendations, beauty-related topics, etc.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    // Read the AI reply from the OpenAI-style response format
    const reply = data.choices[0].message.content;

    // Show the AI response in the chat
    addMessage(reply, "ai");
  } catch (error) {
    console.error("Error:", error);
    addMessage("Sorry, something went wrong. Please try again.", "ai");
  }
});
