export function validateEmail(email: string): string | null {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return "Invalid email format.";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
  if (!strongPassword.test(password)) {
    return "Password must contain at least 8 characters, including uppercase, lowercase, and a number.";
  }
  return null;
}

export async function checkPasswordBreach(password: string): Promise<{ isBreached: boolean; count?: number }> {
  try {
    // Hash the password using SHA-1
    const encoder = new TextEncoder();
    const encodedPassword = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', encodedPassword);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    // Use k-anonymity model - only send first 5 chars of hash
    const hashPrefix = hashHex.substring(0, 5);
    const hashSuffix = hashHex.substring(5);
    
    // Query HaveIBeenPwned API
    const response = await fetch(`https://api.pwnedpasswords.com/range/${hashPrefix}`);
    
    if (!response.ok) {
      console.error('Failed to check password breach');
      return { isBreached: false };
    }
    
    const responseText = await response.text();
    const hashes = responseText.split('\n');
    
    // Check if our hash suffix appears in the results
    for (const line of hashes) {
      const [suffix, count] = line.split(':');
      if (suffix === hashSuffix) {
        return { isBreached: true, count: parseInt(count, 10) };
      }
    }
    
    return { isBreached: false };
  } catch (error) {
    console.error('Error checking password breach:', error);
    // Don't block authentication if breach check fails
    return { isBreached: false };
  }
}

export async function validateSignUpForm(
  email: string, 
  password: string
): Promise<{ isValid: boolean; error?: string }> {
  // Validate email
  const emailError = validateEmail(email);
  if (emailError) {
    return { isValid: false, error: emailError };
  }
  
  // Validate password strength
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { isValid: false, error: passwordError };
  }
  
  // Check for breached password
  const breachCheck = await checkPasswordBreach(password);
  if (breachCheck.isBreached) {
    return { 
      isValid: false, 
      error: `This password appears in known breaches (${breachCheck.count?.toLocaleString()} times). Please use another password.` 
    };
  }
  
  return { isValid: true };
}
