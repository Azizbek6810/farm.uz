import { Component, OnInit } from '@angular/core';
import { CabinetFilterSection, OfferStatuses } from 'src/app/core/models/enum.models';
import { CustomerLotItems } from '../../cabinet.models';
import { ProviderOffersFilter, TimeLimitItems, TradeFilterModel } from 'src/app/core/models/common.models';
import { OfferNew, RivalStats } from '../../provider/provider.models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/core/services/common.service';
import { CabinetService } from '../../cabinet.service';
import { EsiService } from 'src/app/core/services/esi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-my-lots',
  templateUrl: './my-lots.component.html',
  styleUrls: ['./my-lots.component.css']
})
export class MyLotsComponent implements OnInit {
  filterSections = [CabinetFilterSection.keyword];

  lots: CustomerLotItems[];
  modalFilter: TradeFilterModel = new TradeFilterModel();
  size: number = 5;
  page: number = 0;
  offerId: number = 0;
  pageItemCount: number = 20;
  maxCount: number;
  limitItems = TimeLimitItems;
  offerStatusId: number;
  filter: ProviderOffersFilter = new ProviderOffersFilter();
  loadingLots: boolean = false;
  offerStatuses = OfferStatuses;
  newOffers: OfferNew[];
  loadingOffers: boolean = false;
  modalRef: BsModalRef;
  error: string;
  rivalStats: RivalStats[] = [];
  offset: any;

  constructor(
    private commonService: CommonService,
    private cabinetService: CabinetService,
    private modalService: BsModalService,
    private esi: EsiService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private toast: ToastrService,
    private service: CustomerService
  ) {}

  ngOnInit(): void {
    this.offset = new Date().getTimezoneOffset();
    this.nextPage();
  }

  nextPage() {
    if (this.page == 0 || this.page * this.pageItemCount < this.maxCount) {
      this.page += 1;
      this.filter.from = (this.page - 1) * this.pageItemCount + 1;
      this.filter.to = this.page * this.pageItemCount;
      this.loadLots();
    }
  }

  toProduct(productId: number) {
    let url = `/product-details/${productId}`;
    window.open(url, '_blank');
  }

  toLot(lotId: number) {
    let url = `/lot-details/${lotId}`;
    window.open(url, '_blank');
  }

  reset() {
    this.page = 0;
    this.filter = new ProviderOffersFilter();
    this.nextPage();
  }

  loadLots() {
    this.loadingLots = true;
    this.filter.is_local_manufacturer = 1;
    this.service.getLots(this.filter).subscribe({
      next: data => {
        this.loadingLots = false;
        this.lots = data;
        if (data.length > 0) {
          this.maxCount = data[0].total_count;
        }
      },
      error: e => {
        this.loadingLots = false;
      }
    });
  }

  onLimitsChange(value: any) {
    this.page = 0;
    this.nextPage();
  }

  onPageChange(event: any) {
    this.page = event.page - 1;
    this.nextPage();
  }
}
