export const checkRole = (roles, userRole) => {
  let canAccess = false;

  if (!roles[0]) return true;
  if (!userRole) return false;

  if (roles.includes(userRole)) canAccess = true;

  return canAccess;
};

export const defaultRole = [];
