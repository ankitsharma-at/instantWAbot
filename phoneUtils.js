/**
 * Phone number utilities for validation and formatting
 */

/**
 * Validates if the input is a valid phone number
 * @param {string} input - The input string to validate
 * @returns {boolean} True if the input is a valid phone number
 */
function isValidPhoneNumber(input) {
  // Remove any non-digit characters
  const digitsOnly = input.replace(/\D/g, '');
  
  // Check if the input contains only digits and has a valid length
  return /^\d+$/.test(digitsOnly) && digitsOnly.length >= 9 && digitsOnly.length <= 15;
}

/**
 * Formats a phone number with the correct country code
 * @param {string} input - The input phone number
 * @returns {string} Formatted phone number with country code
 */
function formatPhoneNumber(input) {
  // Remove any non-digit characters
  let digitsOnly = input.replace(/\D/g, '');
  
  // If the number doesn't seem to have a country code (assessed by length),
  // prepend '91' for Indian numbers
  if (digitsOnly.length <= 10) {
    digitsOnly = '91' + digitsOnly;
  }
  
  return digitsOnly;
}

/**
 * Generates links for various services based on the phone number
 * @param {string} phoneNumber - The formatted phone number
 * @returns {Object} Object containing links for various services
 */
function generateLinks(phoneNumber) {
  return {
    whatsapp: `https://wa.me/${phoneNumber}`,
    truecaller: `https://www.truecaller.com/search/in/${phoneNumber}`,
    sms: `sms:${phoneNumber}`,
    call: `tel:${phoneNumber}`,
  };
}

module.exports = {
  isValidPhoneNumber,
  formatPhoneNumber,
  generateLinks,
};