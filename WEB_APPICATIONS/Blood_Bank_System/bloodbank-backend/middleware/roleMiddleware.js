export const checkAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

const permit = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ message: 'Forbidden - insufficient role' });
    next();
  };
};

export default permit;
