const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader; 
  }


  if (!token) {
    console.log('Aucun token fourni');
    return res.status(401).json({ message: 'Aucun token fourni' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secretKey', (err, user) => {
    if (err) {
      console.error('Erreur de vérification du token:', err.message);
      return res.status(403).json({ message: err.message });
    }
    req.user = user;
    next();
  });
};

module.exports = verifyToken;