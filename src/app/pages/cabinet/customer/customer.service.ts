import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { CustomerDeal, CustomerLotItems } from '../cabinet.models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getLots(model: any) {
    return this.http.post<CustomerLotItems[]>('/Customer/GetLots', model);
  }

  getDealsStatus(url: string, model: any) {
    return this.http.post<CustomerDeal[]>('/Customer/' + url, model);
  }
}
