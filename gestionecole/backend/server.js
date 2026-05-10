import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gestion-2ie-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, resourceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route introuvable: ${req.method} ${req.originalUrl}` });
});

app.use((error, _req, res, _next) => {
  const isDuplicate = error.code === 'ER_DUP_ENTRY';
  const isForeignKey = error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_NO_REFERENCED_ROW_2';

  if (isDuplicate) {
    return res.status(409).json({ message: 'Une donnee identique existe deja.' });
  }

  if (isForeignKey) {
    return res.status(400).json({ message: 'Relation invalide ou suppression impossible car la donnee est utilisee.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Erreur serveur.' });
});

const port = Number(process.env.PORT || 5000);

app.listen(port, () => {
  console.log(`API 2iE demarree sur http://localhost:${port}`);
});
