import type { InterviewRecord, InterviewType } from '../types'

// Sample interview history
export const sampleInterviewHistory: InterviewRecord[] = [
  {
    id: '1',
    type: 'Technical',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    score: 50,
    feedback: [
      'Work on explaining technical concepts more clearly.',
      'Practice coding problems on whiteboard.',
      'Improve time management during technical discussions.',
    ],
  },
  {
    id: '2',
    type: 'HR',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    score: 62,
    feedback: [
      'Connect answers back to company mission.',
      'Share concise metrics to quantify achievements.',
      'Balance humility with confidence.',
    ],
  },
  {
    id: '3',
    type: 'Behavioral',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    score: 68,
    feedback: [
      'Emphasize collaboration and cross-team communication.',
      'Reflect on lessons learned to show growth mindset.',
      'Detail the decision-making process.',
    ],
  },
  {
    id: '4',
    type: 'Technical',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    score: 75,
    feedback: [
      'Good technical knowledge demonstrated.',
      'Could improve explanation clarity.',
      'Strong problem-solving approach.',
    ],
  },
  {
    id: '5',
    type: 'HR',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    score: 72,
    feedback: [
      'Well-structured answers using STAR method.',
      'Good cultural fit demonstrated.',
      'Could add more specific examples.',
    ],
  },
  {
    id: '6',
    type: 'Behavioral',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    score: 80,
    feedback: [
      'Excellent storytelling with clear structure.',
      'Strong examples of leadership.',
      'Good reflection on challenges faced.',
    ],
  },
  {
    id: '7',
    type: 'Technical',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    score: 92,
    feedback: [
      'Outstanding technical depth and clarity.',
      'Excellent problem-solving methodology.',
      'Great communication of complex concepts.',
    ],
  },
  {
    id: '8',
    type: 'HR',
    date: new Date().toISOString(),
    score: 88,
    feedback: [
      'Strong alignment with company values.',
      'Clear career goals and motivation.',
      'Excellent questions about the role.',
    ],
  },
]

// Extended interview questions (10 per category)
export const extendedInterviewQuestions: Record<InterviewType, Array<{ id: number; question: string }>> = {
  Technical: [
    { id: 1, question: 'Explain the difference between var, let, and const in JavaScript.' },
    { id: 2, question: 'What is event delegation and why is it useful?' },
    { id: 3, question: 'How does prototypal inheritance work in JavaScript?' },
    { id: 4, question: 'Describe the virtual DOM and how React uses it to optimize rendering.' },
    { id: 5, question: 'What are closures and when would you use them?' },
    { id: 6, question: 'Explain the concept of time complexity and space complexity with examples.' },
    { id: 7, question: 'What is the difference between REST and GraphQL?' },
    { id: 8, question: 'How would you optimize a slow database query?' },
    { id: 9, question: 'Explain the SOLID principles with practical examples.' },
    { id: 10, question: 'What is the difference between authentication and authorization?' },
  ],
  HR: [
    { id: 1, question: 'Tell me about yourself.' },
    { id: 2, question: 'What are your strengths and weaknesses?' },
    { id: 3, question: 'Why do you want to work for this company?' },
    { id: 4, question: 'Describe a time you overcame a significant challenge.' },
    { id: 5, question: 'Where do you see yourself in five years?' },
    { id: 6, question: 'Why are you leaving your current position?' },
    { id: 7, question: 'What motivates you in your work?' },
    { id: 8, question: 'How do you handle stress and pressure?' },
    { id: 9, question: 'What is your expected salary?' },
    { id: 10, question: 'Do you have any questions for us?' },
  ],
  Behavioral: [
    { id: 1, question: 'Describe a challenging project you worked on.' },
    { id: 2, question: 'How do you handle conflicts in a team?' },
    { id: 3, question: 'Give an example of when you showed leadership.' },
    { id: 4, question: 'Tell me about a time you failed and what you learned.' },
    { id: 5, question: 'How do you prioritize tasks under pressure?' },
    { id: 6, question: 'Describe a situation where you had to work with a difficult team member.' },
    { id: 7, question: 'Give an example of when you had to make a difficult decision.' },
    { id: 8, question: 'How do you handle feedback and criticism?' },
    { id: 9, question: 'Describe a time when you had to learn something new quickly.' },
    { id: 10, question: 'Tell me about a time you had to persuade someone to see your point of view.' },
  ],
}

