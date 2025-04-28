import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { Subject, Subscription } from 'rxjs';
import {
  FileModel,
  IdNameModel,
  IdNameNoteModel,
  License,
  ListFilter,
  ProductsFilter,
  SendFileModel,
  UserRecord,
  VIDEO_FILE_EXTENSIONS
} from 'src/app/core/models/common.models';
import { FileType, LicenseStatus } from 'src/app/core/models/enum.models';
import { JsDeliveriesComponent } from 'src/app/shared/components/js-deliveries/js-deliveries.component';
import {
  AddLicense,
  IdNameTreeModel,
  OfferAddEdit,
  OfferAddEditProperties,
  OfferEditModel,
  OfferEditModelDeliviries,
  ParentElement,
  ProductManafacturer,
  ProductMark,
  ProductWithPropsList,
  ProductWithPropsListProperties
} from '../provider.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ProviderService } from '../provider.service';
import { EsiService } from 'src/app/core/services/esi.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, NgForm, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ErrorHelper } from 'src/app/core/helpers/error.helper';
import { TradeFileManagerComponent } from 'src/app/shared/components/trade-file-manager/trade-file-manager.component';
declare var $: any;

@Component({
  selector: 'app-add-edit-offer',
  templateUrl: './add-edit-offer.component.html',
  styleUrls: ['./add-edit-offer.component.css']
})
export class AddEditOfferComponent implements OnInit {
  @ViewChild('fileManagerModal', { static: false }) fileManagerModal: ModalDirective;
  @ViewChild('fileManagerComponent') private fileManagerComponent: TradeFileManagerComponent;
  @ViewChild('licenseSelect', { static: false }) licenseSelect: ElementRef<any>;
  @ViewChild(JsDeliveriesComponent, { static: false }) private jsDeliviriesComponent: JsDeliveriesComponent;

  isLicenseFile = false;
  licenseFiles: FileModel[] = [];
  selectedFiles: FileModel[] = [];
  fileType = FileType;
  mainFileId: number;
  disableAccount = false;
  mark_type = 1;
  model: OfferAddEdit = new OfferAddEdit();
  userRecords: UserRecord[];
  publishTypes: IdNameNoteModel[];
  selectedType: IdNameNoteModel;
  maxDate = new Date();
  categories: IdNameModel[];
  productMarkName = '';
  manafacturesName = '';
  products: ProductWithPropsList[];
  searchedProducts: ProductWithPropsList[];
  filter: ListFilter = new ListFilter();
  filterSearchProduct: ProductsFilter = new ProductsFilter();
  measures: IdNameModel[];
  periods: IdNameModel[];
  countries: IdNameModel[];
  regionsDistricts: IdNameTreeModel[] = [];
  regionLoading: boolean;
  editOfferDeliviries: OfferEditModelDeliviries[] = [];
  addLiscenseModel: AddLicense;
  modalRef: BsModalRef;
  error: string;
  licenseTypes: IdNameModel[] = [];
  licenseStartDateFormat: Date;
  licenseSubmitted: boolean = false;
  licenseEndDateFormat: Date;
  licenseStartDate: string;
  licenseEndDate: string;
  loadingCategories = '';
  loadingProducts = '';
  subs: Subscription;
  createId: number;
  offerEditModel: OfferEditModel;
  isService: boolean;
  loadingCategory: boolean;
  product_type_id: number;
  selectedProduct: ProductWithPropsList;
  subSelectedProduct: ProductWithPropsListProperties[];
  subUnitProperty: ProductWithPropsListProperties;
  datePickerConfig = {
    isAnimated: true,
    adaptivePosition: true,
    dateInputFormat: 'DD.MM.YYYY',
    containerClass: 'theme-dark-blue',
    showWeekNumbers: false
  };

  issueYearConfig = {
    isAnimated: true,
    adaptivePosition: true,
    dateInputFormat: 'YYYY-MM-DD',
    // minMode: 'year',
    containerClass: 'theme-dark-blue',
    showWeekNumbers: false
  };

