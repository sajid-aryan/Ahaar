import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, MessageCircle } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Ahaar assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

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

  // FAQ responses
  const getFAQResponse = (message) => {
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
    
    if (lowerMessage.includes('profile') || lowerMessage.includes('manage profile')) {
      return "🔧 **Profile Management:** \n\n**For NGOs:** Click your name → 'Manage Profile' to update organization details, add needs, and manage donations received. \n\n**For Individual/Restaurant Users:** Click your name → 'Manage Profile' to update personal info, add phone number, and view your donation statistics including total donations made and money donated. \n\n**Profile Stats:** Track your donation count and total money donated to see your impact!";
    }
    
    if (lowerMessage.includes('ngo') && (lowerMessage.includes('profile') || lowerMessage.includes('create'))) {
      return "NGOs can create profiles by: 1) Signing up as an NGO, 2) Going to 'Manage Profile', 3) Adding organization details, logo, and current needs. Your profile will be visible to donors.";
    }
    
    if (lowerMessage.includes('stats') || lowerMessage.includes('statistics') || lowerMessage.includes('track donations')) {
      return "📊 **Donation Statistics:** Once logged in, go to 'Manage Profile' to view: \n• Total donations made (counted when claimed by NGOs) \n• Total money donated \n• Member since date \n• Last login \n\nYour donation count increases when NGOs claim your donations, showing real impact!";
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return "We accept Credit Cards, Debit Cards, bKash, and Bank Transfers. All payments are processed securely. You'll receive a transaction ID after successful donation.";
    }
    
    if (lowerMessage.includes('track') || lowerMessage.includes('history') || lowerMessage.includes('my donations')) {
      return "📋 **Track Your Donations:** \n1) Log in to your account \n2) Click 'My Donations' to see donation history \n3) View donation status updates \n4) Use 'View My Donations' button on your profile page \n\nYou can also see your overall donation statistics in your profile!";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! You can ask me about: donations, creating accounts, NGO profiles, payments, tracking donations, profile management, donation statistics, or any other questions about Ahaar.";
    }
    
    if (lowerMessage.includes('security') || lowerMessage.includes('safe')) {
      return "Your security is our priority. We use encrypted connections, secure payment processing, and verified NGO profiles. All personal information is protected.";
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('medical') || lowerMessage.includes('clothing')) {
      return "You can find organizations needing food, medical supplies, or clothing by browsing NGO profiles. Each organization lists their current needs and priorities.";
    }
    
    // Default response
    return "I'm not sure about that specific question. You can ask me about donations, creating accounts, NGO profiles, payments, profile management, donation statistics, or contact our support team for more detailed assistance.";
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
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getFAQResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
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
            className="absolute bottom-20 right-0 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-green-500 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="mr-2" size={20} />
                <span className="font-semibold">Ahaar Assistant</span>
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
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'bg-gradient-to-r from-pink-500 to-green-500 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
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
