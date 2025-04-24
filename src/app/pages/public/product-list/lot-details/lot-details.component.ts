import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription, combineLatest } from 'rxjs';
import { RoleType } from 'src/app/core/auth/authentication.models';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import {
  AccountItem,
  AddLot,
  AddLotPledgeCommission,
  ExpenditureItem,
  FrontOfferListItemModel,
  OfferFiles,
  PlangraphList,
  PledgeCommissionItem,
  UserRecord
} from 'src/app/core/models/common.models';
import { CoreStates, CustomerType, LotProviderType, ShopLotStatus } from 'src/app/core/models/enum.models';
import { CommonService } from 'src/app/core/services/common.service';
import { EsiService } from 'src/app/core/services/esi.service';
import { MinioService } from 'src/app/core/services/minio.service';
import { AddBid, IdNameTreeModel, LotDetails } from 'src/app/pages/cabinet/provider/provider.models';
import { JsDeliveriesComponent } from 'src/app/shared/components/js-deliveries/js-deliveries.component';
import { environment } from 'src/environments/environment';

declare var $: any;
declare var FlipClock: any;
@Component({
  selector: 'app-lot-details',
  templateUrl: './lot-details.component.html',
  styleUrls: ['./lot-details.component.css']
})
export class LotDetailsComponent implements OnInit {
  @ViewChild('bidTemplate', { static: false }) bidTemplate: ModalDirective;