  productMarks: ProductMark[];
  filterMarkItems: ProductMark[];
  selectedMark: ProductMark;
  productManafacturers: ProductManafacturer[];
  filteredManafactureres: ProductManafacturer[];
  selectedManafacturer: ProductManafacturer;
  offerEditWhenPublishStatus: boolean = false;
  destroy$: Subject<any>;
  notesModelChangeSubscription: Subscription;
  disableInputsRePublish = false;
  licenses: License[];
  licenseStatus = LicenseStatus;
  issueYearValue: any;
  datePipe: DatePipe = new DatePipe('en-US');
  loadingCountries = '';
  videoFileExtentions = VIDEO_FILE_EXTENSIONS;
  offerSubmitted: boolean = false;
  editModelId: number;
  editType: string = '';

  constructor(
    private router: Router,
    private service: ProviderService,
    private toast: ToastrService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private esi: EsiService
  ) {}

  ngOnInit(): void {
    this.subs = this.route.params.subscribe(param => {
      this.createId = +param['id'];
      if (param['id'] && +param['id'] !== 1) {
        this.editModelId = +param['id'];
        if (this.editModelId && this.editModelId > 0) {
          this.loadEditModel();
        }
      }
    });

    this.loadCategories();
    this.loadPeriods();
    this.loadMeasures();
    this.loadCountries();
    this.loadLicenseTypes();
    this.loadLicenses();
    this.loadRegionsDistrict();
    this.loadPublishTypes();
    this.loadUserRecords();
    this.model.producer_country_id = 244;
  }

  loadEditModel() {
    this.service.getOfferForEdit(this.editModelId).subscribe(
      data => {
        this.offerEditModel = data;
        this.setEditModelFields();
      },
      (error1: any) => {
        this.toast.error('');
        // this.router.navigate(['/provider/dashboard']);
      }
    );
  }

  setEditModelFields() {
    this.model.category_id = this.offerEditModel.category_id;
    this.loadProducts(this.model.category_id, true);
    this.model.js_properties = this.offerEditModel.js_properties;
    this.model.amount = this.offerEditModel.amount;
    this.model.min_delivery_amount = this.offerEditModel.min_delivery_amount;
    this.model.max_delivery_amount = this.offerEditModel.max_delivery_amount;
    this.model.price = this.offerEditModel.price;
    this.model.issue_date = this.offerEditModel.issue_date;
    this.model.shelf_life = this.offerEditModel.shelf_life;
    this.model.shelf_life_period_id = this.offerEditModel.shelf_life_period_id;
    this.model.guarantee_period = this.offerEditModel.guarantee_period;
    this.model.guarantee_period_id = this.offerEditModel.guarantee_period_id;
    this.model.delivery_term = this.offerEditModel.delivery_term;
    this.model.delivery_term_period_id = this.offerEditModel.delivery_term_period_id;
    this.model.producer_country_id = this.offerEditModel.producer_country_id;
    this.model.is_licensed = this.offerEditModel.is_licensed === 1; // ? true : false;
    if (this.model.is_licensed) {
      this.model.license_id = this.offerEditModel.license_id;
    }
    if (this.offerEditModel.display_on_national && this.offerEditModel.display_on_national === 1) {
      this.model.offer_type = 2;
    } else if (this.offerEditModel.display_on_shop && this.offerEditModel.display_on_shop === 1) {
      this.model.offer_type = 1;
    } else {
      this.model.offer_type = this.offerEditModel.offer_type;
    }
    this.model.conditions = this.offerEditModel.condition;
    this.model.record_id = this.offerEditModel.record_id;
    this.model.publish_type_id = this.offerEditModel.typ_publish_id;
    this.editOfferDeliviries = this.offerEditModel.js_delivery_districts;
    this.setProps();
    this.setFilesForEdit();
    this.loadRegionsDistrict();
  }

  setFilesForEdit() {
    this.offerEditModel.js_files.forEach(file => {
      let item = <FileModel>{
        id: file.file_id,
        name: file.file_name,
        path: file.file_path,
        ext: file.file_ext,
        ext_type_id: file.ext_type_id,
        custom_name: file.custom_name
      };
      this.selectedFiles.push(item);
    });
    this.mainFileId = this.offerEditModel.main_image_id;
  }

  loadUserRecords() {
    this.service.getUserRecords().subscribe(data => {
      this.userRecords = data;
    });
  }

  loadPublishTypes() {
    this.service.libGetTypePublish().subscribe(data => {
      this.publishTypes = data;
      this.model.publish_type_id = data[0].id;
      this.selectedType = data[0];
    });
  }

  onPublishType(type: IdNameNoteModel) {
    if (!this.disableInputsRePublish) {
      this.selectedType = type;
    }
  }

