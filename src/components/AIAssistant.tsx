import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, User, Bot, Minus } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';
import { cn } from '../utils/cn';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Peace. I'm Layered AI. How can I help you elevate your look today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await chatWithAssistant(userMessage, history);
    setMessages(prev => [...prev, { role: 'model', text: response || '' }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-2xl shadow-orange-500/20 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="h-5 w-5 relative z-10" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-white/20 rounded-full"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '70px' : '450px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={cn(
              "w-[320px] overflow-hidden rounded-[28px] bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-grey-dark/5 flex flex-col transition-all duration-300",
              isMinimized && "w-[200px]"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-orange-500 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 border border-white/30">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest">Layered AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar"
                >
                  {messages.map((m, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className={cn(
                        "flex gap-2.5 max-w-[90%]",
                        m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                        m.role === 'user' ? "bg-grey-light border-grey-dark/10" : "bg-orange-50 border-orange-100"
                      )}>
                        {m.role === 'user' ? <User className="h-3.5 w-3.5 text-grey-dark" /> : <Bot className="h-3.5 w-3.5 text-orange-500" />}
                      </div>
                      <div className={cn(
                        "rounded-xl p-3.5 text-xs leading-relaxed",
                        m.role === 'user' 
                          ? "bg-orange-500 text-white rounded-tr-none" 
                          : "bg-grey-light text-grey-dark rounded-tl-none"
                      )}>
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-50 border border-orange-100">
                        <Bot className="h-3.5 w-3.5 text-orange-500" />
                      </div>
                      <div className="bg-grey-light rounded-xl rounded-tl-none p-3.5 flex gap-1 items-center">
                        <span className="h-1 w-1 rounded-full bg-grey-dark/20 animate-bounce" />
                        <span className="h-1 w-1 rounded-full bg-grey-dark/20 animate-bounce [animation-delay:0.2s]" />
                        <span className="h-1 w-1 rounded-full bg-grey-dark/20 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-5 pt-0">
                  <div className="relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about style..."
                      className="w-full rounded-xl border border-grey-dark/10 bg-grey-light/50 px-4 py-3 pr-12 text-xs focus:border-orange-500 focus:outline-none transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isLoading}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg bg-orange-500 text-white disabled:opacity-50 transition-all hover:bg-orange-600"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
