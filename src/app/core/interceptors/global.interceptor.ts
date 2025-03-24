import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalizeService } from '../localize.service';
import { AuthenticationService } from '../auth/authentication.service';
import { EncryptionService } from '../encryption.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  env: any = environment;
  constructor(
    private auth: AuthenticationService,
    private localize: LocalizeService,
    private encrypt: EncryptionService
  ) {}

  setHash(request: { url: string }) {
    const date: string = localStorage.getItem('current-date');
    const hash: any = request.url + '~' + date;
    return this.encrypt.encryptWithPublicKey(hash);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let headers: any = {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Language: this.localize.getLangCode() ? this.localize.getLangCode() : 'uz',
      Validation: this.setHash(request)
    };
    if (this.auth.isAuthenticated()) {
      const token = this.auth.getToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const apiName: any = request.headers.keys();
    let reqUrl;
    switch (apiName[0]) {
      case 'Trade':
        reqUrl = environment.tradeUrl + request.url;
        break;
      case 'Auction':
        reqUrl = environment.auctionUrl + request.url;
        break;
      case 'IdApi':
        reqUrl = environment.authAPIUrl + request.url;
        break;
      case 'Purchase':
        reqUrl = environment.purchaseUrl + request.url;
        break;
      case 'Custom-url':
        reqUrl = request.url;
        break;
      default:
        reqUrl = environment.apiUrl + request.url;
        break;
    }
    request = request.clone({
      url: reqUrl,
      setHeaders: headers
    });
    return next.handle(request);
  }
}
