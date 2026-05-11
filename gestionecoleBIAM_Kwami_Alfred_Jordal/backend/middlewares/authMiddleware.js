import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token manquant.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalide ou expire.' });
  }
}
