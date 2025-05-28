import React, { useEffect, useState } from 'react';
import * as webllm from "@mlc-ai/web-llm";
import './App.css';

const App = () => {

  const [input, setInput] = useState("");


  const [messages, setMessages] = useState([
    { role: "system", content: "Hello, your an assistant that can helpfull in tasks" }
  ]);

  const [engine, setEngine] = useState(null);

  useEffect(() => {
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";

    // Attempt to initialize the MLC engine
    webllm.CreateMLCEngine(selectedModel, {
      initProgressCallback: (progress) => {
        console.log("Model Loading Progress:", progress);
      }
    })
    .then((engine) => {
      setEngine(engine);
      console.log("MLC engine initialized");
    })
    .catch((err) => {
      console.error("Error initializing MLC engine:", err);
      alert("WebGPU is not supported on this device or browser. Try using the latest version of Chrome or Edge.");
    });
  }, []);

  async function sendMessageToLlm() {


    const tepMessages = [...messages];
    tepMessages.push({
      role: "user",
      content: input
    })

    setMessages(tepMessages);
    setInput("")



    engine.chat.completions.create({
      messages: tepMessages
    }).then((reply) => {

      console.log("reply ", reply)


      const text = reply.choices[0].message.content

      setMessages([...tepMessages, {
        role: "assistant",
        content: text
      }])


    })









  }



  return (
    <main>
      <section>
        <div className="conversation-area">
          <div className="messages">
            {messages.filter(message => message.role !== "system").map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.content}
              </div>
            ))}
          </div>
          <div className="input-area">
            <input
              onChange={(e) => {
                setInput(e.target.value)
              }}
              value={input}
              type="text" placeholder="Enter a prompt" />
            <button
              onClick={() => {
                sendMessageToLlm()
              }}
            >Send</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
