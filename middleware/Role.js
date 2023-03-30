const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role: ${req.user.role} is not allowed to access this Resources`
      );
    }
    next();
  };
};


module.exports = authorizeRoles