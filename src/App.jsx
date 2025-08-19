import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello, I'm an assistant that can help you with tasks." }
  ]);

  const apiKey = "AIzaSyAM6BNPBrzGrHNH8SaoeteoRC4tCMcnRr0";
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

  async function sendMessageToLlm() {
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash-lite",
          messages: newMessages
        })
      });

      const data = await response.json();
      console.log("Reply:", data);

      const reply = data.choices?.[0]?.message?.content || "No response";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  }

  return (
    <main>
      <section>
        <div className="conversation-area">
          <div className="messages">
            {messages.filter(m => m.role !== "system").map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                {m.content}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Enter a prompt"
            />
            <button onClick={sendMessageToLlm}>Send</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
