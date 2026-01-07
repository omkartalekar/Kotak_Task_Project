// Input validation utilities

/**
 * Validate email format
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
exports.isValidPassword = (password) => {
  if (!password || password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumber;
};

/**
 * Validate MongoDB ObjectId
 */
exports.isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate date is in the future
 */
exports.isFutureDate = (date) => {
  return new Date(date) > new Date();
};

/**
 * Validate time range
 */
exports.isValidTimeRange = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (isNaN(start) || isNaN(end)) return false;
  return start < end;
};

/**
 * Sanitize string input
 */
exports.sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate phone number (basic)
 */
exports.isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate appointment status
 */
exports.isValidAppointmentStatus = (status) => {
  const validStatuses = ["BOOKED", "CANCELLED", "RESCHEDULED", "COMPLETED", "NO_SHOW"];
  return validStatuses.includes(status);
};

/**
 * Validate slot status
 */
exports.isValidSlotStatus = (status) => {
  const validStatuses = ["AVAILABLE", "BOOKED", "BLOCKED"];
  return validStatuses.includes(status);
};

/**
 * Validate user role
 */
exports.isValidRole = (role) => {
  const validRoles = ["USER", "PROVIDER", "ADMIN"];
  return validRoles.includes(role);
};
