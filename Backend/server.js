require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');

const { connect } = require('mongoose');
connectDB();

function maskKey(key) {
  if (!key) return 'NOT_SET';
  if (key.length <= 8) return 'SET';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

const loadedGeminiKey = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '').trim();





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


