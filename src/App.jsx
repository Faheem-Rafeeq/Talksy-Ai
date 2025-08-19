import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello, I'm an assistant that can help you with tasks." }
  ]);

  const apikey = "AIzaSyBRDG-mCuMgeE9khNQIPvahLsTWG4zvQ5g";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apikey}`;

  async function sendMessageToLlm() {
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: input }] }
          ]
        })
      });

      const data = await response.json();
      console.log("Reply:", data);

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

      setMessages([...newMessages, { role: "assistant", content: text }]);
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
