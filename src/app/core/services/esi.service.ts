import { Injectable } from '@angular/core';
import { AuthenticationService } from '../auth/authentication.service';
import { environment } from 'src/environments/environment';

declare var esiSign: any;
declare var esiNewSign: any;
declare var esiSignTIN: any;

@Injectable({
  providedIn: 'root'
})
export class EsiService {
  private esiIdKey = 'esi-id';

  constructor(private _auth: AuthenticationService) {}

  setKey(id: string) {
    localStorage.setItem(this.esiIdKey, btoa(unescape(encodeURIComponent(id))));
  }

  getKey() {
    let id = localStorage.getItem(this.esiIdKey);
    if (!id) {
      return null;
    }
    try {
      return decodeURIComponent(escape(atob(id)));
    } catch (e) {
      return null;
    }
  }

  signWithEsi(dataForSign: any, callback: any) {
    if (environment.requiredEsi) {
      let key = this.getKey();
      if (!key) {
        alert('Войдите в кабинет через ЭЦП!');
        return;
      }
      if (key) {
        esiNewSign(key, dataForSign, (data: any, signedData: any) => {
          callback(data, signedData);
        });
      } else {
        let tin = this._auth.getProfile().tin;
        esiSignTIN(tin, dataForSign, (data: any, signedData: any) => {
          callback(data, signedData);
        });
      }
    } else {
      callback();
    }
  }

  sign(dataForSign: any, callback: any) {
    if (environment.requiredEsi) {
      let key = this.getKey();
      if (!key) {
        alert('Войдите в кабинет через ЭЦП!');
        return;
      }
      if (key) {
        esiSign(key, dataForSign, (data: any, signedData: any) => {
          // console.log('data from service', data, signedData);
          callback(data, signedData);
        });
      } else {
        let tin = this._auth.getProfile().tin;
        esiSignTIN(tin, dataForSign, (data: any, signedData: any) => {
          callback(data, signedData);
        });
      }
    } else {
      callback();
    }
  }

  removeKeys() {
    localStorage.removeItem(this.esiIdKey);
  }
}
