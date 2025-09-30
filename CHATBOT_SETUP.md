# Gemini AI Chatbot Integration

## Setup Instructions

### 1. **Get Your Gemini API Key**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. **Add API Key to Environment**
1. Open `backend/.env` file
2. Replace `your_gemini_api_key_here` with your actual API key:
```
GEMINI_API_KEY=AIzaSyB_your_actual_api_key_here
```

### 3. **Restart the Backend Server**
After adding the API key, restart your backend server:
```bash
cd backend
npm start
```

## Features

### ✅ **AI-Powered Responses**
- Context-aware conversations about Ahaar platform
- Understands user intent and provides relevant guidance
- Maintains conversation history for better context

### ✅ **Smart Fallback System**
- Falls back to basic FAQ responses if AI is unavailable
- Visual indicators show when AI vs basic mode is active
- Graceful error handling ensures chatbot always works

### ✅ **Platform-Specific Knowledge**
The AI assistant is trained on Ahaar platform information:
- Food donation processes
- Money donation workflows
- Account creation and management
- NGO profile setup
- Rating and review system
- Platform features and navigation

### ✅ **Enhanced UI**
- Connection status indicator (AI Powered vs Basic Mode)
- Message timestamps
- AI response indicators
- Improved styling with better visual feedback

## API Endpoint

**POST** `/api/chatbot/chat`

**Request Body:**
```json
{
  "message": "How do I create a food donation?",
  "conversationHistory": [
    {
      "text": "Previous message",
      "isBot": true,
      "timestamp": "2025-09-30T10:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "To create a food donation, follow these steps...",
  "fallback": false
}
```

## Testing the Chatbot

### 1. **Test AI Functionality**
Ask questions like:
- "How do I donate food?"
- "What's the difference between food and money donations?"
- "How do I create an NGO account?"
- "Can you explain the rating system?"

### 2. **Test Fallback Mode**
- Use invalid API key to test fallback responses
- Check that basic FAQ still works when AI is unavailable

### 3. **Test Conversation Context**
- Have a multi-turn conversation
- Ask follow-up questions that reference previous messages
- Test if AI maintains context throughout the conversation

## Customization

### **Modify AI Context**
Edit `backend/src/controllers/chatbotController.js` to:
- Update platform information
- Add new features to AI knowledge
- Modify response style and tone
- Add specific use cases

### **Add New Fallback Responses**
Update the `getFallbackResponse` function for new FAQ topics.

### **Styling**
Modify `frontend/src/components/Chatbot.jsx` to:
- Change colors and styling
- Add new UI features
- Modify chat window size or position

## Monitoring and Debugging

### **Backend Logs**
The chatbot controller includes detailed logging:
- Message processing
- AI response generation
- Error handling
- Fallback activation

### **Frontend Status**
The UI shows:
- Connection status (green = AI active, red = fallback mode)
- AI response indicators
- Error messages when needed

## Security Considerations

- API key is stored securely in environment variables
- No sensitive user data is sent to Gemini
- Conversation history is limited to prevent token overuse
- Fallback system ensures availability even during API issues

## Future Enhancements

1. **User Context**: Include user login status for personalized responses
2. **Rich Responses**: Add buttons and quick actions to responses  
3. **Analytics**: Track common questions and user satisfaction
4. **Multi-language**: Support for multiple languages
5. **Voice Integration**: Add voice input/output capabilities

The AI chatbot is now ready to provide intelligent, context-aware assistance to your Ahaar platform users!
