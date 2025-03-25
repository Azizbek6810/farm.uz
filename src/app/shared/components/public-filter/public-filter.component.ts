import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IdNameModel } from '../../../core/models/common.models';
import { CommonService } from '../../../core/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from 'src/app/pages/cabinet/provider/provider.service';

@Component({
  selector: 'app-public-filter',
  templateUrl: './public-filter.component.html',
  styleUrls: ['./public-filter.component.css']
})
export class PublicFilterComponent implements OnInit {
  filters: any = [];
  categories: any[] = [];
  loadingProducts: boolean = false;
  showFilter: boolean = false;
  products: any[] = [];
  loadingSearchProducts: boolean = false;
  regions: IdNameModel[];
  districts: IdNameModel[];

  @Input('items') items: any;
  @Input('filterModel') filterModel: any;
  @Output() searchByFilter = new EventEmitter<number>();
  @Output() resetFilter = new EventEmitter<number>();
  @Output() priceSorted = new EventEmitter<string>();
  @Output() setCurrentFilterValues = new EventEmitter<any>();

  constructor(
    private commonService: CommonService,
    private providerService: ProviderService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategories();
    this.loadRegions();
  }

  getCategories() {
    this.commonService.GetCategoriesForFilter().subscribe(data => {
      this.categories = data;
      this.setFilterValue('category');
    });
  }

  getProducts(categoryId: number, productCode?: string) {
    this.loadingProducts = true;
    this.loadingSearchProducts = true;
    setTimeout(() => {
      this.commonService.getProducts(this.filterModel.category_id, '').subscribe(
        data => {
          this.products = data;
          this.loadingProducts = false;
          this.loadingSearchProducts = false;
          if (productCode && productCode.length > 0) {
            this.filterModel.product_code = productCode;
          }
          this.setFilterValue('product');
        },
        error => {
          this.loadingProducts = false;
          this.loadingSearchProducts = false;
        }
      );
    }, 200);
  }

  setFilterValue(type: string) {
    if (type === 'category') {
      if (this.filterModel?.category_id) {
        this.categories.forEach((item: any) => {
          if (item.id === this.filterModel?.category_id) {
            this.setFilterValues(item.name, 'category_name');
          }
        });
      }
    } else if (type === 'product') {
      if (this.filterModel?.product_code) {
        this.products.forEach((item: any) => {
          if (item.product_code === this.filterModel?.product_code) {
            this.setFilterValues(item.name, 'product_name');
          }
        });
      }
    }
  }

  search() {
    this.searchByFilter.emit(1);
  }

  reset() {
    this.resetFilter.emit(1);
  }

  priceSort(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.priceSorted.emit(target.value);
  }

  loadRegions() {
    this.providerService.GetRegions().subscribe({
      next: value => {
        this.regions = value;
      },
      error: err => {
        this.toast.error(err);
      }
    });
  }

  loadDistricts(regionId: number) {
    this.providerService.GetDistricts(regionId).subscribe({
      next: value => {
        this.districts = value;
      },
      error: err => {
        this.toast.error(err);
      }
    });
  }

  onRegion(region: IdNameModel) {
    this.filterModel.region_name = region.name;
    this.filterModel.district_id = undefined;
    this.filterModel.district_name = undefined;
    this.loadDistricts(region.id);
  }

  onDistrict(district: IdNameModel) {
    this.filterModel.district_name = district.name;
  }

  setFilterValues(value: any, type: string) {
    const val = {
      value: value,
      type: type
    };

    this.setCurrentFilterValues.emit(val);
  }
}
