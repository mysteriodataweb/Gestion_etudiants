import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

export async function login(req, res, next) {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const [rows] = await pool.query('SELECT * FROM utilisateurs WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !user.password) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const passwordMatch = await bcrypt.compare(mot_de_passe, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'change_this_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    );

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
}
