import { Injectable } from '@angular/core';
import { IUserInfo } from '../../pages/cabinet/cabinet.models';
import { HttpClient } from '@angular/common/http';
import {
  AccountItem,
  AddLot,
  AddLotPledgeCommission,
  IProviderListModel,
  MapStats,
  PlangraphList,
  PledgeCommissionItem
} from '../models/common.models';
import { IdNameTreeModel } from 'src/app/pages/cabinet/provider/provider.models';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http: HttpClient) {}

  getOffersList(model: any) {
    return this.http.post('/Common/GetOffersList', model);
  }

  addBid(model: any) {
    return this.http.post('/Provider/AddBid', model);
  }

  getAllCategories() {
    return this.http.get<any>('/Common/GetCategorizedProducts');
  }

  getProvidersList(model: any) {
    return this.http.post<IProviderListModel[]>('/Common/GetProviders', model);
  }

  getOffer(product_id: number, isLocal: number) {
    return this.http.get<any>(`/Common/GetOffer/${product_id}?isLocal=${isLocal}`);
  }

  getLot(offerId: number) {
    return this.http.get<any>(`/Common/GetLot/${offerId}`);
  }

  getDiscountedLots(dealId: number, body: any) {
    return this.http.post<any[]>('/Common/GetDiscountedLots/' + dealId, body);
  }

  getRelatedProducts(offerId: number) {
    return this.http.get<any>(`/Common/GetRelatedOffers/${offerId}`);
  }

  getPlangraphList(offerId: any) {
    return this.http.get<PlangraphList[]>('/Customer/GetPlangraphList/' + offerId);
  }

  getOfferCustomerPledgeAndComission(model: AddLotPledgeCommission) {
    return this.http.post<PledgeCommissionItem>('/Common/GetOfferCustomerPledgeAndComission', model);
  }

  getOfferDeliviries(offerId: number, isLocal: number) {
    return this.http.get<IdNameTreeModel[]>('/Common/GetOfferDeliveryDistricts/' + offerId + '?isLocal=' + isLocal);
  }

  getLotRegionsDistricts(offerId: number) {
    return this.http.get<IdNameTreeModel[]>('/Common/GetLotRegionsDistricts/' + offerId);
  }

  getCurrentDate() {
    return this.http.get<string>(`/Lib/GetCurrentTime`, {
      headers: {
        Trade: 'true'
      }
    });
  }

  libGetExpenditures(productId: any) {
    return this.http.get<any[]>('/Lib/GetExpenditures/' + productId, {
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

  addLot(model: AddLot) {
    return this.http.post<any>('/Customer/AddLot', model);
  }

  loadBRV() {
    return this.http.get<any>('/Lib/GetCurrentBcv', {
      headers: {
        Trade: 'true'
      }
    });
  }

  getLimit(body: any) {
    return this.http.post<any>('/Customer/GetPositionLimit', body);
  }

  getAccounts(typeId: number) {
    return this.http.get<AccountItem[]>('/Lib/GetAccounts/' + typeId, {
      headers: {
        Trade: 'true'
      }
    });
  }

  getMapStats() {
    return this.http.get<MapStats[]>('https://apietender.uzex.uz/api/common/GetMapStats', {
      headers: {
        Custom: 'true'
      }
    });
  }

  userInfo() {
    return this.http.get<IUserInfo[]>(`/Common/GetWidgetUserInfo`, {
      headers: {
        Trade: 'true'
      }
    });
  }

  GetCategoriesForFilter() {
    return this.http.get<any>(`/Common/GetCategoriesForFilter`);
  }

  getProducts(categoryId: number, keyword: string) {
    return this.http.get<any>(`/Common/GetProductsWithProps?categoryId=${categoryId}&productName=${keyword}`);
  }
}
