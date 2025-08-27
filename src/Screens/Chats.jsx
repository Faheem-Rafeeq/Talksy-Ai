import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../config/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    CopyIcon, UserIcon, BotIcon, SendIcon, LoadingDots,
    LogoutIcon, HistoryIcon, PlusIcon
} from './Icons';

// New Icons for the UI
const MenuIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const SunIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364 1.818l-1.591 1.591M21 12h-2.25m-1.818 6.364l-1.591-1.591M12 21v-2.25m-6.364-1.818l1.591-1.591M3 12h2.25m1.818-6.364l1.591 1.591" />
    </svg>
);

const MoonIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.276-2.604.792-3.75 1.041 1.841 2.684 3.484 4.525 4.525A9.728 9.728 0 0112 21.75a9.717 9.717 0 01-5.75-.826C6.39 20.395 5.25 18.995 5.25 17.25z" />
    </svg>
);


const Chats = () => {
    const [darkMode, setDarkMode] = useState(true); // Default to dark mode
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedChat, setSelectedChat] = useState(0);
    const messagesEndRef = useRef(null);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [chatHistory, setChatHistory] = useState([
        {
            id: 0,
            title: "Welcome Chat",
            messages: [
                {
                    role: "assistant",
                    content: "Hello! I'm your AI assistant. How can I help you today?",
                    timestamp: new Date()
                }
            ],
            lastUpdated: new Date()
        },
    ]);

    const apiKey = "AIzaSyAM6BNPBrzGrHNH8SaoeteoRC4tCMcnRr0";
    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Set initial theme based on state
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        scrollToBottom();
    }, [chatHistory[selectedChat].messages, darkMode]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/")
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const createNewChat = () => {
        const newChatId = chatHistory.length;
        const newChat = {
            id: newChatId,
            title: "New Chat",
            messages: [
                {
                    role: "assistant",
                    content: "Hello! I am Talksy Ai how i can assist you",
                    timestamp: new Date()
                }
            ],
            lastUpdated: new Date()
        };
        setChatHistory([newChat, ...chatHistory]);
        setSelectedChat(0);
        setIsMenuOpen(false); // Close menu after creating new chat
    };

    const selectChat = (index) => {
        setSelectedChat(index);
        setIsMenuOpen(false); // Close menu on chat selection
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date) => {
        const now = new Date();
        const chatDate = new Date(date);
        const diffTime = Math.abs(now - chatDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return chatDate.toLocaleDateString();
    };

    async function sendMessageToLlm() {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            role: "user",
            content: input,
            timestamp: new Date()
        };

        const updatedHistory = [...chatHistory];
        updatedHistory[selectedChat] = {
            ...updatedHistory[selectedChat],
            messages: [...updatedHistory[selectedChat].messages, userMessage],
            lastUpdated: new Date()
        };

        if (updatedHistory[selectedChat].messages.filter(m => m.role === 'user').length === 1) {
            updatedHistory[selectedChat].title = input.slice(0, 30) + (input.length > 30 ? '...' : '');
        }

        setChatHistory(updatedHistory);
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
                    messages: updatedHistory[selectedChat].messages.filter(m => m.role !== "system")
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content || "No response received";

            const assistantMessage = {
                role: "assistant",
                content: reply,
                timestamp: new Date()
            };

            const finalHistory = [...updatedHistory];
            finalHistory[selectedChat] = {
                ...finalHistory[selectedChat],
                messages: [...finalHistory[selectedChat].messages, assistantMessage],
                lastUpdated: new Date()
            };

            setChatHistory(finalHistory);
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
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
            {/* Menu Dropdown - Overlay on mobile, side-panel on desktop */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } w-64 flex flex-col bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800`}>

                <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-xl font-bold">Talksy</h1>
                    <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <MenuIcon className="transform rotate-90" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    <button
                        onClick={createNewChat}
                        className="w-full flex items-center gap-2 mb-4 bg-indigo-600 dark:bg-indigo-700 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors"
                    >
                        <PlusIcon className="h-5 w-5" />
                        New Chat
                    </button>
                    {chatHistory.map((chat, index) => (
                        <div
                            key={chat.id}
                            onClick={() => selectChat(index)}
                            className={`p-3 rounded-xl cursor-pointer mb-2 transition-colors ${selectedChat === index ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <HistoryIcon className="h-4 w-4 flex-shrink-0" />
                                <div className="truncate flex-1">{chat.title}</div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
                                {formatDate(chat.lastUpdated)}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center">
                            {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{currentUser?.displayName || currentUser?.email || 'User'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser?.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" title="Logout">
                        <LogoutIcon className="h-5 w-5" />
                    </button>
                    <button onClick={toggleTheme} className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" title="Toggle Theme">
                        {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Mobile Header */}
                <header className="bg-gray-100 dark:bg-gray-900 shadow-sm py-3 px-4 flex items-center justify-between md:hidden border-b border-gray-200 dark:border-gray-800">
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-md">
                        <MenuIcon />
                    </button>
                    <div className="flex-1 text-center font-bold">Talksy AI</div>
                    <div className="w-8"></div> {/* Spacer to center title */}
                </header>

                {/* Conversation Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-24"> {/* pb-24 to prevent fixed input from hiding content */}
                    <div className="max-w-3xl mx-auto space-y-6">
                        {chatHistory[selectedChat].messages.filter(m => m.role !== "system").map((m, i) => (
                            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[80%] rounded-3xl p-4 relative group ${m.role === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-sm"
                                        : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm"}`}
                                >
                                    <div className="flex items-start gap-2">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-indigo-700" : "bg-gray-300 dark:bg-gray-700"}`}>
                                            {m.role === "user" ? (
                                                <UserIcon className="h-4 w-4 text-white" />
                                            ) : (
                                                <BotIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            {m.role === "assistant" ? (
                                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                                </div>
                                            ) : (
                                                <p className="whitespace-pre-wrap">{m.content}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-3xl p-4 rounded-tl-sm">
                                    <div className="flex items-center">
                                        <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center mr-2">
                                            <BotIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                                        </div>
                                        <LoadingDots className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-3xl p-4 rounded-tl-sm">
                                    <div className="flex items-start gap-2">
                                        <div className="w-7 h-7 rounded-full bg-red-200 dark:bg-red-700 flex items-center justify-center flex-shrink-0">
                                            <span className="text-red-600 dark:text-red-300 font-bold">!</span>
                                        </div>
                                        <p className="flex-1">Error: {error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Floating, Static Input Area */}
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-end gap-2">
                            <div className="flex-1 relative">
                                <textarea
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    value={input}
                                    placeholder="Type your message here..."
                                    className="w-full resize-none border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 py-3 px-4 bg-gray-100 dark:bg-gray-900 placeholder:text-gray-500"
                                    rows="1"
                                    style={{ minHeight: '44px' }}
                                />
                            </div>
                            <button
                                onClick={sendMessageToLlm}
                                disabled={isLoading || !input.trim()}
                                className={`p-3 rounded-full ${isLoading || !input.trim()
                                    ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600"}`}
                            >
                                <SendIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chats;