import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  OfferAccepted,
  OfferClosed,
  OfferDeletedByProvider,
  OfferDenied,
  OfferExpired,
  OfferNew,
  OfferOutOfStock,
  OfferPublished,
  OffersStatusText,
  RivalStats,
  SendExpiredChecked
} from '../provider.models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CabinetFilterSection, OfferStatuses } from 'src/app/core/models/enum.models';
import { ProviderOffersFilter, TimeLimitItems, TradeFilterModel } from 'src/app/core/models/common.models';
import { Subscription } from 'rxjs';
import { EsiService } from 'src/app/core/services/esi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../provider.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {
  filterSections = [CabinetFilterSection.keyword];
  modalFilter: TradeFilterModel = new TradeFilterModel();
  size: number = 5;
  page: number = 0;
  offerId: number = 0;
  pageItemCount: number = 20;
  maxCount: number;
  limitItems = TimeLimitItems;
  offerStatusId: number;
  subs: Subscription;
  filter: ProviderOffersFilter = new ProviderOffersFilter();
  offerStatuses = OfferStatuses;
  newOffers: OfferNew[];
  deniedOffers: OfferDenied[];
  kaznaSelectedLots: OfferDenied;
  closedOffers: OfferClosed[];
  publishedOffers: OfferPublished[];
  outOfStockOffers: OfferOutOfStock[];
  acceptedOffers: OfferAccepted[];
  expiredOffers: OfferExpired[];
  InsufficientFundsOffers: OfferExpired[];
  deletedByProviderOffers: OfferDeletedByProvider[];
  sendExpiredChecked: SendExpiredChecked = new SendExpiredChecked();
  loadingOffers: boolean = false;
  isLocal: number;
  modalRef: BsModalRef;
  selectedOffer: OfferDenied;
  error: string;
  deleteItemId: number;
  isDeleting: boolean = false;
  rivalStats: RivalStats[] = [];
  checkUncheck = false;
  disableBtn: boolean = false;
  offerSubmitted: boolean = false;

  constructor(
    private modalService: BsModalService,
    private esi: EsiService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private service: ProviderService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.isLocal = 1;
    this.makeStats();
    this.subs = this.route.params.subscribe(param => {
      if (param['statusId']) {
        this.offerStatusId = +param['statusId'];
        this.page = 0;
        this.nextPage();
      }
    });
  }

  get statusName(): string {
    let statusText = '';
    switch (this.offerStatusId) {
      case OffersStatusText.WaitingModeration:
        statusText = this.translate.instant('Cabinet.OnModeration');
        break;
      case OffersStatusText.WaitingPublish:
        statusText = this.translate.instant('Common.WaitingPublish');
        break;
      case OffersStatusText.Denied:
        statusText = this.translate.instant('Common.Denied');
        break;
      case OffersStatusText.Deleted:
        statusText = this.translate.instant('Common.Deleted');
        break;
      case OffersStatusText.Published:
        statusText = this.translate.instant('Cabinet.AfterModeration');
        break;
      case OffersStatusText.OutOfStock:
        statusText = this.translate.instant('Common.OutOfStock');
        break;
      case OffersStatusText.Expired:
        statusText = this.translate.instant('Common.Expired');
        break;
      case OffersStatusText.DeletedByProvider:
        statusText = this.translate.instant('Cabinet.RemovedBySupplier');
        break;
    }
    return statusText;
  }

  onSearch() {
    this.page = 0;
    this.nextPage();
  }

  onEdit(offerId: number) {
    let url = `/cabinet/provider/edit-offer/${offerId}`;
    window.open(url);
  }

  cloneOffer(offerId: number) {
    let url = `/provider/shop/clone-offer/${offerId}`;
    window.open(url);
  }

  edit_2(offerId: number, type: number) {
    if (type === 1) {
      this.offerId = offerId;
      this.openOptionEditModal();
      return;
    }
    let url = `/provider/shop/edit-offer-2/${offerId}`;
    window.open(url);
  }

  onRepublish(offerId: number) {
    let url = `/provider/shop/republish-offer/${offerId}`;
    window.open(url);
  }

  sendCheckedEsi() {
    if (environment.requiredEsi) {
      this.esi.sign(JSON.stringify(this.sendExpiredChecked), (data: any, dataSigned: any) => {
        this.sendExpiredChecked.signed_Data = JSON.stringify(dataSigned);
        this.sendExpiredChecked.signature = dataSigned;
        this.sendChecked();
      });
    } else {
      this.sendChecked();
    }
  }

  sendChecked() {
    this.offerSubmitted = true;
    this.service.setRepublishMass(this.sendExpiredChecked).subscribe(
      res => {
        this.toast.success('Успешно!');
        this.filterOffers();
        this.sendExpiredChecked = new SendExpiredChecked();
        this.checkUncheck = false;
        this.disableBtn = false;
        this.offerSubmitted = false;
      },
      error => {
        this.offerSubmitted = false;
      }
    );
  }

  checkedAll(event: any) {
    let allChecked = this.expiredOffers.map(item => {
      return {
        ...item,
        is_checked: event.target.checked
      };
    });
    this.expiredOffers = allChecked;
    this.sendExpiredChecked.ids = [];
    if (this.expiredOffers && this.expiredOffers.length > 0) {
      this.disableBtn = this.expiredOffers.some(item => item.is_checked);
      this.expiredOffers.forEach(item => {
        if (item.is_checked) {
          this.sendExpiredChecked.ids.push(item.id);
        }
      });
    } else {
      this.disableBtn = false;
    }
  }

  checkedItem(event: any, OfferId: number) {
    let checkes = this.expiredOffers.map(item => {
      return item.id === OfferId
        ? {
            ...item,
            is_checked: event.target.checked
          }
        : item;
    });
    this.expiredOffers = checkes;
    if (this.expiredOffers && this.expiredOffers.length > 0) {
      this.disableBtn = this.expiredOffers.some(item => item.is_checked);
    } else {
      this.disableBtn = false;
    }
    this.sendExpiredChecked.ids.push(OfferId);
  }

  nextPage() {
    if (this.page == 0 || this.page * this.pageItemCount < this.maxCount) {
      this.page += 1;
      this.filter.from = (this.page - 1) * this.pageItemCount + 1;
      this.filter.to = this.page * this.pageItemCount;
      this.filterOffers();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page -= 1;
      this.filter.from = (this.page - 1) * this.pageItemCount + 1;
      this.filter.to = this.page * this.pageItemCount;
      this.filterOffers();
    }
  }

  onStatsChange(item: any) {
    this.page = 0;
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

  filterOffers() {
    this.loadingOffers = true;
    this.filter.display_on_national = 0;
    this.filter.display_on_shop = 1;
    this.service.filterProviderOffers(this.filter, this.offerStatusId).subscribe(data => {
      if (data.length > 0) {
        this.maxCount = data[0].total_count;
      }
      this.loadingOffers = false;
      if (this.offerStatusId == this.offerStatuses.Denied) {
        this.deniedOffers = data;
      } else if (
        this.offerStatusId == this.offerStatuses.Published ||
        this.offerStatusId == this.offerStatuses.Closed
      ) {
        this.publishedOffers = data;
      } else if (this.offerStatusId == this.offerStatuses.New) {
        this.newOffers = data;
        for (let i = 0; i < this.newOffers.length; i++) {
          let newDate = new Date(null);
          if (this.newOffers[i].passed_seconds) {
            this.newOffers[i].passed_seconds_date = this.timesAgo(this.newOffers[i].passed_seconds);
          }
        }
      } else if (this.offerStatusId == this.offerStatuses.OutOfStock) {
        this.outOfStockOffers = data;
      } else if (this.offerStatusId == this.offerStatuses.Accepted) {
        this.acceptedOffers = data;
      } else if (
        this.offerStatusId == this.offerStatuses.Expired ||
        this.offerStatusId == this.offerStatuses.InsufficientFunds
      ) {
        this.expiredOffers = data;
      } else if (this.offerStatusId == this.offerStatuses.DeletedByProvider) {
        this.deletedByProviderOffers = data;
      } else if (this.offerStatusId === 9) {
        this.publishedOffers = data;
      } else if (this.offerStatusId === this.offerStatuses.AutoModerationProlonget) {
        this.publishedOffers = data;
      }
    });
  }

  timesAgo(total_seconds: number) {
    let seconds = total_seconds;
    let text = '';
    let interval = Math.floor(seconds / 31536000);
    interval = Math.floor(seconds / 2592000);
    interval = Math.floor(seconds / 86400);
    text = text + ' ' + interval + ' д';
    let hours = Math.floor(seconds / 3600) % 24;
    text = text + ' ' + hours + ' ч';
    let minutes = Math.floor((seconds % 3600) / 60);
    text = text + ' ' + minutes + ' мин';
    let sec = Math.floor((seconds % 3600) % 60);
    text = text + ' ' + sec + ' сек';
    return text;
  }

  onDeleteModal(itemId: number, template: TemplateRef<any>) {
    this.deleteItemId = itemId;
    this.modalRef = this.modalService.show(template, {
      keyboard: false,
      animated: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog modal-dialog-centered draggable'
    });
  }

  onDelete() {
    this.isDeleting = true;
    this.service.setOfferDeleted(this.deleteItemId).subscribe(
      data => {
        this.toast.success('Успешно!');
        this.page = 0;
        this.nextPage();
        this.isDeleting = false;
        this.onDeleteClose();
      },
      error => {
        this.isDeleting = false;
      }
    );
  }

  onDeleteClose() {
    this.modalRef.hide();
    this.error = '';
  }

  onOfferNoteDetails(item: OfferDenied, template: TemplateRef<any>) {
    this.selectedOffer = item;
    this.modalRef = this.modalService.show(template, {
      keyboard: false,
      animated: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog modal-dialog-centered draggable'
    });
  }

  onNoteDetailsClose() {
    this.modalRef.hide();
  }

  openFilter() {
    // this.filterModal.show();
  }

  openOptionEditModal() {
    // this.editOptional.show();
  }

  closeOptionEditModal() {
    // this.editOptional.hide();
  }

  closeFilter() {
    // this.filterModal.hide();
  }

  resetFilter() {
    this.modalFilter = new TradeFilterModel();
    this.closeFilter();
    this.reset();
  }

  onSetPublished(offerId: number) {
    let body = {
      signature: '',
      signed_data: '',
      offerId: offerId
    };
    if (environment.requiredEsi) {
      this.esi.sign(JSON.stringify(body), (data: any, dataSigned: any) => {
        body.signed_data = JSON.stringify(body);
        body.signature = dataSigned;
        this.sendSetPublish(offerId, body);
      });
    } else {
      this.sendSetPublish(offerId, body);
    }
  }

  sendSetPublish(offerId: number, body: any) {
    this.service.setPublished(offerId, body).subscribe(
      data => {
        this.toast.success('Успешно');
        this.page = 0;
        this.nextPage();
      },
      error => {}
    );
  }

  onDetails(offerId: number, item: any) {
    let url = `/product-details/${offerId}`;
    window.open(url, '_blank');
  }

  showKaznaNote(item: OfferDenied, template: TemplateRef<any>) {
    this.kaznaSelectedLots = item;
    this.modalRef = this.modalService.show(template, {
      keyboard: false,
      animated: true,
      backdrop: true,
      ignoreBackdropClick: false,
      class: 'modal-dialog modal-dialog-centered draggable modal-lg max-width-90'
    });
  }

  modalClose() {
    this.modalRef.hide();
  }

  onLimitsChange(value: any) {
    this.page = 0;
    this.nextPage();
  }

  onPageChange(event: any) {
    this.page = event.page - 1;
    this.nextPage();
  }

  onAdd() {
    this.router.navigate(['/provider/shop/add-offer/1']);
  }

  reset() {
    this.page = 0;
    this.filter = new ProviderOffersFilter();
    this.nextPage();
  }
}
