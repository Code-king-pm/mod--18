import { jwtDecode } from 'jwt-decode';

// Define the user token interface
interface UserToken {
  _id: string;
  name: string;
  exp: number;
}

class AuthService {
  // get user data with typing
  getProfile(): UserToken | null {
    try {
      const token = this.getToken();
      if (token) {
        return jwtDecode<UserToken>(token);
      }
      return null;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
    }
  }

  // check if the user is logged in
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<UserToken>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  // get the token from localStorage
  getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  // login function
  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // logout function
  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
