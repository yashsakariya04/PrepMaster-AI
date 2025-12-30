# PrepMaster+ AI 🚀

An intelligent, AI-powered Interview Preparation Platform powered by Google Gemini AI. Practice mock interviews, get AI-powered feedback, generate personalized learning paths, and chat with an AI study buddy—all wrapped in a beautiful, modern interface.

![PrepMaster+](https://img.shields.io/badge/PrepMaster+AI-v2.0.0-blue)
![React](https://img.shields.io/badge/React-18.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-powered-purple)

## 📋 Overview

PrepMaster+ AI is an intelligent interview preparation platform that combines cutting-edge AI technology with a beautiful, intuitive interface. Get personalized interview questions, AI-powered answer evaluation, customized learning paths, and an AI study buddy to help you ace your interviews.

## ✨ Features

### 🤖 AI-Powered Features
- **AI Interview Questions** - Dynamically generated questions tailored to your profile
- **AI Answer Evaluation** - Get detailed scores, strengths, weaknesses, and improvement suggestions
- **Personalized Learning Path** - AI-generated study plans based on your performance
- **AI MCQ Generation** - Generate practice questions on any topic and difficulty
- **AI Study Buddy** - Chat with an intelligent assistant for interview tips and guidance

### 🎨 Advanced UI/UX
- **Glassmorphism Design** - Modern frosted glass effects throughout
- **Dark/Light Mode** - Seamless theme switching with system preference detection
- **Smooth Animations** - Framer Motion powered micro-interactions
- **Responsive Design** - Perfect on mobile, tablet, and desktop (375px+)
- **Gradient Buttons** - Eye-catching primary actions with hover effects
- **Loading States** - Beautiful skeletons and spinners for AI operations

### 📊 Dashboard
- **Animated Charts** - Line and bar charts showing performance trends
- **Streak Counter** - Track your daily practice streak
- **Achievement System** - Unlock badges for milestones
- **Quick Stats** - Total interviews, average score, hours practiced
- **AI Insights** - Personalized recommendations and readiness scores

### 🎯 Mock Interviews (AI-Enhanced)
- **Three Interview Types** - Technical, HR, and Behavioral
- **AI-Generated Questions** - Dynamic questions based on type, difficulty, and your profile
- **AI-Powered Evaluation** - Comprehensive feedback with scores and suggestions
- **Timer** - Track time per question
- **Progress Tracking** - Visual progress indicators
- **Hint System** - Get hints for challenging questions

### 📚 Practice MCQ (AI-Enhanced)
- **AI-Generated Questions** - Generate MCQs on any topic and difficulty
- **Topic Selection** - Choose from various topics
- **Detailed Explanations** - Understand why answers are correct/incorrect
- **Score Tracking** - Track performance per topic
- **Improvement Suggestions** - AI-powered recommendations after quizzes

### 📖 Resources
- **Curated Content** - Interview preparation resources
- **Category Filtering** - Filter by Technical, Behavioral, HR, or General
- **Bookmark System** - Save your favorite resources
- **Animated Cards** - Smooth hover effects

### 👤 Profile Management
- **Customizable Profile** - Update name, skills, and goals
- **Theme Toggle** - Switch between light and dark modes
- **Achievement Display** - View all unlocked achievements
- **Statistics Overview** - See your complete progress

### 🏠 Landing Page
- **Hero Section** - Animated gradient text and CTAs
- **Feature Showcase** - Highlight key features
- **Testimonials** - Social proof slider
- **Animated Stats** - Counter animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Chart library for data visualization
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **React Router DOM** - Client-side routing

### Backend
- **Express.js** - Web framework
- **Node.js** - JavaScript runtime
- **Google Gemini AI** - AI-powered features via @google/generative-ai
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **JSON Files** - Lightweight data storage (no database required)

### AI Integration
- **Google Gemini Pro** - Natural language processing and generation
- **Prompt Engineering** - Optimized prompts for interview preparation
- **Fallback System** - Graceful degradation to static data if AI fails

## 📁 Project Structure

```
prepmaster/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── PasswordStrength.tsx
│   │   │   └── StatCard.tsx
│   │   ├── context/           # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useAchievements.ts
│   │   │   ├── useBookmarks.ts
│   │   │   └── useStreak.ts
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Interview.tsx
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── PracticeMCQ.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Resources.tsx
│   │   │   └── Signup.tsx
│   │   ├── services/          # API services
│   │   │   └── aiService.ts   # AI API integration
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts       # All type definitions
│   │   ├── utils/             # Utility functions
│   │   └── data/              # Mock data
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── backend/
    ├── services/              # Backend services
    │   └── geminiService.js   # Gemini AI integration
    ├── data/                  # JSON data files
    │   ├── interview.json
    │   ├── questions.json
    │   ├── resources.json
    │   └── user.json
    ├── server.js              # Express server with AI endpoints
    ├── package.json
    └── .env                   # Environment variables (create this)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prepmaster
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Setup environment variables**
   ```bash
   cd backend
   # Create .env file
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   echo "PORT=3001" >> .env
   ```
   
   Get your Gemini API key from: https://makersuite.google.com/app/apikey

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:3001
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:5173
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
npm start
```

## 🎯 Usage Guide

### First Time Setup
1. Visit the landing page
2. Click "Get Started Free" or "Sign up"
3. Create your account with name, email, and password
4. You'll be redirected to the dashboard

### Taking an AI-Powered Mock Interview
1. Navigate to "Interview" from the dashboard
2. Select interview type (Technical, HR, or Behavioral)
3. Choose difficulty level (Easy, Medium, Hard)
4. AI generates personalized questions based on your profile
5. Answer each question within the time limit
6. Get AI-powered evaluation with:
   - Score (0-100)
   - Strengths and weaknesses
   - Improvement suggestions
   - Detailed feedback
7. Complete the interview and view summary
8. Results are saved to your history

### Practicing AI-Generated MCQs
1. Go to "Practice" from the navigation
2. Select a topic and difficulty level
3. Click "Generate New Questions" to create AI-powered MCQs
4. Answer the questions
5. See instant feedback with detailed explanations
6. Track your score and get improvement suggestions

### Managing Resources
1. Visit the "Resources" page
2. Filter by category using the chips
3. Bookmark your favorite resources
4. Access them anytime from your bookmarks

### Tracking Progress
- View your dashboard for overall stats
- Check your streak counter
- Unlock achievements by completing milestones
- Review your interview history

## 🎨 Design Features

### Glassmorphism
Cards and components use a frosted glass effect with backdrop blur for a modern, premium look.

### Dark Mode
- Automatic system preference detection
- Manual toggle in profile settings
- Smooth theme transitions
- Persistent theme selection

### Animations
- Page transitions with Framer Motion
- Hover effects on interactive elements
- Loading states and micro-interactions
- Chart animations

## 📊 API Endpoints

### Backend API (Port 3001)

#### AI-Powered Endpoints
- `POST /api/ai/interview-questions` - Generate dynamic interview questions
  ```json
  {
    "type": "Technical|Behavioral|HR",
    "difficulty": "Easy|Medium|Hard",
    "count": 5,
    "userProfile": { "skills": [], "goals": "" }
  }
  ```

- `POST /api/ai/evaluate-answer` - Evaluate user's answer
  ```json
  {
    "question": "Question text",
    "answer": "User's answer",
    "context": { "type": "Technical", "difficulty": "Medium" }
  }
  ```

- `POST /api/ai/learning-path` - Generate personalized learning path
  ```json
  {
    "userStats": { "skills": [], "averageScore": 75 },
    "weaknesses": ["Arrays", "Algorithms"]
  }
  ```

- `POST /api/ai/mcq-questions` - Generate MCQ questions
  ```json
  {
    "topic": "JavaScript",
    "difficulty": "Medium",
    "count": 10
  }
  ```

- `POST /api/ai/chat` - Chat with AI study buddy
  ```json
  {
    "userMessage": "How do I prepare for system design interviews?",
    "conversationHistory": []
  }
  ```

#### Static Data Endpoints (Fallback)
- `GET /api/interview-questions` - Get static interview questions
- `GET /api/practice-questions` - Get static MCQ questions
- `GET /api/resources` - Get all resources
- `GET /api/user` - Get user data
- `POST /api/login` - Authenticate user
- `POST /api/signup` - Create new user

## 🔐 Authentication & Data Storage

- **Authentication**: Uses localStorage for session management (mock implementation)
- **Data Storage**: 
  - Frontend: localStorage for user data and interview history
  - Backend: JSON files for static data and user accounts
  - AI Responses: Stored in component state (in-memory only, not persisted)

**Note**: For production, implement proper JWT authentication with a secure backend and database.

## 📱 Responsive Design

The app is fully responsive and optimized for:
- Mobile devices (375px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

**Important**: Never commit the `.env` file to version control. The `.env` file should be in `.gitignore`.

### API Key Setup

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

## 🐛 Troubleshooting

### AI Endpoints Not Working
- Verify your `GEMINI_API_KEY` is set in the `.env` file
- Check that the backend server is running on port 3001
- Ensure you have internet connection (Gemini API requires internet)
- Check backend console for error messages

### Fallback to Static Data
If AI generation fails, the API automatically falls back to static JSON data to ensure the app continues working.

## 🎯 Future Enhancements

- [ ] Voice input for interview answers
- [ ] Video interview practice with recording
- [ ] Advanced analytics dashboard with AI insights
- [ ] Export progress reports as PDF
- [ ] Mobile app version
- [ ] Social features and peer practice matching
- [ ] Company-specific interview preparation
- [ ] Resume analysis with AI feedback

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🔒 Security Notes

- **API Key**: Gemini API key is stored securely in backend `.env` file (never exposed to frontend)
- **Input Validation**: All API endpoints validate input before processing
- **Error Handling**: Graceful error handling prevents sensitive information leaks
- **CORS**: Configured for development (localhost). Update for production.

## 📚 Additional Documentation

- `backend/SETUP.md` - Detailed backend setup instructions
- `DATABASE_DOCUMENTATION.md` - Data storage architecture
- `frontend/README.md` - Frontend-specific documentation

## 🙏 Acknowledgments

- Built with React, TypeScript, and Tailwind CSS
- Powered by Google Gemini AI
- Icons by Lucide React
- Charts by Recharts
- Animations by Framer Motion

## 📝 License

This project is open source and available under the MIT License.

---

**Made with ❤️ and AI for job seekers everywhere**

