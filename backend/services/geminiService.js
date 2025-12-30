import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
  console.warn('⚠️  GEMINI_API_KEY is not configured in .env file. AI features will use fallback data.');
}

// Initialize Gemini AI
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Use the gemini-pro model (only if API key is available)
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : null;

/**
 * Generate dynamic interview questions using AI
 * @param {string} type - Interview type (Technical, Behavioral, HR)
 * @param {string} difficulty - Difficulty level (Easy, Medium, Hard)
 * @param {number} count - Number of questions to generate
 * @param {Object} userProfile - User profile information
 * @returns {Promise<Array>} Array of interview questions
 */
export async function generateInterviewQuestions(type, difficulty, count, userProfile = {}) {
  console.log('=== GEMINI API CALL START ===');
  console.log('Type:', type);
  console.log('Difficulty:', difficulty);
  console.log('Count:', count);
  console.log('User Profile:', JSON.stringify(userProfile, null, 2));
  console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
  console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
  console.log('API Key starts with:', process.env.GEMINI_API_KEY?.substring(0, 10) || 'N/A');
  
  // Check if API key is configured
  if (!model || !genAI) {
    console.error('=== API KEY NOT CONFIGURED ===');
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file.');
  }
  
  try {
    const skills = userProfile.skills?.join(', ') || 'general software development';
    const prompt = `You are an expert interview coach. Generate ${count} ${difficulty.toLowerCase()} ${type} interview questions.

User Profile:
- Skills: ${skills}
- Goals: ${userProfile.goals || 'Software engineering role'}

Generate questions that are:
1. Relevant to ${type} interviews
2. Appropriate for ${difficulty} difficulty level
3. Practical and realistic
4. Specific enough to test knowledge but open-ended for discussion

IMPORTANT: Return ONLY a valid JSON array with this exact format (no markdown, no code blocks, no explanation):
[
  {
    "id": "unique-id-1",
    "question": "Question text here",
    "hint": "Helpful hint for the question",
    "type": "${type}",
    "difficulty": "${difficulty}",
    "estimatedTime": 300
  }
]`;
    
    console.log('Sending prompt to Gemini...');
    console.log('Prompt length:', prompt.length);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response - remove markdown code blocks if present
    text = text.trim();
    console.log('Cleaned text length:', text.length);
    
    // Remove markdown code blocks
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n?/i, '').replace(/\n?```$/i, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
    }
    
    // Try to extract JSON if it's wrapped in other text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      text = jsonMatch[0];
      console.log('Extracted JSON from response');
    }
    
    console.log('Cleaned JSON preview:', text.substring(0, 200) + '...');
    
    const questions = JSON.parse(text);
    console.log('Successfully parsed JSON');
    console.log('Parsed data type:', Array.isArray(questions) ? 'Array' : typeof questions);
    const parsedQuestions = Array.isArray(questions) ? questions : [questions];
    
    // Validate questions structure
    if (parsedQuestions.length === 0) {
      throw new Error('AI generated empty question list');
    }
    
    // Ensure each question has required fields
    const validQuestions = parsedQuestions.map((q, index) => ({
      id: q.id || `q-${index + 1}-${Date.now()}`,
      question: q.question || 'Question text missing',
      hint: q.hint || 'Think carefully about your answer.',
      type: q.type || type,
      difficulty: q.difficulty || difficulty,
      estimatedTime: q.estimatedTime || 300,
    }));
    
    console.log('Number of questions generated:', validQuestions.length);
    console.log('=== GEMINI API CALL SUCCESS ===');
    return validQuestions;
  } catch (error) {
    console.error('=== GEMINI API CALL FAILED ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Provide more specific error messages
    if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
    } else if (error.message?.includes('JSON') || error.message?.includes('parse')) {
      throw new Error(`AI response format error: ${error.message}. The AI may have returned invalid JSON.`);
    } else if (error.message?.includes('QUOTA') || error.message?.includes('429') || error.message?.includes('rate limit')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
      throw new Error('API key permission denied. Please check if your API key is valid and has proper permissions.');
    } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      throw new Error('API key authentication failed. Please verify your API key.');
    } else {
      throw new Error(`Failed to generate questions: ${error.message || 'Unknown error'}`);
    }
  }
}

/**
 * Evaluate user's answer using AI
 * @param {string} question - The interview question
 * @param {string} answer - User's answer
 * @param {Object} context - Additional context (type, difficulty, etc.)
 * @returns {Promise<Object>} Evaluation result with score, feedback, etc.
 */
export async function evaluateAnswer(question, answer, context = {}) {
  try {
    const prompt = `You are an expert interview evaluator. Evaluate the following interview answer.

Question: "${question}"
Question Type: ${context.type || 'General'}
Difficulty: ${context.difficulty || 'Medium'}

Answer: "${answer}"

Evaluate this answer and provide a comprehensive assessment. Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "score": 85,
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "feedback": "Overall detailed feedback in 2-3 sentences explaining the score and key points.",
  "improvementAreas": ["Area 1", "Area 2"]
}

Scoring Guidelines:
- 90-100: Excellent answer, comprehensive and well-structured
- 75-89: Good answer with minor gaps
- 60-74: Acceptable but needs improvement
- 40-59: Below average, significant gaps
- 0-39: Poor answer, lacks understanding

Be constructive and specific in your feedback.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const evaluation = JSON.parse(text);
    
    // Ensure score is between 0-100
    evaluation.score = Math.max(0, Math.min(100, evaluation.score || 0));
    
    // Ensure arrays exist
    evaluation.strengths = evaluation.strengths || [];
    evaluation.weaknesses = evaluation.weaknesses || [];
    evaluation.suggestions = evaluation.suggestions || [];
    evaluation.improvementAreas = evaluation.improvementAreas || [];
    evaluation.feedback = evaluation.feedback || 'No feedback provided.';

    return evaluation;
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw new Error('Failed to evaluate answer. Please try again.');
  }
}

