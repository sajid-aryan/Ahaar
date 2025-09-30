import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI-powered Ahaar assistant. I can help you with donations, account management, and answer any questions about our platform. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Wiggle animation effect
  useEffect(() => {
    if (!isOpen) {
      const wiggleInterval = setInterval(() => {
        setWiggle(true);
        setTimeout(() => setWiggle(false), 1000);
      }, 4000);

      return () => clearInterval(wiggleInterval);
    }
  }, [isOpen]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to AI backend
  const sendMessageToAI = async (message, conversationHistory) => {
    try {
      const response = await axios.post('http://localhost:3004/api/chatbot/chat', {
        message,
        conversationHistory
      });
      
      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          fallback: response.data.fallback || false
        };
      } else {
        throw new Error('AI response failed');
      }
    } catch (error) {
      console.error('AI chat error:', error);
      setIsConnected(false);
      
      // Fallback to basic responses
      return {
        success: true,
        message: getFallbackResponse(message),
        fallback: true
      };
    }
  };

  // Basic fallback responses when AI is unavailable
  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('how') && (lowerMessage.includes('donate') || lowerMessage.includes('donation'))) {
      return "There are two ways to help: \n\n📤 **Create a Donation:** Share items you want to donate by going to 'Create Donation' (login required). List food, clothing, or other items for NGOs to claim. \n\n💰 **Make Money Donations:** 1) Browse NGO profiles, 2) Click on an organization, 3) Select a financial need, 4) Click 'Donate Now', 5) Fill in the amount and payment details. You must be logged in to donate money.";
    }
    
    if (lowerMessage.includes('create') && (lowerMessage.includes('donate') || lowerMessage.includes('donation'))) {
      return "To create a donation: 1) Log in to your account, 2) Click 'Create Donation' in the navigation, 3) Fill in item details (type, quantity, location), 4) Add photos and description, 5) Submit for NGOs to browse and claim. This helps connect your items with organizations that need them!";
    }
    
    if (lowerMessage.includes('sign up') || lowerMessage.includes('signup') || lowerMessage.includes('register') || lowerMessage.includes('account')) {
      return "To create an account: 1) Click 'Sign Up' in the top right, 2) Choose 'Donor' or 'NGO', 3) Fill in your details, 4) Verify your email. NGOs can create profiles to receive donations.";
    }
    
    if (lowerMessage.includes('help')) {
      return "I'm here to help! You can ask me about: donations, creating accounts, NGO profiles, payments, tracking donations, profile management, or any other questions about Ahaar. (Note: AI features are temporarily unavailable)";
    }
    
    return "I'm here to help you with Ahaar! You can ask me about donations, creating accounts, NGO profiles, or any questions about using our platform. What would you like to know? (Note: AI features are temporarily unavailable)";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Send message to AI with conversation history
      const aiResponse = await sendMessageToAI(currentInput, messages);
      
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: aiResponse.message,
          isBot: true,
          timestamp: new Date(),
          isAI: !aiResponse.fallback
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        
        // Reset connection status if AI is working
        if (!aiResponse.fallback && !isConnected) {
          setIsConnected(true);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again in a moment, or ask me about donations, accounts, or platform features!",
        isBot: true,
        timestamp: new Date(),
        isAI: false
      };
      
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={chatRef} className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 right-0 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="mr-2" size={20} />
                <div>
                  <span className="font-semibold">Ahaar AI Assistant</span>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-300' : 'bg-red-300'}`}></div>
                    <span className="text-xs opacity-90">
                      {isConnected ? 'AI Powered' : 'Basic Mode'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-3 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-white text-gray-800 shadow-sm border-l-4 border-l-pink-500'
                        : 'bg-gradient-to-r from-pink-500 to-green-500 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.isBot && (
                        <div className="flex items-center">
                          {message.isAI !== false && (
                            <span className="text-xs opacity-60 ml-2 flex items-center">
                              <Bot className="w-3 h-3 mr-1" />
                              AI
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="mb-3 flex justify-start">
                  <div className="bg-white text-gray-800 shadow-sm p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-pink-500 to-green-500 text-white px-3 py-2 rounded-lg hover:from-pink-600 hover:to-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: wiggle && !isOpen ? [0, -10, 10, -10, 10, 0] : 0,
          scale: wiggle && !isOpen ? [1, 1.05, 1, 1.05, 1] : 1
        }}
        transition={{
          duration: wiggle ? 1 : 0.2,
          ease: "easeInOut"
        }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 ${
          isOpen 
            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
            : 'bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-600 hover:to-green-600'
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default Chatbot;
