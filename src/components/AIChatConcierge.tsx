import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, X, MessageSquare, ArrowRight, Loader, Compass } from "lucide-react";
import { Message } from "../types";

interface AIChatConciergeProps {
  onAddToRegistry?: (productId: string) => void;
}

export default function AIChatConcierge({ onAddToRegistry }: AIChatConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to the Maison Ruvixon Salon Privé. I am your personal couture stylist and collection concierge. How may I guide your styling journey or assist you with enrolling in our Summer SS '26 launch registry today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    "Tell me about the Cocoa Grid pieces.",
    "When is the Summer SS '26 launch date?",
    "How do I join the Private Launch Registry?",
    "How are the Atelier Loyalty Points verified?",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (rawMessage: string) => {
    if (!rawMessage.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: rawMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error("Tailoring service temporarily offline.");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Gracious apologies, our digital salon concierge is briefly disconnected. Please ensure your environment credentials (GEMINI_API_KEY) are active inside the Secrets panel and try again shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="btn-open-assistant"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-black border border-stone-800 shadow-xl py-2 px-4 rounded-full flex items-center gap-2 cursor-pointer hover:bg-stone-900 transition-all text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
        </span>
        <span className="font-display tracking-[0.15em] text-[9px] font-bold text-white">AI Stylist</span>
      </motion.button>

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="assistant-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-16 right-6 w-76 sm:w-80 h-[390px] bg-white border border-sand-200 shadow-2xl z-50 rounded-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-white p-3.5 border-b border-sand-150 flex items-center justify-between text-stone-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-serif tracking-[0.2em] font-normal italic text-xs">RUVIXON</h3>
                  <p className="text-[8px] text-stone-400 tracking-[0.1em] uppercase">Stylist Concierge</p>
                </div>
              </div>
              <button
                id="btn-close-assistant"
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-black p-1 hover:bg-sand-100 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-sand-100/20">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-lg text-[11px] leading-relaxed relative ${
                      msg.role === "user"
                        ? "bg-black text-white"
                        : "bg-white text-stone-900 border border-sand-200 shadow-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line font-sans">{msg.content}</p>
                    <span
                      className={`text-[8px] block mt-1.5 opacity-50 ${
                        msg.role === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-sand-200 p-2.5 rounded-lg flex items-center gap-2">
                    <Loader className="w-3 h-3 animate-spin text-stone-950" />
                    <span className="text-[10px] text-stone-500 font-serif italic">Styling...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets / Suggestions */}
            {messages.length === 1 && !isLoading && (
              <div className="px-3 pb-2.5 pt-1.5 bg-sand-50/80 border-t border-sand-100 flex flex-col gap-1.5">
                <div className="flex items-center gap-1 text-[8px] text-stone-400 uppercase tracking-widest w-full">
                  <Compass className="w-2.5 h-2.5 text-stone-500" />
                  <span>Bespoke Enquiries</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {presetQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[9px] bg-white border border-sand-200 hover:border-black text-stone-800 px-2 py-1.5 rounded-md hover:bg-sand-100 transition-all text-left truncate cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMessage);
              }}
              className="p-2 bg-white border-t border-sand-200 flex items-center gap-1.5"
            >
              <input
                id="input-assistant-message"
                type="text"
                placeholder="Ask our concierge..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-transparent hover:bg-stone-50 border-b border-sand-200 hover:border-black focus:border-black text-[11px] px-2 py-1.5 outline-none transition-all placeholder:text-stone-450 text-stone-900 font-sans"
              />
              <button
                id="btn-send-assistant"
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="bg-black hover:bg-stone-900 text-white p-2 rounded-md transition-all disabled:opacity-40 disabled:hover:bg-black flex items-center justify-center cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
