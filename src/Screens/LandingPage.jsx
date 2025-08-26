import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import {
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    CpuChipIcon,
    ArrowPathIcon,
    ServerStackIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
    const [activeTab, setActiveTab] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveTab(2);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-slate-800">Talksy AI</span>
                        </div>

                        <div className="hidden md:flex space-x-8">
                            <a
                                href="#features"
                                className="text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#process"
                                className="text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                How it Works
                            </a>
                            <a
                                href="#team"
                                className="text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                Team
                            </a>
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
            <section className="pt-32 mt-5 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Introducing <span className="text-indigo-600">Talksy AI</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
                        This AI is powered by Google’s Gemini API, trained to chat, answer questions, and assist you in real time. 🚀
                        I’ve connected it with Firebase, so your conversations are saved and you can always come back to continue where you left off.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <Link to="/login">
                            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
                                <SparklesIcon className="h-5 w-5 mr-2" />
                                Try Talksy
                            </button>
                        </Link>
<Link to="/login">

                        <button className="border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                            Login
                        </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                        How Talksy Was Trained
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div
                            className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-500 ${activeTab === 1
                                ? "ring-2 ring-indigo-500 transform -translate-y-2"
                                : "opacity-80"
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                                <CpuChipIcon className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Connected to Gemeni Api</h3>
                            <p className="text-slate-600">
                                We used Google’s Gemini API as the brain of our AI.
                            </p>
                        </div>

                        <div
                            className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-500 ${activeTab === 2
                                ? "ring-2 ring-indigo-500 transform -translate-y-2"
                                : "opacity-80"
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                                <ServerStackIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Added Human Feedback</h3>
                            <p className="text-slate-600">
                                Trained it with conversations and improved responses using real feedback.
                            </p>
                        </div>

                        <div
                            className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-500 ${activeTab === 3
                                ? "ring-2 ring-indigo-500 transform -translate-y-2"
                                : "opacity-80"
                                }`}
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                <ArrowPathIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Stored & Improved</h3>
                            <p className="text-slate-600">
                                aved chats in Firebase to learn, grow, and keep your history safe
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={() =>
                                setActiveTab(activeTab === 3 ? 1 : activeTab + 1)
                            }
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Next Step
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Why Choose Talksy
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-16">
                        Our AI model is designed to provide the most natural and helpful
                        conversations
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<SparklesIcon className="h-6 w-6 text-blue-600" />}
                            title="Human-like Conversations"
                            text="Engage in natural, flowing dialogues that feel genuinely human."
                            bg="bg-blue-100"
                        />
                        <FeatureCard
                            icon={
                                <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
                            }
                            title="Multi-turn Dialogues"
                            text="Maintains context throughout extended conversations."
                            bg="bg-green-100"
                        />
                        <FeatureCard
                            icon={<CpuChipIcon className="h-6 w-6 text-amber-600" />}
                            title="Continuous Learning"
                            text="Improves with each interaction through advanced RLHF."
                            bg="bg-amber-100"
                        />
                        <FeatureCard
                            icon={<ServerStackIcon className="h-6 w-6 text-red-600" />}
                            title="Secure & Private"
                            text="Your conversations are encrypted and safe."
                            bg="bg-red-100"
                        />
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="py-20 bg-indigo-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Team</h2>
                    <p className="text-lg text-slate-600 mb-12">
                        Meet the minds behind Talksy AI
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TeamMember name="Faheem Rafeeq" role="Developer" />
                        <TeamMember name="Taqqi" role="Developer" />
                        <TeamMember name="Saba Noor" role="Designer" />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-800 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center text-slate-400">
                    <p>© 2025 Talksy AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, text, bg }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div
            className={`w-12 h-12 rounded-full ${bg} flex items-center justify-center mb-4`}
        >
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600">{text}</p>
    </div>
);

const TeamMember = ({ name, role }) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-semibold text-indigo-600">{name}</h3>
        <p className="text-slate-600">{role}</p>
    </div>
);

export default LandingPage;
