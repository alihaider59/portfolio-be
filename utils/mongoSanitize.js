const sanitize = require("mongo-sanitize");

module.exports = (req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      req.query[key] = sanitize(req.query[key]);
    });
  }
  next();
};
