import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { CopyIcon, UserIcon, BotIcon, SendIcon, LoadingDots } from './Icons';

const Chats = () => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hello! I'm your AI assistant. How can I help you today?",
            timestamp: new Date()
        }
    ]);

    const apiKey = "AIzaSyAM6BNPBrzGrHNH8SaoeteoRC4tCMcnRr0";
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    async function sendMessageToLlm() {
        if (!input.trim()) return;

        const userMessage = {
            role: "user",
            content: input,
            timestamp: new Date()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gemini-2.5-flash-lite",
                    messages: newMessages.filter(m => m.role !== "system")
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Reply:", data);

            const reply = data.choices?.[0]?.message?.content || "No response received";

            setMessages(prev => [...prev, {
                role: "assistant",
                content: reply,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setError(error.message || "Failed to get response. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessageToLlm();
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
           alert("text copied")
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                        <BotIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Talksy AI</h1>
                        <p className="text-xs text-gray-500">Powered by Gemini API</p>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    {isLoading ? (
                        <div className="flex items-center text-indigo-600">
                            <LoadingDots className="h-4 w-4 mr-1" />
                            <span>Thinking...</span>
                        </div>
                    ) : (
                        <span>Online</span>
                    )}
                </div>
            </header>

            {/* Conversation Area */}
            <section className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full p-4">
                <div className="flex-1 overflow-y-auto rounded-lg bg-white shadow-sm p-4 mb-4">
                    <div className="space-y-6">
                        {messages.filter(m => m.role !== "system").map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl p-4 relative group ${m.role === "user"
                                        ? "bg-indigo-600 text-white rounded-br-none"
                                        : "bg-gray-100 text-gray-800 rounded-bl-none"}`}
                                >
                                    <div className="flex items-start gap-2">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-indigo-700" : "bg-gray-200"}`}>
                                            {m.role === "user" ? (
                                                <UserIcon className="h-4 w-4 text-white" />
                                            ) : (
                                                <BotIcon className="h-4 w-4 text-gray-700" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            {m.role === "assistant" ? (
                                                <div className="prose prose-sm max-w-none">
                                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p className="whitespace-pre-wrap">{m.content}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className={`flex items-center justify-between mt-2 text-xs ${m.role === "user" ? "text-indigo-200" : "text-gray-500"}`}>
                                        <span>{formatTime(m.timestamp)}</span>
                                        {m.role === "assistant" && (
                                            <button
                                                onClick={() => copyToClipboard(m.content)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 rounded hover:bg-white hover:bg-opacity-10"
                                                title="Copy response"
                                            >
                                                <CopyIcon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] bg-gray-100 text-gray-800 rounded-2xl p-4 rounded-bl-none">
                                    <div className="flex items-center">
                                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                            <BotIcon className="h-4 w-4 text-gray-700" />
                                        </div>
                                        <LoadingDots className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] bg-red-100 text-red-800 rounded-2xl p-4 rounded-bl-none">
                                    <div className="flex items-start gap-2">
                                        <div className="w-7 h-7 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0">
                                            <span className="text-red-600 font-bold">!</span>
                                        </div>
                                        <p className="flex-1">Error: {error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white rounded-lg shadow-sm p-3">
                    <div className="flex items-end gap-2">
                        <div className="flex-1 relative">
                            <textarea
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                value={input}
                                placeholder="Type your message here..."
                                className="w-full resize-none border-0 focus:ring-0 focus:outline-none py-2 px-4 max-h-32"
                                rows="1"
                                style={{ minHeight: '44px' }}
                            />
                        </div>
                        <button
                            onClick={sendMessageToLlm}
                            disabled={isLoading || !input.trim()}
                            className={`p-2 rounded-full ${isLoading || !input.trim()
                                ? "bg-gray-300 text-gray-500"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                        >
                            <SendIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Chats;