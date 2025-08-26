import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../config/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  CopyIcon, UserIcon, BotIcon, SendIcon, LoadingDots, 
  LogoutIcon, HistoryIcon, PlusIcon 
} from './Icons';


const Chats = () => {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedChat, setSelectedChat] = useState(0);
    const messagesEndRef = useRef(null);
    const { currentUser, logout } = useAuth();
    
    const navigate = useNavigate();
  // Sample chat history data
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
    scrollToBottom();
  }, [chatHistory[selectedChat].messages]);

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
    setSelectedChat(0); // Select the new chat (it's now first in the array)
  };

  const selectChat = (index) => {
    setSelectedChat(index);
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
    if (!input.trim()) return;
    
    const userMessage = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    
    // Update the current chat with the new message
    const updatedHistory = [...chatHistory];
    updatedHistory[selectedChat] = {
      ...updatedHistory[selectedChat],
      messages: [...updatedHistory[selectedChat].messages, userMessage],
      lastUpdated: new Date()
    };
    
    // Update chat title if it's the first user message
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
      
      // Update the chat with the assistant's response
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
      // You could add a temporary "Copied!" notification here
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs font-semibold text-gray-500 px-3 py-2 uppercase tracking-wider">
            Chat History
          </div>
          
          {chatHistory.map((chat, index) => (
            <div
              key={chat.id}
              onClick={() => selectChat(index)}
              className={`p-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                selectedChat === index ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <HistoryIcon className="h-4 w-4 flex-shrink-0" />
                <div className="truncate flex-1">{chat.title}</div>
              </div>
              <div className="text-xs text-gray-500 mt-1 ml-6">
                {formatDate(chat.lastUpdated)}
              </div>
            </div>
          ))}
        </div>
        
        {/* User Profile at the bottom */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-6 w-6 text-indigo-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.displayName || currentUser.email}
              </p>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="h-5 w-5 text-indigo-600" />
              )}
            </div>
            <div>
              <h1 className="text-sm font-medium text-gray-900">Talksy AI</h1>
              <p className="text-xs text-gray-500">Chats</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
            title="Logout"
          >
            <LogoutIcon className="h-5 w-5" />
          </button>
        </header>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-white">
          <div className="max-w-3xl mx-auto space-y-6">
            {chatHistory[selectedChat].messages.filter(m => m.role !== "system").map((m, i) => (
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
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  value={input}
                  placeholder="Type your message here..."
                  className="w-full resize-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-4 max-h-32"
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
        </div>
      </div>
    </div>
  );
};

export default Chats;