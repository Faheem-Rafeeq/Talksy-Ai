import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { useAuth } from "../config/AuthContext";
import {
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    CpuChipIcon,
    ArrowPathIcon,
    ServerStackIcon,
    SunIcon,
    MoonIcon
} from "@heroicons/react/24/outline";

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveTab(2);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // toggle dark mode
    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

const {currentUser} = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 dark:from-slate-900 dark:to-slate-950 dark:text-slate-100">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">Talksy AI</span>
                        </div>

                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                            <a href="#process" className="hover:text-indigo-600 transition-colors">How it Works</a>
                            <a href="#team" className="hover:text-indigo-600 transition-colors">Team</a>
                        </div>

                        <Link to="/signup">
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                                Sign Up
                            </button>
                        </Link>

                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center mt-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Introducing <span className="text-indigo-600">Talksy AI</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
                        This AI is powered by Google’s Gemini API, trained to chat, answer questions, and assist you in real time. 🚀
                        I’ve connected it with Firebase, so your conversations are saved and you can always come back to continue where you left off.
                    </p>

                    {/* Responsive buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                        {currentUser ? (
                            <>
                                <Link to="/chats" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
                                        <SparklesIcon className="h-5 w-5 mr-2" />
                                        Try Talksy
                                    </button>
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Login
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
                                        <SparklesIcon className="h-5 w-5 mr-2" />
                                        Try Talksy
                                    </button>
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Login
                                    </button>
                                </Link>
                            </>
                        )}

                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-16 bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Talksy Was Trained</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ProcessCard
                            icon={<CpuChipIcon className="h-6 w-6 text-indigo-600" />}
                            title="Connected to Gemini API"
                            text="We used Google’s Gemini API as the brain of our AI."
                            active={activeTab === 1}
                        />
                        <ProcessCard
                            icon={<ServerStackIcon className="h-6 w-6 text-purple-600" />}
                            title="Added Human Feedback"
                            text="Trained it with conversations and improved responses using real feedback."
                            active={activeTab === 2}
                        />
                        <ProcessCard
                            icon={<ArrowPathIcon className="h-6 w-6 text-blue-600" />}
                            title="Stored & Improved"
                            text="Saved chats in Firebase to learn, grow, and keep your history safe."
                            active={activeTab === 3}
                        />
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setActiveTab(activeTab === 3 ? 1 : activeTab + 1)}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Next Step
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Talksy</h2>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12">
                        Our AI model is designed to provide the most natural and helpful conversations
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon={<SparklesIcon className="h-6 w-6 text-blue-600" />} title="Human-like Conversations" text="Engage in natural, flowing dialogues that feel genuinely human." bg="bg-blue-100" />
                        <FeatureCard icon={<ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />} title="Multi-turn Dialogues" text="Maintains context throughout extended conversations." bg="bg-green-100" />
                        <FeatureCard icon={<CpuChipIcon className="h-6 w-6 text-amber-600" />} title="Continuous Learning" text="Improves with each interaction through advanced RLHF." bg="bg-amber-100" />
                        <FeatureCard icon={<ServerStackIcon className="h-6 w-6 text-red-600" />} title="Secure & Private" text="Your conversations are encrypted and safe." bg="bg-red-100" />
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="py-16 bg-indigo-50 dark:bg-slate-800 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-10">Meet the minds behind Talksy AI</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TeamMember name="Faheem Rafeeq" role="Developer" />
                        <TeamMember name="Taqi" role="Developer" />
                        <TeamMember name="Saba Noor" role="Designer" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-800 text-white py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center text-slate-400">
                    <p>© 2025 Talksy AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const ProcessCard = ({ icon, title, text, active }) => (
    <div className={`bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-lg transition-all duration-500 ${active ? "ring-2 ring-indigo-500 transform -translate-y-2" : "opacity-80"}`}>
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{text}</p>
    </div>
);

const FeatureCard = ({ icon, title, text, bg }) => (
    <div className="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mb-4`}>
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-300">{text}</p>
    </div>
);

const TeamMember = ({ name, role }) => (
    <div className="bg-white dark:bg-slate-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-semibold text-indigo-600">{name}</h3>
        <p className="text-slate-600 dark:text-slate-300">{role}</p>
    </div>
);

export default LandingPage;