  @ViewChild(JsDeliveriesComponent) private jsDeliviriesComponent: JsDeliveriesComponent;
  subs: Subscription;
  lotId: number;
  productState = CoreStates.none;
  typeId: number = 0;
  lotDetails: LotDetails;
  dempingPercentage: number = 85;
  currentUserId: number;
  mainImageUrl: any;
  mainFile: OfferFiles;
  mainImageThumbUrl: any;
  relatedProducts: FrontOfferListItemModel[] = [];
  relatedProductsLoading: boolean = false;
  regionsDistricts: IdNameTreeModel[];
  addLotType = 0;
  addLotModel: AddLot = new AddLot();
  offerPlangraphs: PlangraphList[];
  loadingPlangraphs: boolean = false;
  customerType: number;
  addBidModel: AddBid = new AddBid();
  modalRef: BsModalRef;
  offerFormSubmitted: boolean = false;
  expenditures: ExpenditureItem[];
  providerType = LotProviderType;
  customerTypes = CustomerType;
  userAccounts: AccountItem[];
  selectedRecord: UserRecord;
  productUnitName: string;
  pledgeCommissionModel: AddLotPledgeCommission = new AddLotPledgeCommission();
  pledgeCommission: PledgeCommissionItem;
  dempingPrice: number;
  userRecords: UserRecord[];
  userRoleId: number;
  roleTypes = RoleType;
  limitIsShow = false;
  limitLoading = false;
  limitZero = false;
  dynamic: any = null;
  maxLimit: any = null;
  currentBRV: any = 0;
  BRVValue: any = null;
  isAuthorized: boolean;
  regionsForBidDistricts: IdNameTreeModel[];
  lotAddFormSubmitter: boolean = false;
  rest_time = 0;
  clock: any;
  isPublished: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: CommonService,
    private router: Router,
    private minio: MinioService,
    private sanitizerMinio: DomSanitizer,
    private auth: AuthenticationService,
    private modalService: BsModalService,
    private toast: ToastrService,
    private esi: EsiService
  ) {}

  ngOnInit(): void {
    this.isAuthorized = this.auth.isAuthenticated();
    this.customerType = +this.auth.getCustomerType();
    this.currentUserId = this.auth.getProfile().clientId;
    this.userRoleId = +this.auth.getRoleId();
    this.combineLatest();
  }

  private combineLatest() {
    this.subs = combineLatest([this.route.params, this.route.queryParams]).subscribe(([params]) => {
      this.lotId = +params['id'];
      this.relatedProductList(this.lotId);
      this.loadLotDetails();
      this.loadRegionsForLotDistricts();
      if (this.isAuthorized) {
        this.loadUserRecords();
      }
    });
  }

  onAccountChange(item: any) {
    this.selectedRecord = item;
  }

  onBidSubmit() {
    this.offerFormSubmitted = true;
    if (+this.addBidModel.price > this.lotDetails.price) {
      this.toast.error('Предлагаемая цена не может быть выше стартовой суммы!');
      this.offerFormSubmitted = false;
      return;
    }
    if (
      this.lotDetails.is_license_required &&
      this.lotDetails.is_license_required === 1 &&
      (!this.addBidModel.js_files || (this.addBidModel.js_files && this.addBidModel.js_files.length === 0))
    ) {
      this.toast.error('Загрузить файл!');
      this.offerFormSubmitted = false;
      return;
    }
    this.addBidModel.lot_id = this.lotId;
    if (environment.requiredEsi) {
      this.addBidModel.signature = '';
      this.addBidModel.signed_data = '';
      this.esiSign();
    } else {
      this.sendAddBid();
    }
  }

  private esiSign() {
    this.esi.sign(JSON.stringify(this.addBidModel), (data: any, dataSigned: any) => {
      this.addBidModel.signed_data = JSON.stringify(this.addBidModel);
      this.addBidModel.signature = dataSigned;
      this.sendAddBid();
    });
  }

  sendAddBid() {
    this.service.addBid(this.addBidModel).subscribe(
      data => {
        this.offerFormSubmitted = false;
        this.onBidClose();
        this.toast.success('Успешно отправлено');
        this.loadLotDetails();
      },
      error => {
        this.offerFormSubmitted = false;
      }
    );
  }

  runTimer() {
    setTimeout(() => {
      FlipClock.Lang['ru'] = {
        years: 'лет',
        months: 'месяцев',
        days: 'Дни',
        hours: 'Часов',
        minutes: 'Минут',
        seconds: 'Секунд'
      };
      this.clock = $('.clock').FlipClock({
        language: 'ru',
        clockFace: 'DailyCounter',
        autoStart: false,
        countdown: true,
        callbacks: {
          stop: function () {
            $('.clock').html('The clock has stopped!');
          },
          interval: function () {
            setTimeout(() => {
              $('.clock a').attr('href', 'javascript:void(0)');
            });
          }
        }
      });
      this.clock.setTime(this.rest_time);
      this.clock.start();
      setTimeout(() => {
        $('.clock .flip-clock-label').remove();
        $('.clock a').attr('href', 'javascript:void(0)');
      });
    }, 200);
  }

  loadExpenditures() {
    this.service.libGetExpenditures(this.lotDetails.product_code).subscribe(data => {
      this.expenditures = data;
    });
  }

  loadOfferPlangraphs() {
    this.loadingPlangraphs = true;
    this.service.getPlangraphList(this.lotDetails.product_code).subscribe(
      data => {
        this.loadingPlangraphs = false;
        this.offerPlangraphs = data;
      },
      error => {
        this.loadingPlangraphs = false;
        console.log(error);
      }
    );
  }

  onBidModal(ref: any) {
    this.addBidModel = new AddBid();
    this.modalRef = this.modalService.show(ref, {
      keyboard: false,
      animated: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog modal-xl'
    });
    this.addLotType = 0;
    // this.loadRegionsForBidDistricts();
  }

  onBidClose() {
    this.modalRef.hide();
    this.selectedRecord = undefined;
    this.pledgeCommission = undefined;
  }

  loadRegionsForLotDistricts() {
    this.service.getLotRegionsDistricts(this.lotId).subscribe(data => {
      this.regionsDistricts = data;
    });
  }

  getLimits() {
    this.limitLoading = true;
    const b = {
      product_Code: this.lotDetails.product_code,
      cost: isNaN(this.addLotModel.amount * this.lotDetails.price) ? 0 : this.addLotModel.amount * this.lotDetails.price
    };
    this.getBRV();
    this.service.getLimit(b).subscribe(
      data => {
        if (data !== null) {
          if (data.max_amount === 0) {
            this.limitZero = true;
            this.limitLoading = false;
            this.limitIsShow = true;
            this.dynamic = 100;
            return;
          }
          this.maxLimit = data.max_amount;
          this.dynamic = data.current_amount;
          if (this.BRVValue !== 0) {
            this.currentBRV = +((this.maxLimit - this.dynamic) / this.BRVValue).toFixed(0);
          }
          this.limitLoading = false;
          this.limitIsShow = true;
          this.limitZero = false;
        }
      },
      error => {
        console.log(error);
        this.limitLoading = false;
        this.limitIsShow = true;
        this.limitZero = false;
      }
    );
  }

  getBRV() {
    this.service.loadBRV().subscribe(
      data => {
        if (data !== null) {
          this.BRVValue = data;
        }
      },
      error1 => {
        console.log(error1);
      }
    );
  }

  onRecordChange(record: any) {
    this.selectedRecord = record;
  }

  loadAccounts() {
    this.service.getAccounts(this.customerType).subscribe(data => {
      this.userAccounts = data;
    });
  }

  loadUserRecords() {
    this.service.getUserRecords().subscribe(data => {
      this.userRecords = data;
    });
  }

  onGetCommission() {
    if (+this.addBidModel.price > 0) {
      this.pledgeCommissionModel.bid_cost = +this.addBidModel.price * this.lotDetails.lot_amount;
      this.pledgeCommissionModel.start_cost = this.lotDetails.price * this.lotDetails.lot_amount;
      this.loadPledgeCommission();
      this.makeDemping();
    } else {
      this.pledgeCommission = undefined;
      this.dempingPrice = undefined;
    }
  }

  makeDemping() {
    const dempedPrice = (this.dempingPercentage / 100) * this.lotDetails.price;
    if (+this.addBidModel.price <= dempedPrice) {
      this.dempingPrice = this.lotDetails.price - +this.addBidModel.price;
    } else {
      this.dempingPrice = undefined;
    }
  }

  loadPledgeCommission() {
    this.service.getOfferCustomerPledgeAndComission(this.pledgeCommissionModel).subscribe(data => {
      this.pledgeCommission = data;
      // console.log('pledge commission: ', data);
    });
  }

  formValidation(f: NgForm) {
    setTimeout(() => {
      this.setValidation(f.form.controls['amount']);
      this.setValidation(f.form.controls['record_id']);
      if (this.addLotType === 0) {
        this.setValidation(f.form.controls['plan_id']);
      }
      if (this.customerType == this.customerTypes.budget) {
        this.setValidation(f.form.controls['expenditure_id']);
      }
    }, 200);
  }

  setValidation(f: any) {
    setTimeout(() => {
      if (f.valid) {
        return;
      }
      f.setValidators(Validators.required);
      f.setErrors({ required: true });
      f.markAsDirty();
      f.markAsTouched();
    }, 50);
  }

  loadLotDetails() {
    this.productState = CoreStates.loading;
    this.service.getLot(this.lotId).subscribe(data => {
      if (data) {
        // console.log('product loaded: ', data);
        this.lotDetails = data;
        if (this.lotDetails.js_files.find(s => s.file_id === this.lotDetails.main_image_id)) {
          this.mainFile = this.lotDetails.js_files.find(s => s.file_id === this.lotDetails.main_image_id);
          this.mainFile.selected = true;
        }

        if (this.lotDetails.js_properties.find(s => s.pnum === 0)) {
          this.productUnitName = this.lotDetails.js_properties.find(s => s.pnum === 0).user_value;
        }

        this.getImage(this.mainFile, '').then(res => {
          this.mainFile = res;
          this.mainImageUrl = res.main_image;
          this.productState = CoreStates.loaded;
        });
        this.loadProductImages(this.lotDetails.js_files).then((res: any) => {
          this.productState = CoreStates.loaded;
        });
      } else {
      }
      if (this.userRoleId == this.roleTypes.Customer) {
        this.loadOfferPlangraphs();
        if (this.customerType == this.customerTypes.budget) {
          this.loadExpenditures();
        }
      }
      if (this.lotDetails.lot_status_id === ShopLotStatus.New) {
        this.isPublished = true;
      }

      this.rest_time = this.lotDetails.rest_time > 0 ? this.lotDetails.rest_time : 0;
      if (this.rest_time > 0) {
        setTimeout(() => {
          this.runTimer();
        });
      }
    });
  }

  relatedProductList(offerId: number) {
    this.relatedProductsLoading = true;
    // this.service.getRelatedProducts(offerId).subscribe(data => {
    //   this.relatedProducts = data;
    //   this.relatedProducts.forEach(item => {
    //     const fileData = new OfferFiles;
    //     fileData.file_path = item.file_path;
    //     fileData.file_name = item.file_name;
    //     this.getImage(fileData, '').then(res => {
    //       item.thumb_image = res.main_image;
    //     })
    //   })
    //   this.relatedProductsLoading = false;
    // })
  }

  downloadFile(file_path: string, file_name: string) {
    this.minio.isFileExist(file_path, file_name).then(data => {
      if (data === 1) {
        this.minio.saveMiniObject(file_path, file_name);
      } else {
      }
    });
  }

  loadRegionsDistricts() {
    this.service.getOfferDeliviries(this.lotId, this.typeId).subscribe(data => {
      this.regionsDistricts = data;
    });
  }

  onViewProductDetails(offerId: number) {
    const link: string = `/product-details/${offerId}`;
    window.open(link, '_blank');
  }

  redirectToProductList(categoryId: number, productCode: string): void {
    let url: string = '';
    url = `/product-list/${categoryId}/${productCode}`;
    window.open(url, '_blank');
  }

  getImage(file: OfferFiles, url: any): Promise<any> {
    return new Promise<any>(data => {
      let san = this.sanitizerMinio;
      let size = 0;
      let fileMinio: BlobPart[] = [];
      this.minio.isFileExist(file.file_path + url, file.file_name).then(isExist => {
        if (isExist === 1) {
          size = this.getMinioObject(file, url, size, fileMinio, san, data);
        } else {
          data(null);
        }
      });
    });
  }

  private getMinioObject(file: OfferFiles, url: any, size: number, fileMinio: BlobPart[], san: DomSanitizer, data: (value: any) => void) {
    this.minio.getMinioObject(file.file_path + url, file.file_name).then(dataStream => {
      dataStream.on('data', function (chunk: any) {
        size += chunk.length;
        fileMinio.push(chunk);
      });
      dataStream.on('end', function () {
        let blob = new Blob(fileMinio, { type: dataStream.headers['content-type'] });
        const unsafeImg = URL.createObjectURL(blob);
        if (url === '') {
          file.main_image = san.bypassSecurityTrustUrl(unsafeImg);
        } else if (url === '/average') {
          file.average_image = san.bypassSecurityTrustUrl(unsafeImg);
        } else {
          file.thumb_image = san.bypassSecurityTrustUrl(unsafeImg);
        }
        data(file);
      });
      dataStream.on('error', function (err: any) {
        data(file);
      });
    });
    return size;
  }

  loadProductImages(items: any): Promise<any> {
    return new Promise(data => {
      for (let i = 0; i < items.length; i++) {
        this.getImage(items[i], '/thumbs').then(file => {
          if (i === items.length - 1) {
            data(1);
          }
        });
      }
    });
  }

  onSelectMain(file: OfferFiles) {
    this.mainFile = file;
    console.log(this.mainFile);
    this.getImage(file, '').then(res => {
      this.mainImageUrl = res.main_image;
    });
    this.getImage(file, '/average').then(res => {
      this.mainImageThumbUrl = res.average_image;
    });
    this.fileClicked(file);
  }

  fileClicked(file: OfferFiles) {
    this.unselectFiles();
    file.selected = true;
  }

  unselectFiles() {
    let item = this.lotDetails.js_files.find(s => s.selected == true);
    if (item) {
      item.selected = false;
    }
  }
}
