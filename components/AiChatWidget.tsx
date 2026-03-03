
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, MessageSquareText, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '../types';
import { sendMessageToOpenRouter, getAiSettings, checkRateLimit } from '../services/openRouterService';

const AiChatWidget: React.FC = () => {
  const aiSettings = getAiSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: aiSettings.welcomeMessage }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateInfo, setRateInfo] = useState({ remaining: aiSettings.rateLimit, allowed: true });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Update rate info before sending
    const settings = getAiSettings();
    const rate = checkRateLimit(settings.rateLimit);
    setRateInfo({ remaining: rate.remaining, allowed: rate.allowed });

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await sendMessageToOpenRouter(userMsg.text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      // Update rate info after sending
      const rateAfter = checkRateLimit(settings.rateLimit);
      setRateInfo({ remaining: rateAfter.remaining, allowed: rateAfter.allowed });
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Er is een technische storing. Probeer het later opnieuw." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 bg-brand-blue text-white rounded-full shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform flex items-center gap-2 font-bold"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ rotate: 5 }}
      >
        <MessageSquareText className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[500px] bg-white rounded-2xl z-50 flex flex-col overflow-hidden border border-slate-200 shadow-2xl"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                 </div>
                 <div>
                     <h3 className="text-white font-bold text-sm">{aiSettings.assistantName}</h3>
                     <p className="text-xs text-slate-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Online · {rateInfo.remaining} berichten resterend
                     </p>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-brand-blue text-white rounded-tr-none'
                        : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Typ je vraag..."
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:border-brand-blue transition-colors placeholder-slate-400"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChatWidget;
