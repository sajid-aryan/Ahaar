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
  const [isAiAvailable, setIsAiAvailable] = useState(false); // Track AI availability
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
        setIsAiAvailable(true); // AI is working
        setIsConnected(true);
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
      setIsAiAvailable(false); // AI is not available
      
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
    
    // Money donation specific responses
    if (lowerMessage.includes('money') || lowerMessage.includes('cash') || lowerMessage.includes('financial')) {
      if (lowerMessage.includes('how') || lowerMessage.includes('give') || lowerMessage.includes('donate')) {
        return "💰 **How to Give Money - Step by Step:**\n\n" +
               "**Step 1:** Browse NGO Profiles\n" +
               "• Click 'NGO Profiles' in the navigation\n" +
               "• Browse organizations that need funding\n\n" +
               "**Step 2:** Select an NGO\n" +
               "• Click 'View Full Profile' on any NGO card\n" +
               "• Review their mission and current needs\n\n" +
               "**Step 3:** Choose a Financial Need\n" +
               "• Look for needs marked with 💰 (money)\n" +
               "• See the target amount and current progress\n\n" +
               "**Step 4:** Make Your Donation\n" +
               "• Click 'Donate Now' button\n" +
               "• Enter your donation amount\n" +
               "• Fill in payment details securely\n\n" +
               "**Step 5:** Track Your Impact\n" +
               "• View donation confirmation\n" +
               "• See real-time progress updates\n\n" +
               "⚠️ **Note:** You must be logged in to make money donations.";
      }
    }
    
    if (lowerMessage.includes('how') && (lowerMessage.includes('donate') || lowerMessage.includes('donation'))) {
      return "📋 **How to Donate - Complete Guide:**\n\n" +
             "**For Physical Items (Food, Clothes, etc.):**\n" +
             "1️⃣ Log in to your account\n" +
             "2️⃣ Click 'Create Donation'\n" +
             "3️⃣ Fill item details (type, quantity, location)\n" +
             "4️⃣ Add photos and description\n" +
             "5️⃣ Submit for NGOs to claim\n\n" +
             "**For Money Donations:**\n" +
             "1️⃣ Go to 'NGO Profiles'\n" +
             "2️⃣ Choose an organization\n" +
             "3️⃣ Select a financial need (💰)\n" +
             "4️⃣ Click 'Donate Now'\n" +
             "5️⃣ Enter amount and payment details\n\n" +
             "**Need help?** Ask me specific questions like 'How do I give money?' or 'How do I donate food?'";
    }
    
    if (lowerMessage.includes('create') && (lowerMessage.includes('donate') || lowerMessage.includes('donation'))) {
      return "📤 **Create a Donation - Step by Step:**\n\n" +
             "**Step 1:** Login Required\n" +
             "• Must be logged in as a 'Donor'\n" +
             "• Click 'Login' if not already signed in\n\n" +
             "**Step 2:** Start Creating\n" +
             "• Click 'Create Donation' in navigation\n" +
             "• You'll see the donation form\n\n" +
             "**Step 3:** Item Details\n" +
             "• Choose category (Food, Clothing, Medical, Other)\n" +
             "• Enter quantity and description\n" +
             "• Add pickup location\n\n" +
             "**Step 4:** Add Photos\n" +
             "• Upload clear photos of items\n" +
             "• This helps NGOs see what you're offering\n\n" +
             "**Step 5:** Submit\n" +
             "• Review all details\n" +
             "• Click 'Create Donation'\n" +
             "• NGOs can now browse and claim your items!";
    }
    
    if (lowerMessage.includes('sign up') || lowerMessage.includes('signup') || lowerMessage.includes('register') || lowerMessage.includes('account')) {
      return "🔐 **Create Account - Step by Step:**\n\n" +
             "**Step 1:** Choose Sign Up\n" +
             "• Click 'Sign Up' button (top right)\n" +
             "• You'll see the registration form\n\n" +
             "**Step 2:** Select User Type\n" +
             "• **Donor:** For individuals/restaurants donating\n" +
             "• **NGO:** For organizations receiving donations\n\n" +
             "**Step 3:** Fill Details\n" +
             "• Enter name, email, password\n" +
             "• Add phone number (optional)\n" +
             "• For NGOs: Add organization details\n\n" +
             "**Step 4:** Verify Email\n" +
             "• Check your email for verification\n" +
             "• Click the verification link\n\n" +
             "**Step 5:** Complete Profile\n" +
             "• Log in with your credentials\n" +
             "• Complete your profile information\n" +
             "• Start donating or receiving donations!";
    }
    
    if (lowerMessage.includes('ngo') && (lowerMessage.includes('profile') || lowerMessage.includes('find') || lowerMessage.includes('help'))) {
      return "🏢 **Find & Help NGOs - Step by Step:**\n\n" +
             "**Step 1:** Browse NGOs\n" +
             "• Click 'NGO Profiles' in navigation\n" +
             "• See all registered organizations\n\n" +
             "**Step 2:** Explore Profiles\n" +
             "• Click 'View Full Profile' on any NGO\n" +
             "• Read their mission and current needs\n\n" +
             "**Step 3:** Choose How to Help\n" +
             "• **Physical Items:** Create donations they need\n" +
             "• **Money:** Click 'Donate Now' for financial needs\n" +
             "• **Awareness:** Share their profile\n\n" +
             "**Step 4:** Make Your Contribution\n" +
             "• Follow donation steps based on your choice\n" +
             "• Track your impact on their progress\n\n" +
             "**Need specific help?** Ask 'How do I give money?' or 'How do I donate food?'";
    }
    
    if (lowerMessage.includes('browse') && lowerMessage.includes('donation')) {
      return "🔍 **Browse Donations - Step by Step:**\n\n" +
             "**Step 1:** Access Browse Page\n" +
             "• Click 'Browse Donations' (login required)\n" +
             "• See all available donations\n\n" +
             "**Step 2:** Filter Items\n" +
             "• Use category filters (Food, Clothing, Medical, etc.)\n" +
             "• Find items your organization needs\n\n" +
             "**Step 3:** Review Details\n" +
             "• Check item descriptions and photos\n" +
             "• See pickup location and instructions\n" +
             "• View donor contact information\n\n" +
             "**Step 4:** Claim Donations (NGOs only)\n" +
             "• Click 'Claim' button on desired items\n" +
             "• Contact donor for pickup coordination\n\n" +
             "**Note:** Only NGOs can claim donations. Donors can browse to see platform activity.";
    }
    
    if (lowerMessage.includes('help')) {
      return "🤝 **I'm here to help! Here's what I can guide you through:**\n\n" +
             "**Money Donations:**\n" +
             "• Ask: 'How do I give money?'\n" +
             "• Step-by-step payment process\n\n" +
             "**Item Donations:**\n" +
             "• Ask: 'How do I donate food/clothes?'\n" +
             "• Creating and managing donations\n\n" +
             "**Account Setup:**\n" +
             "• Ask: 'How do I sign up?'\n" +
             "• Registration and profile setup\n\n" +
             "**Finding NGOs:**\n" +
             "• Ask: 'How do I find NGOs to help?'\n" +
             "• Browsing and selecting organizations\n\n" +
             "**Platform Navigation:**\n" +
             "• Ask about any specific feature\n" +
             "• I'll provide detailed instructions!\n\n" +
             "*Just type your question and I'll give you step-by-step guidance!*";
    }
    
    return "🤖 **I'm your Ahaar assistant!** I can provide detailed step-by-step instructions for:\n\n" +
           "💰 **Money donations** - Ask 'How do I give money?'\n" +
           "📦 **Item donations** - Ask 'How do I donate food?'\n" +
           "🔐 **Account setup** - Ask 'How do I sign up?'\n" +
           "🏢 **Finding NGOs** - Ask 'How do I help NGOs?'\n" +
           "🔍 **Browse features** - Ask about any platform feature\n\n" +
           "*What would you like step-by-step help with?*\n\n" +
           "*(Note: AI features are temporarily unavailable - using enhanced help mode)*";
  };

  const handleFAQClick = (question) => {
    // Simulate user asking the question
    const userMessage = {
      id: Date.now(),
      text: question,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Get the response from our fallback system
    setTimeout(() => {
      const response = getFallbackResponse(question);
      const botResponse = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
        isAI: false
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 500); // Short delay to simulate thinking
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
              
              {/* FAQ Buttons - Show only when AI is down and conversation just started */}
              {!isAiAvailable && messages.length === 1 && (
                <div className="mb-4">
                  <div className="text-gray-600 text-sm mb-3 text-center font-medium">
                    🚀 Quick Help - Click a topic:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleFAQClick('How do I give money?')}
                      className="p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      💰 Money Donations
                    </button>
                    <button
                      onClick={() => handleFAQClick('How do I donate food?')}
                      className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      🍽️ Donate Items (Food, Clothes)
                    </button>
                    <button
                      onClick={() => handleFAQClick('How do I sign up?')}
                      className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      🔐 Create Account
                    </button>
                    <button
                      onClick={() => handleFAQClick('How do I find NGOs to help?')}
                      className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      🏢 Find NGOs to Help
                    </button>
                    <button
                      onClick={() => handleFAQClick('How do I browse donations?')}
                      className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      🔍 Browse Available Donations
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-gray-500 text-xs">💡 Or type your own question below</div>
                  </div>
                </div>
              )}
              
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
