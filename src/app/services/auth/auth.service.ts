import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'Token';

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserInfo(): { id: string; role: string; name: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.userId,
        role: decoded.role,
        name: decoded.name,
      };
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  }

  hasPermission(requiredRole: string): boolean {
    const userInfo = this.getUserInfo();
    return userInfo?.role.includes(requiredRole) || false;
  }
}