/**
 * Generate personalized learning path based on user stats
 * @param {Object} userStats - User statistics and performance data
 * @param {Array} weaknesses - Identified weak areas
 * @returns {Promise<Object>} Personalized learning path
 */
export async function generatePersonalizedLearningPath(userStats = {}, weaknesses = []) {
  try {
    const skills = userStats.skills?.join(', ') || 'general programming';
    const weakAreas = weaknesses.join(', ') || 'none identified yet';
    const averageScore = userStats.averageScore || 0;

    const prompt = `You are a career coach and learning path specialist. Create a personalized learning path for interview preparation.

User Profile:
- Skills: ${skills}
- Average Interview Score: ${averageScore}/100
- Weak Areas: ${weakAreas}
- Goals: ${userStats.goals || 'Success in technical interviews'}

Generate a comprehensive, actionable learning path. Return ONLY a valid JSON object (no markdown, no code blocks):
{
  "topics": [
    {
      "id": "topic-1",
      "name": "Topic Name",
      "priority": "High|Medium|Low",
      "description": "Why this topic is important",
      "estimatedHours": 10,
      "completed": false
    }
  ],
  "goals": [
    "Goal 1",
    "Goal 2",
    "Goal 3"
  ],
  "estimatedTimeToImprovement": "2-3 weeks",
  "recommendations": "Personalized recommendation text explaining the learning path strategy."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const learningPath = JSON.parse(text);
    
    // Ensure arrays exist
    learningPath.topics = learningPath.topics || [];
    learningPath.goals = learningPath.goals || [];
    learningPath.estimatedTimeToImprovement = learningPath.estimatedTimeToImprovement || '2-3 weeks';
    learningPath.recommendations = learningPath.recommendations || 'Focus on consistent practice.';

    return learningPath;
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw new Error('Failed to generate learning path. Please try again.');
  }
}

/**
 * Generate MCQ questions for practice
 * @param {string} topic - Topic/subject area
 * @param {string} difficulty - Difficulty level (Easy, Medium, Hard)
 * @param {number} count - Number of questions to generate
 * @returns {Promise<Array>} Array of MCQ questions
 */
export async function generateMCQQuestions(topic, difficulty, count) {
  try {
    const prompt = `You are an expert quiz creator. Generate ${count} multiple-choice questions (MCQ) for practice.

Topic: ${topic}
Difficulty: ${difficulty}

Generate high-quality MCQ questions with:
1. Clear, unambiguous question text
2. 4 answer options (A, B, C, D)
3. Exactly ONE correct answer
4. Detailed explanation for the correct answer
5. Brief explanation for why other options are incorrect

Return ONLY a valid JSON array (no markdown, no code blocks):
[
  {
    "id": "mcq-1",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Detailed explanation of why this is correct and why others are wrong.",
    "topic": "${topic}",
    "difficulty": "${difficulty}"
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up the response
    text = text.trim();
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    const questions = JSON.parse(text);
    return Array.isArray(questions) ? questions : [questions];
  } catch (error) {
    console.error('Error generating MCQ questions:', error);
    throw new Error('Failed to generate MCQ questions. Please try again.');
  }
}

/**
 * Chat with AI study buddy
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Previous messages in conversation
 * @returns {Promise<string>} AI's response
 */
export async function chatWithAIBuddy(userMessage, conversationHistory = []) {
  try {
    // Build context from conversation history (last 5 messages)
    const recentHistory = conversationHistory.slice(-5);
    let historyContext = '';
    
    if (recentHistory.length > 0) {
      historyContext = '\n\nConversation History:\n';
      recentHistory.forEach(msg => {
        historyContext += `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}\n`;
      });
    }

    const prompt = `You are PrepMaster AI, a friendly and helpful interview preparation assistant. Your role is to:
- Answer questions about interview preparation
- Provide tips and advice on technical and behavioral interviews
- Help users understand concepts and solve problems
- Encourage and motivate users in their interview journey
- Keep responses concise (2-3 sentences unless user asks for more detail)
- Be encouraging, professional, and supportive

User Question: "${userMessage}"${historyContext}

Provide a helpful, concise response. Do not use markdown formatting, just plain text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    return text;
  } catch (error) {
    console.error('Error in AI chat:', error);
    throw new Error('Failed to get AI response. Please try again.');
  }
}

