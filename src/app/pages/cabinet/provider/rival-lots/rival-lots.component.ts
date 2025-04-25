import { Component, OnInit } from '@angular/core';
import { CabinetFilterSection, LotProviderType } from 'src/app/core/models/enum.models';
import { RivalLotList } from '../provider.models';
import { CustomerLotItems } from '../../cabinet.models';
import { CustomerLotListProperties, ProviderOffersFilter, TimeLimitItems } from 'src/app/core/models/common.models';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-rival-lots',
  templateUrl: './rival-lots.component.html',
  styleUrls: ['./rival-lots.component.css']
})
export class RivalLotsComponent implements OnInit {
  filterSections = [CabinetFilterSection.keyword];
  rivalLots: RivalLotList[];
  lots: CustomerLotItems[];
  size: number = 5;
  page: number = 0;
  pageItemCount: number = 20;
  maxCount: number;
  filter: ProviderOffersFilter = new ProviderOffersFilter();
  loadingLots: boolean = false;
  loadingOffers: boolean = false;
  error: string;
  offset: any;
  providerType = LotProviderType;
  limitItems = TimeLimitItems;

  constructor(private service: ProviderService) {}

  ngOnInit(): void {
    this.offset = new Date().getTimezoneOffset();
    this.nextPage();
  }

  loadRivalLots() {
    this.loadingLots = true;
    this.filter.is_local_manufacturer = 1;
    this.service.getRivalLots(this.filter).subscribe(
      data => {
        this.loadingLots = false;
        this.rivalLots = data;
        if (data.length > 0) {
          this.maxCount = data[0].total_count;
        }
      },
      error => {
        console.log(error);
        this.loadingLots = false;
      }
    );
  }

  reset() {
    this.page = 0;
    this.filter = new ProviderOffersFilter();
    this.nextPage();
  }

  onDetails(lotId: number) {
    let url = `/lot-details/${lotId}`;
    window.open(url, '_blank');
  }

  getUnitName(items: CustomerLotListProperties[]) {
    return items ? items.filter(s => s.pnum == 0)[0].user_value : '';
  }

  onOfferDetails(offerId: number) {
    let url = `/product-details/${offerId}`;
    window.open(url, '_blank');
  }

  nextPage() {
    if (this.page == 0 || this.page * this.pageItemCount < this.maxCount) {
      this.page += 1;
      this.filter.from = (this.page - 1) * this.pageItemCount + 1;
      this.filter.to = this.page * this.pageItemCount;
      this.loadRivalLots();
    }
  }

  onPageChange(event: any) {
    this.page = event.page - 1;
    this.nextPage();
  }

  onLimitsChange(value: any) {
    this.page = 0;
    this.nextPage();
  }
}