  loadRegionsDistrict() {
    this.regionLoading = true;
    let url = '';
    this.service.libGetRegionsDistricts().subscribe(values => {
      this.regionsDistricts = values;
      this.regionLoading = false;
      $('#tree').treejs({
        sourceType: 'json',
        dataSource: this.reassignRegionDistricts()
      });
    });
  }

  isFileVideo(file: FileModel): boolean {
    let item = this.videoFileExtentions.find(s => s === file.ext.toLowerCase());
    return item != null;
  }

  mainFileChecked(id: number) {
    this.mainFileId = id;
  }

  onImageDelete(fileId: number) {
    this.selectedFiles = this.selectedFiles.filter(s => s.id != fileId);
    if (this.mainFileId == fileId) {
      this.mainFileId = null;
    }
  }

  reassignRegionDistricts() {
    let treeItems: ParentElement[] = [];
    this.regionsDistricts.forEach(element => {
      let item = new ParentElement();
      item.parentNodeId = element.id;
      item.parentNodeTxt = element.name;
      item.childNodes = element.children;
      treeItems.push(item);
    });
    return treeItems;
  }

  onLicensed(e: any) {
    if (!this.disableInputsRePublish) {
      if (!this.model.is_licensed) {
        if (this.model.license_id) {
          this.model.license_id = undefined;
        }
      }
    }
  }

  removeLicense(e: any) {
    if (e) {
      this.service.setLicenseDeleted(e.id).subscribe(
        res => {
          this.licenses = [];
          this.model.license_id = null;
          this.loadLicenses();
        },
        error1 => {
          console.log('e', error1);
        }
      );
    }
  }

  loadLicenses() {
    this.service.getLicenses().subscribe(data => {
      this.licenses = data;
    });
  }

  onLicenseClose() {
    this.modalRef.hide();
    this.error = '';
    this.licenseStartDateFormat = undefined;
    this.licenseStartDate = undefined;
    this.licenseEndDateFormat = undefined;
    this.licenseEndDate = undefined;
  }

  onStartDate(e: Date) {
    if (e == null) {
      return;
    }
    this.licenseStartDateFormat = e;
    this.licenseStartDate = this.datePipe.transform(e, 'dd.MM.yyyy'); //DateUtils.getShortDate(e);
    if (this.licenseEndDateFormat && this.licenseEndDateFormat < this.licenseStartDateFormat) {
      this.error = 'Дата начала не может быть выше даты окончании!';
      return;
    } else {
      this.error = '';
    }
  }

  onEndDate(e: Date) {
    if (e == null) {
      return;
    }
    this.licenseEndDateFormat = e;
    this.licenseEndDate = this.datePipe.transform(e, 'dd.MM.yyyy'); //DateUtils.getShortDate(e);
    if (this.licenseStartDateFormat && this.licenseEndDateFormat < this.licenseStartDateFormat) {
      this.error = 'Дата начала не может быть выше даты окончании!';
      return;
    } else {
      this.error = '';
    }
  }

  loadLicenseTypes() {
    this.service.getLicenses().subscribe(data => {
      this.licenseTypes = data;
    });
  }

  openFileManagerForLicense() {
    this.isLicenseFile = true;
    this.onFilesShow();
  }

  deleteLicenseFiles() {
    this.licenseFiles = [];
  }

  LicenseFormValidation(form: NgForm) {
    setTimeout(() => {
      this.setValidation(form.form.controls['name']);
      this.setValidation(form.form.controls['start_date_format']);
    }, 200);
  }

