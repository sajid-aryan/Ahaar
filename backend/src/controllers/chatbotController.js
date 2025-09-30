import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test API key function
async function testApiKey() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Hello");
    console.log('✅ Gemini API key is working correctly');
    return true;
  } catch (error) {
    console.error('❌ Gemini API key test failed:', error.message);
    return false;
  }
}

// Test the API key on startup
testApiKey();

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
You are a helpful assistant for Ahaar, a donation platform connecting donors with NGOs.

PLATFORM FEATURES:
- Money donations to NGOs through secure payment
- Food and item donations for pickup
- NGO profiles with needs and contact info
- User accounts for donors and organizations

MONEY DONATION STEPS:
1. Login to account
2. Go to NGO Profiles page
3. Select an organization
4. Choose a financial need
5. Click Donate Now
6. Enter amount and payment details
7. Complete transaction

ITEM DONATION STEPS:
1. Login to account
2. Click Create Donation
3. Fill item details and location
4. Add photos
5. Submit for NGOs to claim

ACCOUNT SETUP:
1. Click Sign Up
2. Choose user type
3. Fill registration form
4. Verify email
5. Complete profile

Always provide clear, numbered steps. Be helpful and encouraging.
`;

    // Build conversation context with simpler formatting
    let conversationContext = systemContext + "\n\nUser question: " + message + "\n\nResponse:";

    // Use simpler generation parameters to avoid filtering
    const generationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 1024,
    };

    // Generate response
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: conversationContext }] }],
      generationConfig,
    });
    const response = await result.response;
    const botReply = response.text();

    res.status(200).json({
      success: true,
      message: botReply
    });

  } catch (error) {
    console.error('Error in chatbot:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check if it's an API key issue
    if (error.message && error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        message: 'API configuration error. Please check the API key.',
        error: 'API_KEY_ERROR'
      });
    }
    
    // Check if it's a content filtering issue
    if (error.message && (error.message.includes('filtered') || error.message.includes('safety'))) {
      console.log('Content was filtered, using fallback response');
    }
    
    // Enhanced fallback responses
    const fallbackResponse = getFallbackResponse(req.body.message);
    
    res.status(200).json({
      success: true,
      message: fallbackResponse,
      fallback: true,
      errorType: error.message || 'Unknown error'
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
