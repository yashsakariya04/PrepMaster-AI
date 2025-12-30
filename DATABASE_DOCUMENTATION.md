# Database Architecture Documentation

## Overview

PrepMaster+ uses a **JSON-based file storage system** instead of a traditional database. This approach is lightweight, fast to implement, and perfect for demonstration purposes.

## Data Storage Strategy

### Frontend Storage (Client-Side)
- **Technology**: Browser localStorage
- **Purpose**: User session data, interview history, preferences
- **Storage Keys**:
  - `prepai_user` - Current user data
  - `prepai_history` - Interview history records
  - `prepmaster_theme` - Theme preference (light/dark)
  - `prepmaster_streak` - Daily practice streak
  - `prepmaster_achievements` - Unlocked achievements
  - `prepmaster_bookmarks` - Bookmarked resources

### Backend Storage (Server-Side)
- **Technology**: JSON files in `/backend/data/` directory
- **Files**:
  - `interview.json` - Interview questions by category
  - `questions.json` - MCQ practice questions
  - `resources.json` - Resource library items
  - `user.json` - User accounts (mock)

## Data Structure

### Interview History
```json
{
  "id": "uuid",
  "type": "Technical" | "HR" | "Behavioral",
  "date": "ISO 8601 timestamp",
  "score": 0-100,
  "feedback": ["string array"]
}
```

### User Profile
```json
{
  "name": "string",
  "email": "string",
  "skills": ["string array"],
  "goals": "string",
  "profilePicture": "base64 string or URL"
}
```

### MCQ Questions
```json
{
  "id": "number",
  "question": "string",
  "options": ["array of strings"],
  "correct": "number (index)",
  "explanation": "string"
}
```

## Why JSON Files Instead of Database?

### Advantages for This Project:
1. **No Setup Required** - No database installation or configuration
2. **Portable** - Easy to backup and restore
3. **Fast Development** - Quick to implement and modify
4. **Perfect for Demos** - Shows data persistence without complexity
5. **Educational** - Demonstrates data structure and file I/O

### When to Upgrade to Database:
- Production deployment with multiple users
- Need for concurrent access
- Complex queries and relationships
- Scalability requirements
- Data security and backup needs

## Migration Path

If faculty asks about database migration:

### Option 1: SQLite (Recommended for Demo)
```javascript
// Easy migration - SQLite is file-based
const db = new sqlite3.Database('./data/prepmaster.db')
```

### Option 2: PostgreSQL/MySQL
```javascript
// Production-ready relational database
// Requires database server setup
```

### Option 3: MongoDB
```javascript
// NoSQL document database
// Good for flexible schema
```

## Current Implementation

### Backend API (`/backend/server.js`)
- Reads from JSON files
- Writes to JSON files
- Simple CRUD operations
- No database connection required

### Data Flow
```
User Action → Frontend → API Call → Read JSON File → Return Data
User Action → Frontend → API Call → Update JSON File → Save
```

## Data Persistence

### localStorage (Frontend)
- Persists across browser sessions
- Cleared when user clears browser data
- Limited to ~5-10MB per domain

### JSON Files (Backend)
- Persists on server filesystem
- Survives server restarts
- Can be backed up easily

## Security Considerations

**Current Implementation (Demo):**
- No password hashing (for simplicity)
- No authentication tokens
- Data stored in plain JSON

**Production Recommendations:**
- Hash passwords (bcrypt)
- Use JWT tokens
- Encrypt sensitive data
- Implement rate limiting
- Add input validation

## Demonstration Points

When presenting to faculty, highlight:

1. **Data Structure Design** - Well-organized JSON schemas
2. **File I/O Operations** - Efficient reading/writing
3. **Data Validation** - Type checking and error handling
4. **Scalability Path** - Clear migration strategy
5. **Architecture** - Separation of concerns (frontend/backend)

## File Locations

```
backend/
  ├── data/
  │   ├── interview.json      # Interview questions
  │   ├── questions.json       # MCQ questions
  │   ├── resources.json       # Resource library
  │   └── user.json            # User accounts
  └── server.js                # Express API server

frontend/
  └── src/
      └── utils/
          └── storage.ts       # localStorage utilities
```

## Conclusion

This JSON-based approach is **perfect for academic projects** because it:
- Demonstrates data persistence
- Shows file I/O operations
- Requires no external dependencies
- Easy to understand and explain
- Can be easily upgraded to a real database

**For faculty presentation**: Emphasize that this is a **lightweight, educational approach** that can be seamlessly migrated to a production database when needed.

