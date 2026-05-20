const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Erreur de validation', errors: messages });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ message: `La valeur '${field}' existe déjà` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token invalide' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expiré', code: 'TOKEN_EXPIRED' });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Fichier trop volumineux' });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
