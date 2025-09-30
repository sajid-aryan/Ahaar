import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function chatWithBot(req, res) {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Enhanced context with detailed step-by-step instructions
    const systemContext = `
You are an AI assistant for Ahaar, a food donation platform that connects food donors with NGOs to reduce food waste and help those in need. 

🔹 MONEY DONATIONS - Complete Step-by-Step Process:
Step 1: Make sure you're logged into your Ahaar account (money donations require login)
Step 2: Click on "NGO Profiles" in the main navigation menu
Step 3: Browse through the list of verified NGO organizations
Step 4: Click on an NGO's name or profile to view their details
Step 5: On the NGO profile page, scroll down to the "How You Can Help" section
Step 6: Look for financial needs that show "Donate Now" buttons
Step 7: Click the "Donate Now" button on a financial need you want to support
Step 8: In the donation form, enter your donation amount (minimum $1)
Step 9: Select your preferred payment method (Credit Card, Debit Card, bKash, or Bank Transfer)
Step 10: Add an optional message of support for the NGO
Step 11: Review your donation details and click "Donate" to process
Step 12: You'll receive a transaction ID confirmation once payment is successful

🔹 FOOD DONATIONS - Complete Step-by-Step Process:
Step 1: Log into your Ahaar account
Step 2: Click "Create Donation" in the main navigation menu
Step 3: Fill out the donation form:
   - Title: Brief description of items
   - Category: Choose Food, Clothing, Medical, or Other
   - Description: Detailed information about items
   - Quantity: How much you're donating
   - Location: Where items can be picked up
   - Expiry Date: When items will no longer be good
   - Pickup Instructions: Special instructions for collection
   - Contact Phone: Your contact number
Step 4: Upload a photo of the items (recommended)
Step 5: Click "Create Donation" to publish
Step 6: NGOs will see your donation in browse page
Step 7: When an NGO claims it, you'll be notified
Step 8: Coordinate pickup with the claiming NGO

🔹 ACCOUNT CREATION:
For Users: Sign Up → Choose user type (Individual/Restaurant/NGO) → Fill details → Create account
For NGOs: Also go to "Manage Profile" after signup to create organization profile

IMPORTANT: 
- ALWAYS provide specific numbered steps when users ask "how to" questions
- Be encouraging about community impact
- Mention login requirements clearly
- Use clear, actionable language
- Format responses with proper step numbering

Payment methods: Credit Cards, Debit Cards, bKash, Bank Transfer
`;

    // Build conversation context
    let conversationContext = systemContext + "\n\nCONVERSATION HISTORY:\n";
    
    // Add recent conversation history (last 8 messages to avoid token limits)
    const recentHistory = conversationHistory.slice(-8);
    recentHistory.forEach(msg => {
      conversationContext += `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}\n`;
    });
    
    conversationContext += `\nUser: ${message}\nAssistant:`;

    // Generate response
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const botReply = response.text();

    res.status(200).json({
      success: true,
      message: botReply
    });

  } catch (error) {
    console.error('Error in chatbot:', error);
    
    // Enhanced fallback responses
    const fallbackResponse = getFallbackResponse(req.body.message);
    
    res.status(200).json({
      success: true,
      message: fallbackResponse,
      fallback: true
    });
  }
}

// Enhanced fallback responses with detailed steps
function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('money') && lowerMessage.includes('donation')) {
    return `Here's how to make money donations step-by-step:

Step 1: Make sure you're logged into your Ahaar account
Step 2: Click on "NGO Profiles" in the main navigation
Step 3: Browse and select an NGO organization
Step 4: Click on the NGO's profile to view their details
Step 5: Find the "How You Can Help" section with financial needs
Step 6: Click "Donate Now" on a need you want to support
Step 7: Enter your donation amount (minimum $1)
Step 8: Choose payment method (Credit Card, Debit Card, bKash, Bank Transfer)
Step 9: Add an optional support message
Step 10: Click "Donate" to complete the transaction
Step 11: You'll receive a transaction ID as confirmation

Your donation will help NGOs continue their important work! 💝`;
  }
  
  if (lowerMessage.includes('food') && lowerMessage.includes('donation')) {
    return `Here's how to create food donations step-by-step:

Step 1: Log into your Ahaar account
Step 2: Click "Create Donation" in the navigation
Step 3: Fill out the form with:
   - Title (brief description)
   - Category (Food/Clothing/Medical/Other)
   - Description (detailed info)
   - Quantity and location
   - Expiry date and pickup instructions
Step 4: Upload a photo of the items
Step 5: Click "Create Donation"
Step 6: Wait for NGOs to claim your donation
Step 7: Coordinate pickup when claimed

This helps reduce food waste and feeds those in need! 🍽️`;
  }
  
  if (lowerMessage.includes('account') || lowerMessage.includes('sign up')) {
    return `Here's how to create an account:

Step 1: Click "Sign Up" in the top-right corner
Step 2: Choose your user type:
   - Individual (for personal donors)
   - Restaurant (for business donors)
   - NGO (for organizations)
Step 3: Fill in your details (name, email, password)
Step 4: Click "Sign Up" to create account
Step 5: Log in with your new credentials

For NGOs: After signup, go to "Manage Profile" to create your organization profile and add your needs.`;
  }
  
  if (lowerMessage.includes('help')) {
    return "I can help you with detailed step-by-step instructions for:\n\n• Making money donations to NGOs\n• Creating food donations\n• Setting up accounts\n• Managing profiles\n• Tracking donations\n\nWhat specific process would you like me to explain?";
  }
  
  return "I'm here to help you with Ahaar! I can provide detailed step-by-step instructions for donations, account setup, and using platform features. What would you like to know about?";
}
