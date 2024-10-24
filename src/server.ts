import app from './index';
import connectDB from './config/db';
import http from 'http';

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// connect Database
// connectDB();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
