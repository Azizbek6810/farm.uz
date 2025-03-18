import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
import { TokenInfo, UserInfo, SmsActionsModel } from './authentication.models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private tokenKey = 'token';
  private infoKey = 'info';
  private roleKey = 'roleKey';
  private roleNameKey = 'roleNameKey';
  private fullnameKey = 'fullnameKey';
  private customerTypeKey = 'customerTypeKey';
  private roleIdKey = 'roleIdKey';
  private actionsKey = 'actionsKey';
  private smsActionsKey = 'smsActionsKey';
  private roleType = 'role_type';
  private rememberMyChooseKey = 'rememberMyChooseKey';

  clientType: number;
  subUserId: number;

  constructor() {}

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getCustomerType() {
    return localStorage.getItem(this.customerTypeKey);
  }

  setRoleType(type: string) {
    localStorage.setItem(this.roleType, type);
  }

  login(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.subUserId = this.getProfile().sub_user_id;
  }

  getClientType() {
    return this.getProfile().clientType;
  }

  getSubUserType() {
    return this.getProfile().sub_user_id;
  }

  setRole(role: string) {
    localStorage.setItem(this.roleKey, role);
  }

  getRole() {
    return localStorage.getItem(this.roleKey);
  }

  setRememberMyChoose(role: string) {
    localStorage.setItem(this.rememberMyChooseKey, role);
  }

  getRememberMyChoose() {
    return localStorage.getItem(this.rememberMyChooseKey);
  }

  setRoleId(role: string) {
    localStorage.setItem(this.roleIdKey, role);
  }

  setRoleName(name: string) {
    localStorage.setItem(this.roleNameKey, name);
  }

  getRoleName() {
    return localStorage.getItem(this.roleNameKey);
  }

  setFullname(name: string) {
    localStorage.setItem(this.fullnameKey, name);
  }

  getFullname() {
    return localStorage.getItem(this.fullnameKey);
  }

  setCustomerType(name: string) {
    localStorage.setItem(this.customerTypeKey, name);
  }

  setInfo(obj: UserInfo) {
    if (!obj) {
      return;
    }
    let json = JSON.stringify(obj);
    localStorage.setItem(this.infoKey, btoa(unescape(encodeURIComponent(json))));
  }

  get info(): UserInfo {
    let json = localStorage.getItem(this.infoKey);
    if (!json) {
      return <UserInfo>{};
    }
    try {
      let obj = JSON.parse(decodeURIComponent(escape(atob(json))));

      return <UserInfo>obj;
    } catch (e) {
      return <UserInfo>{};
    }
  }

  isAuthenticated() {
    let token = this.getToken();
    if (!token) {
      return false;
    }
    let decoded = jwtDecode(token);
    if (!decoded) {
      return false;
    }
    try {
      const date = new Date(0);
      date.setUTCSeconds(decoded.exp);
      return date.valueOf() > new Date().valueOf();
    } catch (err) {
      return false;
    }
  }

  getProfile() {
    let token = this.getToken();
    if (!token) {
      return <TokenInfo>{};
    }
    let obj = jwtDecode(token);
    if (!obj) {
      return <TokenInfo>{};
    }
    return <TokenInfo>obj;
  }

  register() {
    const link = environment.authUrl + '/register?source=' + environment.appUrl + '/home';
    window.open(link, '_blank');
  }

  redirectToDashboard() {
    location.href = environment.appUrl + '/' + this.getRole() + '/dashboard';
  }

  redirectToHome() {
    location.href = environment.appUrl + '/home';
  }

  redirect() {
    location.href = environment.authUrl + '/v2?callback=' + environment.appUrl + '/redirect';
  }

  cabinet() {
    setTimeout(() => {
      location.href = '/cabinet/' + localStorage.getItem(this.roleKey);
    }, 200);
  }

  logout() {
    if (this.getRememberMyChoose() !== '1') {
      localStorage.removeItem(this.roleKey);
      localStorage.removeItem(this.roleIdKey);
      localStorage.removeItem(this.roleNameKey);
      localStorage.removeItem(this.fullnameKey);
      localStorage.removeItem(this.customerTypeKey);
    }
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.infoKey);
    localStorage.removeItem(this.actionsKey);
  }

  setActions(name: string[]) {
    localStorage.setItem(this.actionsKey, JSON.stringify(name));
  }

  hasAccessToAction(action: any) {
    if (this.getClientType() === 3) {
      let str = localStorage.getItem(this.actionsKey);
      if (str) {
        let actions: [] = JSON.parse(str);
        return actions.some(el => el === action);
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  setSMSActions(name: string[]) {
    localStorage.setItem(this.smsActionsKey, JSON.stringify(name));
  }

  getSmsPhone() {
    let str = localStorage.getItem(this.smsActionsKey);
    if (str) {
      let smsActions: SmsActionsModel = JSON.parse(str);
      return smsActions.phone;
    } else {
      return '';
    }
  }

  hasSMSAccessToAction(action: any) {
    let str = localStorage.getItem(this.smsActionsKey);
    if (str) {
      let smsActions: SmsActionsModel = JSON.parse(str);
      return smsActions.actions.filter((el: { code: any }) => el.code === action);
    } else {
      return [];
    }
  }
}
