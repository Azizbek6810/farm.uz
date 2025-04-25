import { Component, OnInit } from '@angular/core';
import { CabinetFilterSection, DealStatus } from 'src/app/core/models/enum.models';
import { CustomerDeal, IsLocalFilter } from '../../cabinet.models';
import { TimeLimitItems } from 'src/app/core/models/common.models';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../customer.service';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';

@Component({
  selector: 'app-my-deals',
  templateUrl: './my-deals.component.html',
  styleUrls: ['./my-deals.component.css']
})
export class MyDealsComponent implements OnInit {
  filterSections = [CabinetFilterSection.keyword];
  deals: CustomerDeal[];
  filter: IsLocalFilter = new IsLocalFilter();
  size: number = 5;
  page: number = 0;
  pageItemCount: number = 20;
  maxCount: number;
  limitItems = TimeLimitItems;
  customerType: number;
  lang = '';
  loadingDeals: boolean = false;
  dealStatus = DealStatus;
  error: string;
  selectedBranch = 0;
  clientType = 0;
  sub: Subscription;
  getListURL = '';
  statusName: string;

  constructor(
    private route: ActivatedRoute,
    private service: CustomerService,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if (params['status']) {
        this.statusName = params['status'];
        switch (this.statusName) {
          case 'new':
            this.getListURL = 'GetNewDeals';
            break;
          case 'paid':
            this.getListURL = 'GetPaidDeals';
            break;
          case 'delivered':
            this.getListURL = 'GetDeliveredDeals';
            break;
          case 'terminated':
            this.getListURL = 'GetTerminatedDeals';
            break;
          case 'restored':
            this.getListURL = 'GetRestoredDeals';
            break;
          case 'annulled-no-payment':
            this.getListURL = 'GetAnnuledNoPaymentDeals';
            break;
          case 'delivery-expired':
            this.getListURL = 'GetDeliveryExpiredDeals';
            break;
          case 'payment-expired':
            this.getListURL = 'GetPaymentExpiredDeals';
            break;
          case 'payment-returned':
            this.getListURL = 'GetPaymentReturnedDeals';
            break;
          default:
            this.getListURL = 'GetDeals';
            break;
        }
      } else {
        this.getListURL = 'GetDeals';
      }
      this.firstPage();
      this.customerType = +this.auth.getCustomerType();
      // this.loadPenalties();
    });
    this.clientType = this.auth.getProfile().clientType;
    this.lang = localStorage.getItem('language');
  }

  firstPage() {
    this.page = 0;
    this.nextPage();
  }

  nextPage() {
    if (this.page == 0 || this.page * this.pageItemCount < this.deals[0].total_count) {
      this.page += 1;
      this.filter.from = (this.page - 1) * this.pageItemCount + 1;
      this.filter.to = this.page * this.pageItemCount;
      this.loadDeals();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.filter.from = (this.page - 1) * this.pageItemCount + 1;
      this.filter.to = this.page * this.pageItemCount;
      this.loadDeals();
    }
  }

  loadDeals() {
    this.loadingDeals = true;
    if (this.selectedBranch > 0) {
      this.filter.sub_user_id = this.selectedBranch;
    } else {
      this.filter.sub_user_id = null;
    }
    this.service.getDealsStatus(this.getListURL, this.filter).subscribe(data => {
      this.loadingDeals = false;
      this.deals = data;
      if (data.length > 0) {
        this.maxCount = data[0].total_count;
      }
    });
  }

  toLot(lotId: number) {
    let url = `/lot-details/${lotId}`;
    window.open(url, '_blank');
  }

  reset() {
    this.page = 0;
    this.filter = new IsLocalFilter();
    this.nextPage();
  }

  onPageChange(event: any) {}

  onLimitsChange(value: any) {}
}
