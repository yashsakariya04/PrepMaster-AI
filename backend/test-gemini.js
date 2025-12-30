import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

async function testGeminiAPI() {
  console.log('\n=== TESTING GEMINI API ===\n');
  console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
  console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
  console.log('API Key preview:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'Not set');
  
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '' || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.error('\n❌ ERROR: GEMINI_API_KEY not found or not configured in environment variables');
    console.error('Please set GEMINI_API_KEY in your .env file');
    return;
  }
  
  try {
    console.log('\nInitializing Gemini AI...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try gemini-pro first, fallback to gemini-1.5-flash
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      console.log('Using model: gemini-pro');
    } catch (modelError) {
      console.log('gemini-pro not available, trying gemini-1.5-flash...');
      model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      console.log('Using model: gemini-1.5-flash');
    }
    
    console.log('Sending test prompt...');
    const result = await model.generateContent('Say "Hello, Gemini API is working!" in one sentence.');
    const response = result.response.text();
    
    console.log('\n✅ SUCCESS! API is working!');
    console.log('Response:', response);
    console.log('\n=== TEST COMPLETE ===\n');
  } catch (error) {
    console.error('\n❌ FAILED! Error details:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.message?.includes('API_KEY')) {
      console.error('\n💡 Suggestion: Check if your API key is valid at https://makersuite.google.com/app/apikey');
    } else if (error.message?.includes('QUOTA')) {
      console.error('\n💡 Suggestion: You may have exceeded your API quota. Check Google AI Studio.');
    } else if (error.message?.includes('PERMISSION')) {
      console.error('\n💡 Suggestion: Your API key may not have the required permissions.');
    }
    console.error('\n=== TEST FAILED ===\n');
  }
}

testGeminiAPI();

