/**
 * JalQ Local Demo Authentication Configuration
 * Simple, local, reliable credentials for hackathon evaluation.
 * 
 * Valid credentials:
 * Username: admin
 * Password: jalq2026
 */

export const DEMO_USERNAME = 'admin';
export const DEMO_PASSWORD = 'jalq2026';

export interface AuthValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateCredentials = (
  username: string,
  password: string
): AuthValidationResult => {
  // Check for empty fields
  if (!username.trim() || !password) {
    return {
      isValid: false,
      error: 'Please enter username and password.'
    };
  }

  const validUsername = DEMO_USERNAME;
  const validPassword = DEMO_PASSWORD;

  const usernameCorrect = username.trim() === validUsername;
  const passwordCorrect = password === validPassword;

  if (usernameCorrect && passwordCorrect) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: 'Invalid username or password.'
  };
};