// Extended MCQ questions (20 questions)
export const extendedMCQQuestions = [
  {
    id: 1,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correct: 1,
    explanation: 'Binary search divides the search space in half with each iteration, resulting in O(log n) time complexity.',
  },
  {
    id: 2,
    question: 'Which React hook is used for side effects?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correct: 1,
    explanation: 'useEffect is the hook designed for handling side effects like API calls, subscriptions, and DOM manipulation.',
  },
  {
    id: 3,
    question: 'What does REST stand for?',
    options: [
      'Representational State Transfer',
      'Remote Execution and State Transfer',
      'Resource Exchange and State Transfer',
      'Representational Server Transfer',
    ],
    correct: 0,
    explanation: 'REST stands for Representational State Transfer, an architectural style for designing networked applications.',
  },
  {
    id: 4,
    question: 'Which data structure follows LIFO principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correct: 1,
    explanation: 'Stack follows Last In First Out (LIFO) principle, where the last element added is the first one to be removed.',
  },
  {
    id: 5,
    question: 'What is the purpose of virtual DOM in React?',
    options: [
      'To improve security',
      'To optimize rendering performance',
      'To enable server-side rendering',
      'To manage state',
    ],
    correct: 1,
    explanation: 'Virtual DOM allows React to efficiently update the UI by comparing the virtual representation with the actual DOM and making minimal changes.',
  },
  {
    id: 6,
    question: 'What is the output of 2 + true in JavaScript?',
    options: ['2', '3', 'Error', 'true'],
    correct: 1,
    explanation: 'In JavaScript, true is coerced to 1 when used in arithmetic operations, so 2 + 1 = 3.',
  },
  {
    id: 7,
    question: 'Which HTTP method is used to create a new resource?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correct: 1,
    explanation: 'POST is used to create new resources, while PUT is typically used to update existing resources.',
  },
  {
    id: 8,
    question: 'What is the difference between == and === in JavaScript?',
    options: [
      'No difference',
      '=== checks type and value, == only checks value',
      '== checks type and value, === only checks value',
      'Both are identical',
    ],
    correct: 1,
    explanation: '=== performs strict equality checking (type and value), while == performs type coercion before comparison.',
  },
  {
    id: 9,
    question: 'What is a closure in JavaScript?',
    options: [
      'A function that has access to variables in its outer scope',
      'A way to close a function',
      'A method to hide variables',
      'A type of loop',
    ],
    correct: 0,
    explanation: 'A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.',
  },
  {
    id: 10,
    question: 'Which algorithm has the best average time complexity for sorting?',
    options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
    correct: 1,
    explanation: 'Quick Sort has an average time complexity of O(n log n), which is optimal for comparison-based sorting algorithms.',
  },
  {
    id: 11,
    question: 'What is the purpose of the useEffect hook in React?',
    options: [
      'To manage component state',
      'To perform side effects in functional components',
      'To create refs',
      'To optimize rendering',
    ],
    correct: 1,
    explanation: 'useEffect is used to perform side effects such as data fetching, subscriptions, or manually changing the DOM in functional components.',
  },
  {
    id: 12,
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
    correct: 2,
    explanation: 'Array access by index is O(1) because arrays provide direct memory access using the index.',
  },
  {
    id: 13,
    question: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style Sheets',
      'Colorful Style Sheets',
    ],
    correct: 1,
    explanation: 'CSS stands for Cascading Style Sheets, used for styling HTML documents.',
  },
  {
    id: 14,
    question: 'What is the purpose of the async/await keywords in JavaScript?',
    options: [
      'To create synchronous code',
      'To handle asynchronous operations more elegantly',
      'To improve performance',
      'To prevent errors',
    ],
    correct: 1,
    explanation: 'async/await provides a cleaner syntax for working with promises, making asynchronous code look more like synchronous code.',
  },
  {
    id: 15,
    question: 'Which data structure is best for implementing a queue?',
    options: ['Stack', 'Array', 'Linked List', 'Tree'],
    correct: 2,
    explanation: 'Linked List is ideal for queues because it allows efficient insertion at the end and removal from the beginning (O(1) operations).',
  },
  {
    id: 16,
    question: 'What is the difference between let and const in JavaScript?',
    options: [
      'No difference',
      'let can be reassigned, const cannot',
      'const can be reassigned, let cannot',
      'Both are identical',
    ],
    correct: 1,
    explanation: 'let allows reassignment, while const creates a constant that cannot be reassigned after initialization.',
  },
  {
    id: 17,
    question: 'What is the purpose of the map function in JavaScript?',
    options: [
      'To filter array elements',
      'To transform each element of an array',
      'To reduce an array to a single value',
      'To sort an array',
    ],
    correct: 1,
    explanation: 'map creates a new array by applying a function to each element of the original array.',
  },
  {
    id: 18,
    question: 'What is a promise in JavaScript?',
    options: [
      'A guarantee that code will execute',
      'An object representing the eventual completion of an asynchronous operation',
      'A type of function',
      'A way to handle errors',
    ],
    correct: 1,
    explanation: 'A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value.',
  },
  {
    id: 19,
    question: 'Which HTTP status code indicates a successful creation?',
    options: ['200', '201', '204', '400'],
    correct: 1,
    explanation: 'HTTP 201 (Created) indicates that a new resource has been successfully created.',
  },
  {
    id: 20,
    question: 'What is the purpose of the useMemo hook in React?',
    options: [
      'To manage state',
      'To memoize expensive computations',
      'To handle side effects',
      'To create refs',
    ],
    correct: 1,
    explanation: 'useMemo memoizes the result of expensive computations, recalculating only when dependencies change.',
  },
]

// Category-wise performance data
export const categoryPerformance = [
  { category: 'Technical', score: 72, count: 3 },
  { category: 'HR', score: 74, count: 3 },
  { category: 'Behavioral', score: 74, count: 2 },
]

// Radar chart data (skills map)
export const skillsMapData = [
  { skill: 'Communication', value: 85 },
  { skill: 'Technical', value: 78 },
  { skill: 'Confidence', value: 82 },
  { skill: 'Clarity', value: 80 },
  { skill: 'Speed', value: 75 },
]

