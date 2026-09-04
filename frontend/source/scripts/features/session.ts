// Locked demo key — localStorage value "1" means signed in
const SESSION_KEY = 'demo-session';

// Mock session flag in localStorage
export function isAuthenticated(): boolean {
  return localStorage.getItem(SESSION_KEY) === '1';
}

// Set demo session
export function login(): void {
  localStorage.setItem(SESSION_KEY, '1');
}

// Clear demo session
export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}
