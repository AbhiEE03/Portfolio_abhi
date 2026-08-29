require('dotenv').config();

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

app.use(express.json({ limit: '10mb' }));
app.use(
  cors({
    origin: clientURL,
    credentials: true,
  }),
);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
};

startServer();
