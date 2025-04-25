import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import { CabinetFilterSection, CoreStates } from 'src/app/core/models/enum.models';
import { CustomerLotItems, IsLocalFilter } from '../../cabinet.models';
import { IdNameModel, TerminatedDealModel, TimeLimitItems } from 'src/app/core/models/common.models';
import { RivalStats } from '../provider.models';
import { ActivatedRoute } from '@angular/router';
import { ProviderService } from '../provider.service';

@Component({
  selector: 'app-my-lots',
  templateUrl: './my-lots.component.html',
  styleUrls: ['./my-lots.component.css']
})
export class MyLotsComponent implements OnInit {
  filterSections = [CabinetFilterSection.keyword];
  lots: CustomerLotItems[];
  kaznaSelectedLots: CustomerLotItems;
  filter: IsLocalFilter = new IsLocalFilter();
  size: number = 5;
  page: number = 0;
  pageItemCount: number = 20;
  maxCount: number;
  limitItems = TimeLimitItems;
  subs: Subscription;
  isLocal: number;
  rivalStats: RivalStats[] = [];

  branches: IdNameModel[] = [];
  selectedBranch = 0;
  clientType = 0;

  loadingLots: boolean = false;
  selectedDealHistory: TerminatedDealModel[] = [];
  selectedDeal: CustomerLotItems;
  modalRef: BsModalRef;
  error: string;
  penaltiesState = CoreStates.none;

  destroy$: Subject<any>;

  constructor(
    private route: ActivatedRoute,
    private service: ProviderService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.subs = this.route.params.subscribe(param => {
      this.makeStats();
      this.isLocal = +param['local'];
      this.page = 0;
      this.nextPage();
    });
  }

  loadLots() {
    this.loadingLots = true;
    this.filter.is_local_manufacturer = 1;
    if (this.selectedBranch > 0) {
      this.filter.sub_user_id = this.selectedBranch;
    } else {
      this.filter.sub_user_id = null;
    }
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

  reset() {
    this.page = 0;
    this.filter = new IsLocalFilter();
    this.nextPage();
  }

  makeStats() {
    let firstStatus = <RivalStats>{ is_local_manufacturer: 2, count: undefined, manufacturer_type_name: 'Все' };
    let secondStatus = <RivalStats>{
      is_local_manufacturer: 1,
      count: undefined,
      manufacturer_type_name: 'Местный производитель'
    };
    let thirdStatus = <RivalStats>{
      is_local_manufacturer: 0,
      count: undefined,
      manufacturer_type_name: 'Электронный магазин'
    };
    this.rivalStats.push(firstStatus);
    this.rivalStats.push(secondStatus);
    this.rivalStats.push(thirdStatus);
  }

  nextPage() {
    if (this.page == 0 || this.page * this.pageItemCount < this.lots[0].total_count) {
      this.page += 1;
      this.filter.from = (this.page - 1) * this.pageItemCount + 1;
      this.filter.to = this.page * this.pageItemCount;
      this.loadLots();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.filter.from = (this.page - 1) * this.pageItemCount + 1;
      this.filter.to = this.page * this.pageItemCount;
      this.loadLots();
    }
  }

  onLimitsChange(value: any) {
    this.page = 0;
    this.nextPage();
  }

  onPageChange(event: any) {
    this.page = event.page - 1;
    this.filter.from = (this.page - 1) * this.pageItemCount + 1;
    this.filter.to = this.page * this.pageItemCount;
    this.nextPage();
  }

  toProduct(productId: number) {
    let url = `/product-details/${productId}`;
    window.open(url, '_blank');
  }

  toLot(lotId: number) {
    let url = `/lot-details/${lotId}`;
    window.open(url, '_blank');
  }

  showKaznaNote(item: CustomerLotItems, template: TemplateRef<any>) {
    this.kaznaSelectedLots = item;
    this.modalRef = this.modalService.show(template, {
      keyboard: false,
      animated: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-dialog modal-dialog-centered draggable modal-lg max-width-90'
    });
  }

  openFilter() {
    // this.filterModal.show();
  }
  closeFilter() {
    // this.filterModal.hide();
  }

  resetFilter() {
    // this.modalFilter = new TradeFilterModel();
    this.closeFilter();
    this.page = 0;
    this.filter = new IsLocalFilter();
    this.nextPage();
  }

  onDiscountDealsClick(deal: any, template: TemplateRef<any>) {}

  modalClose() {}

  acceptDiscountDeal(terminate_deal_id: any) {}

  denyDiscountDeal(terminate_deal_id: any) {}
}
