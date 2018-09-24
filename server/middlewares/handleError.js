module.exports = (err, req, res, next) => {
  if (err) {
    if (
      err.name === 'ValidationError' ||
      err.name === 'CastError' ||
      err.name === 'BadParamError'
    ) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  } else {
    next();
  }
};