# Debug Steps - "Failed to generate interview questions" Error

## ✅ What I've Implemented

I've added comprehensive debugging and error handling:

1. **Detailed logging in `geminiService.js`** - Logs every step of the API call
2. **Enhanced error handling in `server.js`** - Better error messages and validation
3. **Health check endpoint** - Test backend status at `/api/health`
4. **Test script** - `backend/test-gemini.js` to test API key
5. **Improved frontend error display** - Shows detailed error messages

## 🔍 Step-by-Step Debugging

### Step 1: Test Backend Health
Open in browser: **http://localhost:3001/api/health**

**Expected Response:**
```json
{
  "status": "ok",
  "geminiApiConfigured": true,
  "apiKeyLength": 39,
  "apiKeyPreview": "AIzaSyBr_m...",
  "nodeEnv": "development",
  "timestamp": "2024-...",
  "port": 3001
}
```

**If you see `geminiApiConfigured: false`:**
- Your `.env` file is missing or API key not set
- Check `backend/.env` exists and has `GEMINI_API_KEY=your_key_here`

### Step 2: Test Gemini API Key
Run the test script:
```bash
cd backend
node test-gemini.js
```

**Expected Output:**
```
=== TESTING GEMINI API ===
API Key exists: true
API Key length: 39
✅ SUCCESS! API is working!
Response: Hello, Gemini API is working!
```

**If you see errors:**
- API key is invalid → Get new key from https://makersuite.google.com/app/apikey
- Quota exceeded → Wait or upgrade plan
- Permission denied → Check API key permissions

### Step 3: Check Backend Console
When you click "Start AI Interview", watch the backend terminal. You should see:

```
=== API ENDPOINT CALLED ===
Request body: { ... }
=== GEMINI API CALL START ===
Type: Technical
Difficulty: Medium
Count: 5
API Key exists: true
API Key length: 39
Sending prompt to Gemini...
Gemini response received
Raw response length: 1234
Successfully parsed JSON
Number of questions generated: 5
=== GEMINI API CALL SUCCESS ===
=== API ENDPOINT SUCCESS ===
```

**If you see errors:**
- Look for `=== GEMINI API CALL FAILED ===`
- Check the error message and stack trace
- Share the error details

### Step 4: Check Browser Console
Press **F12** in browser → Go to **Console** tab

**Expected:** No red errors

**If you see errors:**
- Look for `=== FRONTEND ERROR - LOADING QUESTIONS ===`
- Check the error details
- Note the error message and stack trace

### Step 5: Check Network Tab
Press **F12** → Go to **Network** tab → Click "Start AI Interview"

**Expected:**
- Request to `http://localhost:3001/api/ai/interview-questions`
- Status: **200 OK**
- Response contains `{"success": true, "questions": [...]}`

**If you see errors:**
- **404 Not Found** → Backend not running or wrong URL
- **500 Internal Server Error** → Check backend console for details
- **CORS Error** → Backend CORS not configured (shouldn't happen)
- **Network Error** → Backend not running

## 🛠️ Quick Fixes

### Fix 1: Backend Not Running
```bash
cd backend
npm start
```

Look for: `Server running on http://localhost:3001`

### Fix 2: API Key Not Set
1. Create `backend/.env` file:
```env
GEMINI_API_KEY=your_actual_api_key_here
PORT=3001
```

2. Get API key from: https://makersuite.google.com/app/apikey

3. Restart backend:
```bash
# Stop server (Ctrl+C)
npm start
```

### Fix 3: Invalid API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy the key (starts with `AIza`)
4. Update `backend/.env`
5. Restart backend

### Fix 4: JSON Parse Error
The AI might return invalid JSON. The enhanced logging will show:
- Raw response from Gemini
- Cleaned JSON attempt
- Parse error details

If this happens, the fallback to static questions should still work.

## 📊 Diagnostic Checklist

Run through this checklist:

- [ ] Backend server running (`npm start` in backend folder)
- [ ] Health endpoint works: http://localhost:3001/api/health
- [ ] API key test passes: `node backend/test-gemini.js`
- [ ] `.env` file exists in `backend/` folder
- [ ] `GEMINI_API_KEY` is set in `.env` (not placeholder)
- [ ] API key is valid (test script succeeds)
- [ ] Frontend running (`npm run dev` in frontend folder)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows 200 status for API call

## 🐛 Common Error Messages

### "Cannot connect to backend server"
**Cause:** Backend not running
**Fix:** Start backend with `npm start`

### "API key error"
**Cause:** Invalid or missing API key
**Fix:** Check `.env` file and test with `test-gemini.js`

### "AI response format error"
**Cause:** Gemini returned invalid JSON
**Fix:** Check backend console for raw response. Fallback should work.

### "Request timed out"
**Cause:** Gemini API slow or network issue
**Fix:** Wait and retry. Check internet connection.

### "API quota exceeded"
**Cause:** Hit rate limit
**Fix:** Wait or upgrade Google AI plan

## 📝 Next Steps

1. **Run the health check:** http://localhost:3001/api/health
2. **Test API key:** `node backend/test-gemini.js`
3. **Try starting interview** and watch both:
   - Backend terminal console
   - Browser console (F12)
4. **Share the error messages** you see in both consoles

The detailed logging will help us pinpoint exactly where the issue is!

