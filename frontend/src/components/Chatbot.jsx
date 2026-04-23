'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Loader2,
  Sparkles,
  Minimize2,
  Maximize2,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { chatAPI } from '@/services/api';
import { useVoiceAssistant } from '@/services/voiceService';

export default function Chatbot({ 
  initialMessage = null,
  context = null 
}) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    speak, 
    stopSpeaking,
    setLanguage 
  } = useVoiceAssistant();

  // Set voice language based on i18n
  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language, setLanguage]);

  // Add initial greeting when chatbot opens first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = {
        id: 1,
        role: 'assistant',
        content: t('chatbot') + ' ' + t('askQuestion'),
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length, t]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle voice transcript
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  const sendMessage = async (content = inputValue) => {
    if (!content.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Add thinking message
    const thinkingMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      content: 'thinking',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, thinkingMessage]);

    try {
      const response = await chatAPI.sendMessage(content, i18n.language, context);
      
      // Remove thinking message and add actual response
      setMessages(prev => prev.filter(m => m.content !== 'thinking'));
      
      // Handle both direct response and nested response structure
      let assistantContent = response.data?.response || 
                             response.data?.explanation || 
                             response?.response || 
                             response?.explanation || 
                             t('thinking');
      
      const assistantMessage = {
        id: Date.now() + 2,
        role: 'assistant',
        content: assistantContent,
        sources: response.data?.sources || response?.sources || [],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.filter(m => m.content !== 'thinking'));
      
      const errorMessage = {
        id: Date.now() + 3,
        role: 'assistant',
        content: t('error') || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      stopListening();
    } else {
      try {
        await startListening();
      } catch (error) {
        console.error('Voice input error:', error);
      }
    }
  };

  const handleSpeak = (text) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speak(text)
        .then(() => setIsSpeaking(false))
        .catch(() => setIsSpeaking(false));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all ${
          isOpen ? 'hidden' : 'flex items-center justify-center'
        }`}
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed z-50 bg-white rounded-3xl shadow-2xl overflow-hidden ${
              isMinimized 
                ? 'bottom-6 right-6 w-80 h-16' 
                : 'bottom-6 right-6 w-full max-w-md h-[600px]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      {t('chatbot')}
                    </h3>
                    <p className="text-xs text-white/80">AI Health Assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    {isMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[420px] bg-slate-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[80%] ${
                        message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.role === 'user' 
                            ? 'bg-secondary-500' 
                            : 'bg-primary-500'
                        }`}>
                          {message.role === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Message Content */}
                        <div className={`rounded-2xl p-3 ${
                          message.role === 'user'
                            ? 'bg-secondary-500 text-white'
                            : message.content === 'thinking'
                            ? 'bg-white shadow-md'
                            : 'bg-white text-slate-800 shadow-md'
                        }`}>
                          {message.content === 'thinking' ? (
                            <div className="flex items-center gap-2 px-2">
                              <motion.div
                                animate={{ scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                                className="w-2 h-2 bg-primary-500 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                className="w-2 h-2 bg-primary-500 rounded-full"
                              />
                              <motion.div
                                animate={{ scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                className="w-2 h-2 bg-primary-500 rounded-full"
                              />
                              <span className="text-xs text-slate-500 ml-2">{t('thinking')}</span>
                            </div>
                          ) : (
                            <div>
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => handleSpeak(message.content)}
                                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                                  title="Text to speech"
                                >
                                  {isSpeaking ? (
                                    <VolumeX className="w-3 h-3 text-slate-400" />
                                  ) : (
                                    <Volume2 className="w-3 h-3 text-slate-400" />
                                  )}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(message.content)}
                                  className="p-1 hover:bg-slate-100 rounded transition-colors"
                                  title="Copy"
                                >
                                  <Copy className="w-3 h-3 text-slate-400" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleVoiceInput}
                      className={`p-3 rounded-full transition-colors ${
                        isListening 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={t('voiceInput')}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={t('askQuestion')}
                      className="flex-1 px-4 py-3 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      disabled={isLoading}
                    />
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                      className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                  
                  {/* Voice Status */}
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-center gap-2 text-sm text-red-500"
                    >
                      <Mic className="w-4 h-4 animate-pulse" />
                      <span>{t('listening')}</span>
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Context Provider for Chatbot
// (useState is already imported at the top of the file)

const ChatbotContext = createContext();

export function ChatbotProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState(null);

  const openChatbot = (contextData = null) => {
    setContext(contextData);
    setIsOpen(true);
  };

  const closeChatbot = () => {
    setIsOpen(false);
    setContext(null);
  };

  return (
    <ChatbotContext.Provider value={{ isOpen, openChatbot, closeChatbot, context }}>
      {children}
      <Chatbot initialMessage={context} context={context} />
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}
