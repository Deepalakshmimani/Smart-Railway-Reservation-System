import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./ChatBot.css";

const ChatBot = ({ isOpen, setIsOpen }) => {

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [conversationId, setConversationId] = useState("");

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi 👋 I'm RailGo AI Assistant.\n\nHow can I help you?"
        }
    ]);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages, loading]);

    const sendMessage = async () => {

        if (!message.trim() || loading) return;

        const userMessage = message.trim();

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                content: userMessage
            }
        ]);

        setMessage("");

        setLoading(true);

        try {

            const res = await axios.post(

                `${import.meta.env.VITE_API_URL}/api/chatbot/chat`,
                {
                    message: userMessage,
                    conversation_id: conversationId
                },

                {
                    withCredentials: true
                }

            );

            if (res.data.conversation_id) {
                setConversationId(res.data.conversation_id);
            }

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: res.data.answer
                }
            ]);

        } catch (err) {

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "❌ Sorry, something went wrong. Please try again."
                }
            ]);

        } finally {

            setLoading(false);

        }

    };

    return (
        <>

            {!isOpen && (

                <div
                    className="chat-widget"
                    onClick={() => setIsOpen(true)}
                >

                    <div className="chat-widget-message">

                        <strong>🤖 RailGo AI</strong>

                        <p>
                            Hi! I'm your Railway Assistant.
                        </p>

                    </div>

                    <div className="chat-widget-avatar">

                        🚆

                    </div>

                </div>

            )}

            {isOpen && (

                <div className="chatbot-container">

                    <div className="chatbot-header">

                        <span>
                            🚆 RailGo AI Assistant
                        </span>

                        <button
                            className="close-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            ✕
                        </button>

                    </div>

                    <div className="chatbot-body">

                        {

                            messages.map((msg, index) => (

                                <div

                                    key={index}

                                    className={`message ${msg.role === "user"
                                        ? "user"
                                        : "bot"
                                        }`}

                                >

                                    <span>

                                        <ReactMarkdown>

                                            {msg.content}

                                        </ReactMarkdown>

                                    </span>

                                </div>

                            ))

                        }

                        {

                            loading && (

                                <div className="message bot">

                                    <span>

                                        🤖 RailGo AI is typing...

                                    </span>

                                </div>

                            )

                        }

                        <div ref={messagesEndRef}></div>

                    </div>

                    <div className="chatbot-footer">

                        <input

                            value={message}

                            onChange={(e) => setMessage(e.target.value)}

                            placeholder="Ask anything..."

                            onKeyDown={(e) => {

                                if (e.key === "Enter") {

                                    sendMessage();

                                }

                            }}

                        />

                        <button

                            onClick={sendMessage}

                            disabled={loading}

                        >

                            {

                                loading

                                    ? "..."

                                    : "Send"

                            }

                        </button>

                    </div>

                </div>

            )}

        </>
    );

};

export default ChatBot;