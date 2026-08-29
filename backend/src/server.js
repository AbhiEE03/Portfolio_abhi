require('dotenv').config();

console.log('[SERVER] Starting backend server...');

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const projectRoutes = require('./routes/projects');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5000;

const clientURL = process.env.CLIENT_URL || '*';

console.log(`[SERVER] CLIENT_URL set to: ${clientURL}`);

app.use(express.json({ limit: '10mb' }));
app.use(
  cors({
    origin: clientURL,
    credentials: true,
  }),
);

app.get('/api/health', (req, res) => {
  console.log('[HEALTH] Health check endpoint hit');
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  console.log(`[404] Unmatched route: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not Found' });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
};

startServer();
