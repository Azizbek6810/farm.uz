import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient
  ) {}

  updateTokenWithSub(body: any): Observable<any> {
    return this.http.post('/Account/UpdateTokenWithSub', body, {
      headers: {
        Trade: 'true'
      }
    });
  }

  getManagerPrivileges(): Observable<any> {
    return this.http.get('/Cabinet/GetManagerPrivileges', {
      headers: {
        Trade: 'true'
      }
    });
  }

  getSmsServiceActionsAndPhone(): Observable<any> {
    return this.http.get('/Cabinet/GetSmsServiceActionsAndPhone', {
      headers: {
        Trade: 'true'
      }
    });
  }

  getSubUserRoles(): Observable<any> {
    return this.http.get('/Cabinet/GetBranches', {
      headers: {
        Trade: 'true'
      }
    });
  }

  updateToken(url: string, body: any) {
    return this.http.post('/api/Account/UpdateToken' + url, body, {
      headers: {
        IdApi: 'true'
      }
    });
  }

  getUserRoles() {
    return this.http.get('/Cabinet/GetUserRoles', {
      headers: {
        Trade: 'true'
      }
    });
  }
}
