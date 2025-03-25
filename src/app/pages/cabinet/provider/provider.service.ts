import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { IdNameModel, ListFilter } from 'src/app/core/models/common.models';
import { CustomerDeal, CustomerLotItems } from '../cabinet.models';
import { AddLicense, OfferAddEdit, OfferEditModel, ProductManafacturer, ProductMark, ProductWithPropsList, RivalLotList, SendExpiredChecked } from './provider.models';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.auth.getToken()
    });
  }

  getOfferForEdit(id: number) {
    return this.http.get<OfferEditModel>('/Provider/GetOfferForEdit/' + id);
  }

  getProductsWithProps(categoryId: any, productName: string) {
    return this.http.get<ProductWithPropsList[]>(
      '/Common/GetProductsWithProps?categoryId=' + categoryId + '&productName=' + productName
    );
  }

  setPublished(offerId: number, body: any) {
    return this.http.post('/Provider/SetPublished/' + offerId, body);
  }

  setRepublishMass(model: SendExpiredChecked) {
    return this.http.post('/Provider/SetRepublishMass', model);
  }

  filterProviderOffers(model: any, statusId: number) {
    return this.http.post<any[]>('/Provider/FilterProviderOffers/' + statusId, model);
  }

  setOfferDeleted(offerId: number) {
    return this.http.get('/Provider/SetOfferDeleted/' + offerId);
  }

  getRivalLots(model: any) {
    return this.http.post<RivalLotList[]>('/Provider/GetRivalLots', model);
  }

  getCertificatesList(model: any) {
    return this.http.post<any>('/Provider/GetLicensesFull', model);
  }

  getLots(model: any) {
    return this.http.post<CustomerLotItems[]>('/Provider/GetLots', model);
  }

  getOffers(model: any) {
    return this.http.post<CustomerLotItems[]>('/Provider/GetLots', model);
  }

  providerPost(url: string, body: any) {
    return this.http.post<any>('/Provider/' + url, body);
  }

  addOffer(url: string, model: OfferAddEdit) {
    return this.http.post(url, model);
  }

  setRePublish(url: string, model: any) {
    return this.http.post(url, model);
  }

  libGetTypePublish() {
    return this.http.get<any[]>('/Lib/GetTypePublish', {
      headers: {
        Trade: 'true'
      }
    });
  }

  libGetProductProps(code: string) {
    return this.http.get<any>('/Lib/GetProductProps/' + code, {
      headers: {
        Trade: 'true'
      }
    });
  }

  getUserRecords() {
    return this.http.get<any[]>('/Lib/GetUserRecords', {
      headers: {
        Trade: 'true'
      }
    });
  }

  libGetRegionsDistricts() {
    return this.http.get<any[]>('/Lib/GetRegionsDistrict', {
      headers: {
        Trade: 'true'
      }
    });
  }

  GetRegions() {
    return this.http.get<IdNameModel[]>('/Lib/GetRegions', {
      headers: {
        Trade: 'true'
      }
    });
  }

  GetDistricts(regionId: number) {
    return this.http.get<IdNameModel[]>('/Lib/GetDistricts/' + regionId, {
      headers: {
        Trade: 'true'
      }
    });
  }

  addLicense(model: AddLicense) {
    return this.http.post('/Provider/AddLicense', model);
  }

  setLicenseDeleted(id: number) {
    return this.http.get<any>('/Provider/SetLicenseDeleted/' + id);
  }

  getLicenses() {
    return this.http.get<any>('/Provider/GetLicenses');
  }

  getMarks(product_code: string) {
    return this.http.get<ProductMark[]>('/Provider/GetMarks/' + product_code);
  }

  getManafacturers(product_code: string) {
    return this.http.get<ProductManafacturer[]>('/Provider/GetManafacturers/' + product_code);
  }

  getCategory(keyword: string) {
    return this.http.get<any>(`/Common/GetCategories`);
  }

  libGetMeasures() {
    return this.http.get<IdNameModel[]>('/Lib/GetMeasures', {
      headers: {
        Trade: 'true'
      }
    });
  }

  getPeriods() {
    return this.http.get<any[]>('/Common/GetPeriods', {});
  }

  libGetCountries() {
    return this.http.get<any[]>('/Lib/GetCountries', {
      headers: {
        Trade: 'true'
      }
    });
  }

  getDeals(url: string, model: ListFilter) {
    return this.http.post<CustomerDeal[]>('/Provider/' + url, model);
  }
}
