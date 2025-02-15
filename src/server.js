const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes.js');
const projectRoutes = require('./routes/project.routes.js');
const setupSwagger = require('./swagger.js');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📖 Documentation disponible sur http://localhost:${PORT}/api-docs`);
});
