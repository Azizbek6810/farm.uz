import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
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
  FrontProductDetails,
  OfferFiles,
  PlangraphList,
  PledgeCommissionItem,
  UserRecord
} from 'src/app/core/models/common.models';
import { CoreStates, CustomerType, OfferStatuses } from 'src/app/core/models/enum.models';
import { CommonService } from 'src/app/core/services/common.service';
import { EsiService } from 'src/app/core/services/esi.service';
import { MinioService } from 'src/app/core/services/minio.service';
import { IdNameTreeModel } from 'src/app/pages/cabinet/provider/provider.models';
import { JsDeliveriesComponent } from 'src/app/shared/components/js-deliveries/js-deliveries.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('addLotModal', { static: false }) addLotModal: ModalDirective;
  @ViewChild(JsDeliveriesComponent) private jsDeliviriesComponent: JsDeliveriesComponent;

  subs: Subscription;
  offerId: number;
  productState = CoreStates.none;
  typeId: number = 0;
  product: FrontProductDetails;
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
  selectedPlangraph: PlangraphList;
  customerType: number;
  expenditures: ExpenditureItem[];
  customerTypeId: number;
  customerTypes = CustomerType;
  userAccounts: AccountItem[];
  selectedRecord: UserRecord;
  productUnitName: string;
  pledgeCommissionModel: AddLotPledgeCommission = new AddLotPledgeCommission();
  pledgeCommission: PledgeCommissionItem;
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
  lm = 100;
  offerStatuses = OfferStatuses;
  isAuthorized: boolean;
  modalRef: BsModalRef;
  productId: number;
  regionsForBidDistricts: IdNameTreeModel[];
  lotAddFormSubmitter: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private service: CommonService,
    private router: Router,
    private minio: MinioService,
    private sanitizerMinio: DomSanitizer,
    private auth: AuthenticationService,
    private toast: ToastrService,
    private esi: EsiService
  ) {}

  ngOnInit(): void {
    this.isAuthorized = this.auth.isAuthenticated();
    this.customerType = +this.auth.getCustomerType();
    this.userRoleId = +this.auth.getRoleId();
    this.subs = combineLatest([this.route.params, this.route.queryParams]).subscribe(([params]) => {
      this.offerId = +params['id'];
      this.relatedProductList(this.offerId);
      this.loadProduct();
      this.loadRegionsDistricts();
      if (this.auth.isAuthenticated()) {
        if (this.userRoleId == this.roleTypes.Customer) {
          this.loadUserRecords();
          if (this.customerType == this.customerTypes.budget) {
            this.loadAccounts();
          }
        }
      }
    });
  }

  loadExpenditures() {
    this.service.libGetExpenditures(this.product.product_code).subscribe(data => {
      this.expenditures = data;
    });
  }

  loadOfferPlangraphs() {
    this.loadingPlangraphs = true;
    this.service.getPlangraphList(this.product.product_code).subscribe(
      data => {
        this.loadingPlangraphs = false;
        this.offerPlangraphs = data;
      },
      error => {
        this.loadingPlangraphs = false;
      }
    );
  }

  onBidClick() {
    this.addLotModel = new AddLot();
    this.addLotModal.show();
    this.addLotType = 0;
    this.loadRegionsForBidDistricts();
  }

  loadRegionsForBidDistricts() {
    this.service.getOfferDeliviries(this.offerId, this.typeId).subscribe(data => {
      this.regionsForBidDistricts = data;
    });
  }

  getLimits() {
    this.limitLoading = true;
    const b = {
      product_Code: this.product.product_code,
      cost: isNaN(this.addLotModel.amount * this.product.price) ? 0 : this.addLotModel.amount * this.product.price
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
        this.limitLoading = false;
        this.limitIsShow = true;
        this.limitZero = false;
      }
    );
  }

  getBRV() {
    this.service.loadBRV().subscribe(data => {
      if (data !== null) {
        this.BRVValue = data;
      }
    });
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
    if (+this.addLotModel.amount > 0) {
      this.pledgeCommissionModel.bid_cost = +this.addLotModel.amount * this.product.price;
      this.pledgeCommissionModel.start_cost = +this.addLotModel.amount * this.product.price;
      this.loadPledgeCommission();
    } else {
      this.pledgeCommission = undefined;
    }
  }

  loadPledgeCommission() {
    this.service.getOfferCustomerPledgeAndComission(this.pledgeCommissionModel).subscribe(data => {
      this.pledgeCommission = data;
    });
  }

  onOfferSubmit(form: NgForm) {
    if (!form.valid) {
      this.formValidation(form);
      return;
    } else {
      this.lotAddFormSubmitter = true;
      this.addLotModel.js_regions_districts = this.jsDeliviriesComponent.getSelectedDeliviries();
      if (!(this.addLotModel.js_regions_districts.length > 0)) {
        this.toast.error('Укажите регионы и районы поставки!');
        this.lotAddFormSubmitter = false;
        return;
      }
      if (this.addLotModel.amount < this.product.min_delivery_amount) {
        this.toast.error('Количество не может быть ниже минимальной партии!');
        this.lotAddFormSubmitter = false;
        return;
      }
      if (this.addLotModel.amount > this.product.max_delivery_amount) {
        this.toast.error('Количество не может быть выше максимальной партии!');
        this.lotAddFormSubmitter = false;
        return;
      }
      if (this.addLotType === 1) {
        if (this.customerType == this.customerTypes.budget) {
          if (!this.addLotModel.Kazna_Account) {
            this.toast.error('Выберите счет заказчика в казначействе');
            this.lotAddFormSubmitter = false;
            return;
          }
          if (!this.addLotModel.expenditure_id) {
            this.toast.error('Выберите статью расходов');
            this.lotAddFormSubmitter = false;
            return;
          }
        }
      }
      this.addLotModel.amount = +this.addLotModel.amount;
      this.addLotModel.is_Auto_Plangraph = this.addLotType;
      this.addLotModel.offer_id = this.offerId;
      this.addLotModel.customer_type_id = this.customerType;
      if (environment.requiredEsi) {
        this.addLotModel.signature = '';
        this.addLotModel.signed_data = '';
        this.esi.sign(JSON.stringify(this.addLotModel), (data: any, dataSigned: any) => {
          // console.log('yahooo rabotaet ', data, dataSigned);
          this.addLotModel.signed_data = JSON.stringify(this.addLotModel);
          this.addLotModel.signature = dataSigned;
          this.customerAddLot();
        });
      } else {
        this.customerAddLot();
      }
    }
  }

  formValidation(f: NgForm) {
    setTimeout(() => {
      this.setValidation(f.form.controls['amount']);
      this.setValidation(f.form.controls['record_id']);
      if (this.addLotType === 0) {
        this.setValidation(f.form.controls['plan_id']);
      }
      if (this.customerType === this.customerTypes.budget) {
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

  customerAddLot() {
    this.service.addLot(this.addLotModel).subscribe(
      data => {
        this.onOfferClose();
        this.lotAddFormSubmitter = false;
        this.toast.success('Успешно выполнено!');
        this.router.navigate(['/cabinet/customer/my-lots']);
      },
      error => {
        this.lotAddFormSubmitter = false;
      }
    );
  }

  onOfferClose() {
    this.addLotModal.hide();
  }

  changeAddLotType(type: any) {
    this.addLotType = type;
    this.addLotModel = new AddLot();
  }

  onGraphChange(item: any) {
    this.selectedPlangraph = item;
    for (let i = 0; i < this.product.js_properties.length; i++) {
      for (let j = 0; j < this.selectedPlangraph.js_properties.length; j++) {
        if (
          this.product.js_properties[i].pnum === this.selectedPlangraph.js_properties[j].pnum &&
          this.product.js_properties[i].user_value_id === this.selectedPlangraph.js_properties[j].pval
        ) {
          this.selectedPlangraph.js_properties[j].checked = true;
        }
      }
    }
    this.addLotModel.expenditure_id = item.expenditure_id;
    this.addLotModel.expenditure_name = item.expenditure_name;
    this.addLotModel.account = item.kazna_account;
    this.addLotModel.account_id = item.kazna_account_id;
  }

  loadProduct() {
    this.productState = CoreStates.loading;
    this.service.getOffer(this.offerId, this.typeId).subscribe(data => {
      if (data) {
        this.product = data;
        if (this.product.js_files.find(s => s.file_id === this.product.main_image_id)) {
          this.mainFile = this.product.js_files.find(s => s.file_id === this.product.main_image_id);
          this.mainFile.selected = true;
        }
        if (this.product.js_properties.find(s => s.pnum === 0)) {
          this.productUnitName = this.product.js_properties.find(s => s.pnum === 0).user_value;
        }
        this.getImage(this.mainFile, '').then(res => {
          this.mainFile = res;
          this.mainImageUrl = res.main_image;
          this.productState = CoreStates.loaded;
        });
        this.loadProductImages(this.product.js_files).then((res: any) => {
          this.productState = CoreStates.loaded;
        });
      }
      if (this.userRoleId == this.roleTypes.Customer) {
        this.loadOfferPlangraphs();
        if (this.customerType == this.customerTypes.budget) {
          this.loadExpenditures();
        }
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
      }
    });
  }

  loadRegionsDistricts() {
    this.service.getOfferDeliviries(this.offerId, this.typeId).subscribe(data => {
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
        } else {
          data(null);
        }
      });
    });
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
    let item = this.product.js_files.find(s => s.selected == true);
    if (item) {
      item.selected = false;
    }
  }
}
