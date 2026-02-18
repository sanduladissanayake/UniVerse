import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 Welcome to UniVerse. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 rounded-3xl shadow-2xl flex flex-col transition-all duration-300 ${
            isMinimized
              ? 'bottom-20 right-6 w-80 h-16'
              : 'bottom-6 right-6 w-96 h-[600px]'
          }`}
          style={{
            background: 'linear-gradient(135deg, #f0f9fb 0%, #f5fdfb 100%)',
            border: '2px solid #0f766e',
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white p-5 rounded-t-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                <MessageCircle size={20} className="text-teal-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold">UniVerse Assistant</h3>
                <p className="text-xs text-teal-100">Always here to help</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-teal-700 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-teal-700 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area - Only show if not minimized */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl shadow-md transition-all duration-200 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-teal-200 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <span className="text-xs opacity-60 mt-1 block">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-teal-200 px-4 py-3 rounded-2xl rounded-bl-none">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce animation-delay-400"></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-teal-200 p-4 rounded-b-3xl bg-white">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-3 border-2 border-teal-300 rounded-full focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-200 transition-all"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    className="px-5 py-3 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 Ask about clubs, events, memberships, or how to get involved!
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% {
            opacity: 1;
            transform: translateY(0);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-8px);
          }
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </>
  );
}
