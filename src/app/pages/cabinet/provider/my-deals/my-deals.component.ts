import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subject, Subscription } from 'rxjs';
import {
  DealDestroyModel,
  DealInvoiceDetails,
  DealProviderInfo,
  IPenaltyModel,
  IdNameModel,
  LotRoadmap,
  TerminatedDealModel,
  TimeLimitItems,
  UserRecord
} from 'src/app/core/models/common.models';
import { CabinetFilterSection, CoreStates, DealStatus } from 'src/app/core/models/enum.models';
import { CustomerDeal, DealPaymentModel, IsLocalFilter } from '../../cabinet.models';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from '../provider.service';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';

@Component({
  selector: 'app-my-deals',
  templateUrl: './my-deals.component.html',
  styleUrls: ['./my-deals.component.css']
})
export class MyDealsComponent implements OnInit {
  filterSections = [CabinetFilterSection.keyword];
  tradeNote = '';
  kaznaDate: any;
  deals: CustomerDeal[];
  filter: IsLocalFilter = new IsLocalFilter();
  penaltiesState = CoreStates.none;
  selectedDealHistory: any[] = [];
  size: number = 5;
  page: number = 0;
  pageItemCount: number = 20;
  currentLot = 0;
  maxCount: number;
  recordId: number;
  limitItems = TimeLimitItems;
  modalRef: BsModalRef;
  paymentModel: DealPaymentModel;
  userRecords: UserRecord[];
  customerType: number;
  langId = 0;
  lang = '';
  objectionId: number;
  objectionList: IdNameModel[] = [];
  terminateDealLoading: boolean;
  paymentSubmitted: boolean = false;
  restoreSubmitted: boolean = false;
  destroyModel: DealDestroyModel;
  penalties: IdNameModel[];
  dealInvoiceDetails: DealInvoiceDetails = new DealInvoiceDetails();
  restorePenaltyList: IPenaltyModel = new IPenaltyModel();
  isPenalty: number;
  loadingDeals: boolean = false;
  dealStatus = DealStatus;
  selectedDeal: CustomerDeal;
  error: string;
  selectedRecord: UserRecord;
  dealDestroyList: TerminatedDealModel[];
  dealParticipantList: DealProviderInfo[];
  sendingTermination: boolean = false;
  sendingParticipants: boolean = false;
  states = CoreStates;

  discountCost: number;
  sendingDiscount = false;
  sendingKazna = false;
  branches: IdNameModel[] = [];
  selectedBranch = 0;
  clientType = 0;
  canPay = false;
  addDestroySubmitted: boolean = false;

  confirmSubmmitted: boolean = false;

  sub: Subscription;
  getListURL = '';
  statusName: string;
  destroy$: Subject<any>;

  penalty_id: number;
  getPayLoading: boolean;

  lotRoadmap: LotRoadmap[];
  loadingLotRoadmap: boolean = false;
  lotIdHistory: any;
  roadmapError: string;
  colorTheme = 'theme-orange';
  bsConfig: Partial<BsDatepickerConfig> = Object.assign(
    {},
    {
      containerClass: this.colorTheme,
      dateInputFormat: 'DD.MM.YYYY'
    }
  );

  constructor(
    private route: ActivatedRoute,
    private service: ProviderService,
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
          case 'payment-returned':
            this.getListURL = 'GetPaymentReturnedDeals';
            break;
          case 'payment-expired':
            this.getListURL = 'GetPaymentExpiredDeals';
            break;
          default:
            this.getListURL = 'GetDeals';
            break;
        }
      } else {
        this.getListURL = 'GetDeals';
      }
      this.page = 0;
      this.filter = new IsLocalFilter();
      this.nextPage();
      // this.loadPenalties();
    });
    this.clientType = this.auth.getProfile().clientType;
    this.lang = localStorage.getItem('language');
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
    // this.filter.is_local_manufacturer = 1;
    this.service.getDeals(this.getListURL, this.filter).subscribe(data => {
      this.loadingDeals = false;
      this.deals = data;
      if (data.length > 0) {
        this.maxCount = data[0].total_count;
      }
    });
  }

  showNoteModal(item: CustomerDeal, template: any) {}

  onShowChat(deal: any, template: TemplateRef<any>) {}

  toLot(lotId: number) {
    let url = `/lot-details/${lotId}`;
    window.open(url, '_blank');
  }

  sendKazna(item: CustomerDeal) {}

  onHideChat() {}

  onPageChange(event: any) {}

  onLimitsChange(value: any) {}

  modalClose() {}

  reset() {
    this.page = 0;
    this.filter = new IsLocalFilter();
    this.nextPage();
  }
}
