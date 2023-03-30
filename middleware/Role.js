const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .send(`Role: ${req.user.role} is not allowed to access this Resources`);
    }
    next();
  };
};

module.exports = authorizeRoles;
