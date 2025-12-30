# Troubleshooting Guide

## "Failed to generate interview questions" Error

If you're seeing this error, follow these steps:

### 1. Check Backend Server Status

**Is the backend running?**
- Open a terminal/command prompt
- Navigate to the `backend` folder
- Run: `npm start`
- You should see: `Server running on http://localhost:3001`

**Common Issues:**
- Port 3001 is already in use → Change PORT in `.env` file
- Dependencies not installed → Run `npm install` in backend folder

### 2. Verify Environment Variables

**Check if `.env` file exists:**
- Location: `backend/.env`
- Should contain:
  ```env
  GEMINI_API_KEY=your_actual_api_key_here
  PORT=3001
  ```

**Get your Gemini API Key:**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in `backend/.env` file (replace `your_actual_api_key_here`)

**Important:** 
- Never commit `.env` file to git
- Restart backend server after changing `.env` file

### 3. Check Browser Console

**Open Developer Tools:**
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Go to "Console" tab
- Look for red error messages
- Check "Network" tab for failed API calls

**Common Console Errors:**

**"Network Error" or "Failed to fetch":**
- Backend server is not running
- CORS issue (unlikely with our setup)
- Firewall blocking connection

**"ECONNREFUSED":**
- Backend server not running on port 3001
- Wrong API URL in frontend

**"401" or "403":**
- Invalid API key
- API key not set

**"500 Internal Server Error":**
- Check backend terminal for error logs
- API key might be invalid
- Gemini API might be down

### 4. Check Backend Terminal Logs

When you start the backend, you should see:
```
Server running on http://localhost:3001
AI endpoints available at http://localhost:3001/api/ai/*
```

If you see warnings about API key:
```
⚠️  GEMINI_API_KEY is not configured in .env file. AI features will use fallback data.
```
→ Your API key is missing or invalid

### 5. Test the API Directly

**Using Browser:**
1. Open: http://localhost:3001/api/interview-questions
2. Should return JSON data (static questions)

**Using curl (Terminal):**
```bash
curl -X POST http://localhost:3001/api/ai/interview-questions \
  -H "Content-Type: application/json" \
  -d '{"type":"Technical","difficulty":"Medium","count":3}'
```

**Expected Response:**
```json
{
  "success": true,
  "questions": [...]
}
```

**If you get an error:**
- Check backend terminal for error details
- Verify API key is correct
- Check internet connection (Gemini API needs internet)

### 6. Verify Frontend-Backend Connection

**Check API URL:**
- File: `frontend/src/services/aiService.ts`
- Line 15: `const API_BASE_URL = 'http://localhost:3001/api'`
- Should match your backend port

**If backend runs on different port:**
- Update `API_BASE_URL` in `aiService.ts`
- Or update `PORT` in backend `.env` to 3001

### 7. Fallback Behavior

The app is designed to use static data if AI fails:
- If API key is missing → Uses static questions
- If API call fails → Falls back to static questions
- Check the response for `"fallback": true` in browser Network tab

**To test fallback:**
- Temporarily set invalid API key in `.env`
- Questions should still load (but they'll be static)

### 8. Common Solutions

**Problem: "Cannot connect to backend"**
- Solution: Start backend server with `npm start` in backend folder

**Problem: "API key error"**
- Solution: Check `.env` file exists and has valid API key
- Solution: Restart backend after changing `.env`

**Problem: "Request timeout"**
- Solution: Check internet connection
- Solution: Gemini API might be slow, wait and retry

**Problem: Questions not generating**
- Solution: Check backend terminal for detailed error
- Solution: Verify API key is valid at https://makersuite.google.com/app/apikey

### 9. Still Not Working?

**Enable Detailed Logging:**

In `backend/server.js`, the errors are logged to console. Check:
- Terminal where backend is running
- Look for error messages starting with "Error generating interview questions:"

**Check API Key Validity:**
1. Visit https://makersuite.google.com/app/apikey
2. Verify your API key exists
3. Check if there are any usage/quota restrictions
4. Try creating a new API key if needed

**Reset Everything:**
1. Stop backend server (Ctrl+C)
2. Verify `.env` file has correct API key
3. Restart backend: `npm start`
4. Clear browser cache and refresh frontend
5. Try again

### 10. Getting Help

If nothing works:
1. Check browser console for exact error message
2. Check backend terminal for error logs
3. Verify `.env` file exists and has API key
4. Ensure both frontend and backend are running
5. Try the API endpoint directly in browser/Postman

---

**Quick Checklist:**
- [ ] Backend server running on port 3001
- [ ] `.env` file exists in `backend/` folder
- [ ] `GEMINI_API_KEY` is set in `.env`
- [ ] API key is valid (not placeholder text)
- [ ] Internet connection is active
- [ ] Frontend is running on port 5173
- [ ] Browser console shows no CORS errors
- [ ] Backend terminal shows no error messages