  setValidation(f: AbstractControl) {
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

  onLicenseSubmit(form: NgForm) {
    this.licenseSubmitted = true;
    if (!form.valid) {
      this.LicenseFormValidation(form);
      this.licenseSubmitted = false;
      return;
    }
    if (form.valid) {
      if (!this.licenseStartDateFormat) {
        this.licenseSubmitted = false;
        return;
      }

      if (this.licenseEndDateFormat && this.licenseEndDateFormat < this.licenseStartDateFormat) {
        this.licenseSubmitted = false;
        return;
      }

      this.addLiscenseModel.start_date_format = this.licenseStartDate;
      if (this.licenseEndDateFormat) {
        this.addLiscenseModel.end_date_format = this.licenseEndDate;
      }

      if (this.licenseFiles.length > 0) {
        this.addLiscenseModel.file_id = this.licenseFiles[0].id;
      }

      this.service.addLicense(this.addLiscenseModel).subscribe(
        data => {
          this.toast.success('Успешно добавлено!');
          this.loadLicenses();
          this.error = '';
          this.onLicenseClose();
          this.licenseSubmitted = false;

          this.applySavedLicense(+data);
        },
        error => {
          this.error = ErrorHelper.getMessage(error);
          this.toast.error('Успешно добавлено!');
          this.licenseSubmitted = false;
        }
      );
    }
  }

  applySavedLicense(licenseId: number) {
    this.model.license_id = licenseId;
  }

  onLicenseAdd(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      keyboard: false,
      animated: true,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog modal-xl'
    });
    this.addLiscenseModel = new AddLicense();
    this.addLiscenseModel.type_id = 1;
  }

  onFilesShow() {
    if (!this.disableInputsRePublish) {
      this.fileManagerComponent.cancelSelect();
      this.fileManagerModal.show();
    }
  }

  hideFileSelect() {
    if (this.isLicenseFile) {
      this.isLicenseFile = false;
      this.licenseFiles = this.fileManagerComponent.getSelectedFiles();
      this.fileManagerModal.hide();
    } else {
      //this.model.js_files = this.fileManagerComponent.getSelectedFilesWithType(1);
      this.selectedFiles = this.fileManagerComponent.getSelectedFiles();
      if (this.selectedFiles.length > 0) {
        this.selectedFiles.forEach(file => {
          file.file_size = +(file.file_size / (1024 * 1024)).toFixed(2);
        });
      }
      this.fileManagerModal.hide();
      if (this.selectedFiles.length == 1 && this.selectedFiles[0].ext_type_id === this.fileType.image) {
        this.mainFileId = this.selectedFiles[0].id;
      }
    }
  }

  loadCountries() {
    this.loadingCountries = 'loading';
    this.service.libGetCountries().subscribe((data: IdNameModel[]) => {
      this.loadingCountries = 'loaded';
      this.countries = data;
    });
  }

  loadMeasures() {
    this.service.libGetMeasures().subscribe((data: IdNameModel[]) => {
      this.measures = data;
    });
  }

  loadPeriods() {
    this.service.getPeriods().subscribe((data: IdNameModel[]) => {
      this.periods = data;
    });
  }

  onIssueYear(value: Date) {
    if (value == null) {
      return;
    }
    this.issueYearValue = this.datePipe.transform(value, 'yyyy-MM-dd');
  }

  loadCategories() {
    this.loadingCategory = true;
    this.service.getCategory(null).subscribe(
      res => {
        this.categories = res;
        this.loadingCategory = false;
      },
      error1 => {
        this.loadingCategory = false;
      }
    );
  }

  onCategory(item: IdNameModel) {
    this.searchedProducts = [];
    // this.searchNgSelect.clearModel()
    this.subSelectedProduct = [];
    this.subUnitProperty = undefined;
    this.model.product_code = null;
    this.loadProducts(item.id);
  }

  resetSearchProduct() {}

  loadSearchProducts() {}

  loadProducts(categoryId: number, isFirstEdit: boolean = false) {
    this.loadingProducts = 'loading';
    this.service.getProductsWithProps(categoryId, '').subscribe(data => {
      this.loadingProducts = 'loaded';
      this.products = data;
      if (isFirstEdit) {
        this.model.product_code = this.offerEditModel.product_code;
        let productItem = this.products.find(s => s.product_code == this.model.product_code);
        this.onProductChange(productItem, isFirstEdit);
      }
    });
  }

  onProductChange(product: ProductWithPropsList, isFirstEdit: boolean = false) {
    this.isService = false;
    this.selectedProduct = null;
    this.selectedProduct = product;
    this.loadProductProps(this.selectedProduct.product_code);
    this.loadProductMarks(product.product_code, isFirstEdit);
    this.deselectMarks();
    this.deselectProducers();
    if (isFirstEdit) {
    }
    if (product.type_id === 2 || product.type_id === 3) {
      this.product_type_id = +product.type_id;
      this.isService = true;
      this.model.issue_date = null;
      this.model.shelf_life = null;
      this.model.shelf_life_period_id = null;
    }
  }

  deselectMarks() {
    this.model.product_mark = null;
    this.selectedMark = null;
    this.model.product_mark_id = null;
  }

  deselectProducers() {
    this.model.product_manafacturer = null;
    this.selectedManafacturer = null;
    this.model.product_manafacturer_id = null;
  }

  loadProductMarks(product_code: string, isFirstEdit: boolean = false) {
    this.service.getMarks(product_code).subscribe(data => {
      this.productMarks = data;
      this.filterMarkItems = data;

      if (isFirstEdit) {
        this.model.product_mark_id = this.offerEditModel.mark_id;
        this.model.product_mark = this.filterMarkItems.find(s => s.id == this.offerEditModel.mark_id)
          ? this.filterMarkItems.find(s => s.id == this.offerEditModel.mark_id).name
          : null;
        this.productMarkName = this.filterMarkItems.find(s => s.id == this.offerEditModel.mark_id)
          ? this.filterMarkItems.find(s => s.id == this.offerEditModel.mark_id).name
          : null;
      }
      if (this.product_type_id === 2 || this.product_type_id === 3) {
        this.model.product_mark = null;
      }
    });
  }

  formValidation(f: NgForm) {
    setTimeout(() => {
      this.setValidation(f.form.controls['category_id']);
      this.setValidation(f.form.controls['product_code']);
      this.setValidation(f.form.controls['amount']);
      this.setValidation(f.form.controls['price']);
      if (!this.isService) {
        if (this.mark_type === 1) {
          this.setValidation(f.form.controls['product_mark']);
        }
        if (this.mark_type === 2) {
          this.setValidation(f.form.controls['user_mark']);
        }
        // this.setValidation(f.form.controls['product_manafacturer']);
        this.setValidation(f.form.controls['issue_year']);
        this.setValidation(f.form.controls['shelf_life']);
        this.setValidation(f.form.controls['shelf_life_period_id']);
        this.setValidation(f.form.controls['producer_country_id']);
      }
      this.setValidation(f.form.controls['offer_type']);
      this.setValidation(f.form.controls['guarantee_period']);
      this.setValidation(f.form.controls['guarantee_period_id']);
      this.setValidation(f.form.controls['delivery_term']);
      this.setValidation(f.form.controls['delivery_term_period_id']);
      this.setValidation(f.form.controls['min_delivery_amount']);
      this.setValidation(f.form.controls['max_delivery_amount']);
      this.setValidation(f.form.controls['is_licensed']);
      this.setValidation(f.form.controls['conditions']);
      this.setValidation(f.form.controls['record_id']);
      if (this.model.is_licensed) {
        this.setValidation(f.form.controls['license_id']);
      }
    }, 200);
  }

  submitForm(form: NgForm) {
    this.offerSubmitted = true;
    if (!form.valid) {
      this.formValidation(form);
      this.toast.error('Заполнены не все обязательные поля!');
      this.offerSubmitted = false;
      return;
    }
    if (form.valid) {
      if (this.model.offer_type === 1) {
        this.model.display_on_shop = 1;
        this.model.display_on_national = 0;
      } else if (this.model.offer_type === 2) {
        this.model.display_on_shop = 0;
        this.model.display_on_national = 1;
      }
      let foundItem = this.selectedProduct.js_properties.find(
        s => s.is_required == 1 && !s.user_value && s.user_value != 0
      );
      if (foundItem) {
        this.toast.error('Заполните обязательные детали товара!');
        this.offerSubmitted = false;
        return;
      }
      this.model.js_properties = [];
      this.selectedProduct.js_properties.forEach(item => {
        let property = <OfferAddEditProperties>{ property_num: item.pnum, property_value: item.user_value };
        this.model.js_properties.push(property);
      });
      this.model.issue_date = this.issueYearValue;
      this.model.issue_year = null;
      this.model.js_offer_delivery_district = this.jsDeliviriesComponent.getSelectedDeliviries();
      if (!(this.model.js_offer_delivery_district.length > 0)) {
        this.toast.error('Укажите регионы/районы доставки!');
        this.offerSubmitted = false;
        return;
      }
      if (!this.selectedFiles || !(this.selectedFiles.length > 0)) {
        this.toast.error('Файл не выбран!');
        this.offerSubmitted = false;
        return;
      } else {
        let fileItems: any = [];
        this.selectedFiles.forEach(item => {
          let fileItem = <SendFileModel>{
            file_id: item.id,
            file_custom_name: item.custom_name,
            type_id: item.ext_type_id
          };
          fileItems.push(fileItem);
        });
        this.model.js_files = fileItems;
      }

      if (!(this.mainFileId > 0)) {
        this.toast.error('Выберите основной файл!');
        this.offerSubmitted = false;
        return;
      }

      if (this.editModelId && this.editModelId > 0) {
        this.model.old_id = this.editModelId;
      } else {
        this.model.old_id = null;
      }

      if (this.mark_type === 1) {
        this.model.product_mark_id = null;
      }
      if (this.mark_type === 2) {
        this.model.product_mark = null;
      }

      this.model.main_image_id = this.mainFileId;

      if (this.editType === 'republish-offer') {
        this.model.offer_id = this.editModelId;
        if (environment.requiredEsi) {
          this.model.signature = '';
          this.model.signed_data = '';
          this.esi.signWithEsi(JSON.stringify(this.model), (data: any, dataSigned: any) => {
            if (dataSigned) {
              this.model.signed_data = JSON.stringify(this.model);
              this.model.signature = dataSigned;
              this.setRePublish();
            } else {
              if (data && data.code) {
                this.toast.error(data.message);
                this.offerSubmitted = false;
                return;
              }
            }
          });
        } else {
          this.setRePublish();
        }
      } else {
        if (environment.requiredEsi) {
          this.model.signature = '';
          this.model.signed_data = '';
          this.esi.signWithEsi(JSON.stringify(this.model), (data: any, dataSigned: any) => {
            if (dataSigned) {
              this.model.signed_data = JSON.stringify(this.model);
              this.model.signature = dataSigned;
              this.addOffer();
            } else {
              if (data && data.code) {
                this.toast.error(data.message);
                this.offerSubmitted = false;
                return;
              }
            }
          });
        } else {
          this.addOffer();
        }
      }
    }
  }

  addOffer() {
    let url = '';
    url = '/Provider/AddOffer';
    this.service.addOffer(url, this.model).subscribe(
      (data: any) => {
        this.offerSubmitted = false;
        this.toast.success('Товар ' + data + ' успешно добавлен!');
        this.router.navigate(['/cabinet/provider/offer-list/1']);
      },
      (error: any) => {
        this.offerSubmitted = false;
        this.toast.error(ErrorHelper.getMessage(error));
      }
    );
  }

  setRePublish() {
    let url = '';
    url = '/Provider/SetRePublished';
    this.service.setRePublish(url, this.model).subscribe(
      data => {
        this.offerSubmitted = false;
        this.toast.success('Предложение ' + data + ' успешно добавлено!');
        this.router.navigate(['/cabinet/provider/offer-list/1']);
      },
      error => {
        this.offerSubmitted = false;
        // this.toast.error(ErrorHelper.getMessage(error));
      }
    );
  }

  loadProductProps(product_code: string) {
    this.subSelectedProduct = [];
    this.service.libGetProductProps(product_code).subscribe(data => {
      this.selectedProduct.js_properties = data;
      this.subUnitProperty = null;
      this.subSelectedProduct = this.selectedProduct.js_properties.filter(s => s.pnum !== 0);
      this.subUnitProperty = this.selectedProduct.js_properties.filter(s => s.pnum === 0)[0];
      this.setProps();
    });
  }

  onValueChange(searchValue: any) {}

  setProps() {
    if (this.model.js_properties && this.model.js_properties.length > 0) {
      if (this.subUnitProperty) {
        let unit = this.model.js_properties.filter(s => s.property_num === 0)[0];
        this.subUnitProperty.user_value = unit.property_value
          ? +unit.property_value
          : unit.property_value === 0
            ? 0
            : null;
      }
      if (this.subSelectedProduct && this.subSelectedProduct.length > 0) {
        for (let i = 0; i < this.model.js_properties.length; i++) {
          let js_prop = this.model.js_properties[i];
          for (let j = 0; j < this.subSelectedProduct.length; j++) {
            let sub_prop = this.subSelectedProduct[j];
            if (js_prop.property_num === sub_prop.pnum) {
              sub_prop.user_value = js_prop.property_value
                ? +js_prop.property_value
                : js_prop.property_value === 0
                  ? 0
                  : null;
            }
          }
        }
      }
    }
  }

  setMarkType(number: number) {
    this.mark_type = number;
  }
}
