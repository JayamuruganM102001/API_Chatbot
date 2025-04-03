import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Replace this with your actual API key
const API_KEY = "AIzaSyDOcL-Cd1kd7I3U2Bx3COW0qfKum7ZCpkA";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");

const inputInitHeight = chatInput.scrollHeight;

// ✅ Create a chat message element
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    chatLi.innerHTML = className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;

    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

// ✅ Function to generate a response using Gemini API
const generateResponse = async (chatElement, userMessage) => {
    const messageElement = chatElement.querySelector("p");
    messageElement.innerHTML = `
    <div class="thinking-container">
        <span class="thinking-dots" style="width: 10px; height: 10px; background: #724ae8; border-radius: 50%; margin: 0px 3px;"></span>
        <span class="thinking-dots" style="width: 10px; height: 10px; background: #724ae8; border-radius: 50%; margin: 0px 3px;"></span>
        <span class="thinking-dots" style="width: 10px; height: 10px; background: #724ae8; border-radius: 50%; margin: 0px 3px;"></span>
    </div>`;

    try {
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = await response.text();

        messageElement.textContent = text; // Display AI response
    } catch (error) {
        messageElement.textContent = "Error: Unable to fetch response.";
        console.error("API Error:", error);
    }

    chatbox.scrollTo(0, chatbox.scrollHeight);
};

// ✅ Handle user input
const handleChat = () => {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        generateResponse(incomingChatLi, userMessage);
    }, 600);
};

// ✅ Event Listeners
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
