// Timezone utility functions

/**
 * Convert a date to a specific timezone
 * @param {Date} date - The date to convert
 * @param {string} timezone - The target timezone (e.g., 'Asia/Kolkata', 'America/New_York')
 * @returns {Date} - Date in the specified timezone
 */
exports.convertToTimezone = (date, timezone = 'UTC') => {
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
};

/**
 * Get current time in a specific timezone
 * @param {string} timezone - The target timezone
 * @returns {Date}
 */
exports.getCurrentTimeInTimezone = (timezone = 'UTC') => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
};

/**
 * Format date for display with timezone
 * @param {Date} date
 * @param {string} timezone
 * @returns {string}
 */
exports.formatDateWithTimezone = (date, timezone = 'UTC') => {
  return new Date(date).toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

/**
 * Validate if a timezone is valid
 * @param {string} timezone
 * @returns {boolean}
 */
exports.isValidTimezone = (timezone) => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get timezone offset in minutes
 * @param {string} timezone
 * @returns {number}
 */
exports.getTimezoneOffset = (timezone) => {
  const date = new Date();
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
};
