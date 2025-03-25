import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  OfferAddEdit,
  OfferEditModel,
  ProductWithPropsList,
  ProductWithPropsListProperties
} from '../../../pages/cabinet/provider/provider.models';
import { CommonService } from '../../../core/services/common.service';
import { ProviderService } from '../../../pages/cabinet/provider/provider.service';
import { debounceTime, distinctUntilChanged, of, Subject, Subscription, takeUntil } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {
  @Input() inputWidth: string = '300px';
  @Input('filterModel') filterModel: any;
  @Output() resetFilter = new EventEmitter<number>();
  @Output() searchEvent = new EventEmitter<number>();
  @ViewChild('searchProduct') searchProduct: NgSelectComponent;

  searchedProducts: ProductWithPropsList[];
  isService: boolean;
  model: OfferAddEdit = new OfferAddEdit();
  subSelectedProduct: ProductWithPropsListProperties[];
  subUnitProperty: ProductWithPropsListProperties;
  loadingProducts = '';
  products: ProductWithPropsList[];
  offerEditModel: OfferEditModel;
  selectedProduct: ProductWithPropsList;
  notesModelChanged: Subject<any> = new Subject<any>();
  notesModelChangeSubscription: Subscription;
  loadingSearchedProducts = '';
  destroy$: Subject<any>;

  constructor(
    private service: CommonService,
    private providerService: ProviderService
  ) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<any>();

    this.notesModelChanged
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        catchError(() => {
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(newText => {
        if (newText && newText.term && newText.term.length > 2) {
          this.searchProducts(newText.term);
        }
      });
  }

  resetInput() {
    this.searchProduct.clearModel();
  }

  searchProducts(text: any) {
    this.loadingSearchedProducts = 'loading';
    this.providerService
      .getProductsWithProps('', text)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.loadingSearchedProducts = 'loaded';
          this.searchedProducts = value;
        }
      });
  }

  selectSearchProduct(item: any) {
    this.isService = false;
    if (item) {
      this.filterModel.product_code = item.product_code;
      this.filterModel.category_id = item.category_id;
    }
  }

  loadProducts(categoryId: number, isFirstEdit: boolean = false) {
    this.loadingProducts = 'loading';
    this.providerService
      .getProductsWithProps(categoryId, '')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.loadingProducts = 'loaded';
          if (isFirstEdit) {
            this.model.product_code = this.offerEditModel.product_code;
            let productItem = this.products.find(p => p.product_code == this.model.product_code);
            this.onProductChange(productItem, isFirstEdit);
          }
        }
      });
  }
  onProductChange(productItem: ProductWithPropsList, isFirstEdit: boolean = false) {
    this.isService = false;
    this.selectedProduct = null;

    this.selectedProduct = productItem;
    this.loadProductProps(this.selectedProduct.product_code);

    if (productItem.type_id === 2 || productItem.type_id === 3) {
      this.isService = true;
      this.model.issue_date = null;
      this.model.shelf_life = null;
      this.model.shelf_life_period_id = null;
    }
  }

  loadProductProps(product_code: string) {
    this.subSelectedProduct = [];
    this.providerService
      .libGetProductProps(product_code)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: value => {
          this.selectedProduct.js_properties = value;
          this.subUnitProperty = null;
          this.subSelectedProduct = this.selectedProduct.js_properties.filter(j => j.pnum !== 0);
          this.subUnitProperty = this.selectedProduct.js_properties.filter(a => a.pnum)[0];
          this.setProps();
        }
      });
  }

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

  reset() {
    this.resetFilter.emit(1);
  }

  search() {
    this.searchEvent.emit(1);
  }
}
