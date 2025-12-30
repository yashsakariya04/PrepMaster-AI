# Backend Setup Instructions

## Environment Variables Setup

1. Create a `.env` file in the `backend/` directory with the following content:

```env
# Google Gemini API Configuration
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3001
```

2. Replace `your_gemini_api_key_here` with your actual Gemini API key from Google.

## Installing Dependencies

After updating `package.json`, run:

```bash
cd backend
npm install
```

This will install:
- `@google/generative-ai` - Google Gemini AI SDK
- `dotenv` - Environment variable management

## Running the Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### AI-Powered Endpoints

- `POST /api/ai/interview-questions` - Generate dynamic interview questions
- `POST /api/ai/evaluate-answer` - Evaluate user answers
- `POST /api/ai/learning-path` - Generate personalized learning paths
- `POST /api/ai/mcq-questions` - Generate MCQ practice questions
- `POST /api/ai/chat` - Chat with AI study buddy

### Existing Endpoints (Fallback)

- `GET /api/interview-questions` - Static interview questions
- `GET /api/practice-questions` - Static practice questions
- `GET /api/resources` - Learning resources
- `GET /api/user` - User profile
- `POST /api/login` - User login
- `POST /api/signup` - User registration

## Error Handling

All AI endpoints include fallback to static JSON data if the AI service fails, ensuring the application continues to work even if the Gemini API is unavailable.

