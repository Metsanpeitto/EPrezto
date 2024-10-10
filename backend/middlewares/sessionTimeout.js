const sessionTimeout = (req, res, next) => {
  if (req?.session) {
    if (Date.now() > req.session.expiresAt) {
      req.session.destroy();
      return res.status(401).json({ message: 'Session timed out' });
    }
  }
  next();
};

module.exports = { sessionTimeout };
