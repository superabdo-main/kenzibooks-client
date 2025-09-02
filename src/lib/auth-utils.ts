/**
 * Validates if an email ends with @kenzibooks.com
 * @param email The email to validate
 * @returns boolean indicating if the email is valid
 */
export const isValidKenzibooksEmail = (email: string): boolean => {
  return email.endsWith('@kenzibooks.com');
};

/**
 * Formats the email to ensure it has the correct domain
 * @param email The email to format
 * @returns Formatted email with @kenzibooks.com domain if needed
 */
export const formatKenzibooksEmail = (email: string): string => {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail.endsWith('@kenzibooks.com')) {
    return cleanEmail;
  }
  // Remove any existing domain and append @kenzibooks.com
  const username = cleanEmail.split('@')[0];
  return `${username}@kenzibooks.com`;
};

/**
 * Validates password strength
 * @param password The password to validate
 * @returns Object with validation result and messages
 */
export const validatePasswordStrength = (password: string) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  const isValid = 
    password.length >= minLength && 
    hasUppercase && 
    hasLowercase && 
    hasNumber && 
    hasSpecialChar;
  
  const messages = [];
  if (password.length < minLength) messages.push(`At least ${minLength} characters`);
  if (!hasUppercase) messages.push('At least one uppercase letter');
  if (!hasLowercase) messages.push('At least one lowercase letter');
  if (!hasNumber) messages.push('At least one number');
  if (!hasSpecialChar) messages.push('At least one special character');
  
  return {
    isValid,
    messages,
    score: [
      password.length >= minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    ].filter(Boolean).length / 5 // Score from 0 to 1
  };
};

/**
 * Formats a phone number to a standard format
 * @param phone The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = ('' + phone).replace(/\D/g, '');
  
  // Check if the number starts with a country code
  if (cleaned.startsWith('0')) {
    // Local number, add country code (assuming Kenya +254)
    return `+254${cleaned.substring(1)}`;
  } else if (cleaned.startsWith('254')) {
    // Already has Kenya country code
    return `+${cleaned}`;
  } else if (cleaned.length === 9) {
    // Local number without leading 0
    return `+254${cleaned}`;
  } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
    // Local number with leading 0
    return `+254${cleaned.substring(1)}`;
  }
  
  // Return as is if format is not recognized
  return `+${cleaned}`;
};
