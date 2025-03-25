import { Component, OnInit, ViewChild } from '@angular/core';
import { FilterResult, FrontOfferListItemModel, ProductsFilter } from '../../../core/models/common.models';
import { CoreStates, PublicFilterSection } from '../../../core/models/enum.models';
import { CommonService } from '../../../core/services/common.service';
import { MinioService } from '../../../core/services/minio.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { PublicFilterComponent } from 'src/app/shared/components/public-filter/public-filter.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  @ViewChild(PublicFilterComponent) private publicFilterComponent: PublicFilterComponent;

  filterSections = [
    PublicFilterSection.category_product,
    PublicFilterSection.price_range,
    PublicFilterSection.region_district
  ];

  filter: ProductsFilter = new ProductsFilter();
  limit: number = 12;
  times: number = 1;
  productList: FrontOfferListItemModel[] = [];
  loading: boolean = false;
  productNotFound: boolean = false;
  priceSortType: string = '';
  total: number;
  listState = CoreStates.none;
  showMoreMode: boolean = false;
  subs: Subscription;
  filterResult: FilterResult = new FilterResult();

  constructor(
    private service: CommonService,
    private minio: MinioService,
    private sanitizerMinio: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subs = combineLatest([this.route.params, this.route.queryParams]).subscribe(([params]) => {
      if (params['category_id']) {
        this.filter.category_id = +params['category_id'];
      }
      if (params['product_code']) {
        this.filter.product_code = params['product_code'];
        this.loadProducts();
      } else if (params['category_id'] && !params['product_code']) {
        this.loadProducts();
      } else {
        this.reset();
      }
    });
    if (this.filter.category_id) {
      setTimeout(() => {
        this.publicFilterComponent.getProducts(this.filter.category_id);
      }, 5);
    }
  }

  getItemName(param: any) {
    if (param.type === 'category_name') {
      this.filterResult.category_name = param.value;
    } else if (param.type === 'product_name') {
      this.filterResult.product_name = param.value;
    }
  }

  filterPriceSort(sortType: string) {
    this.priceSortType = sortType;
    switch (sortType) {
      case 'Low': {
        this.productList = this.productList.sort((low, high) => low.price - high.price);
        break;
      }
      case 'High': {
        this.productList = this.productList.sort((low, high) => high.price - low.price);
        break;
      }
      default:
        this.productList = this.productList.sort((low, high) => low.price - high.price);
        break;
    }
    return this.productList;
  }

  reset(type?: string) {
    if (!type) {
      this.productList = [];
      this.filter = new ProductsFilter();
      this.loadProducts();
    } else {
      if (type === 'product_code') {
        this.productList = [];
        delete this.filter.product_code;
        this.loadProducts();
      } else if (type === 'category_id') {
        this.productList = [];
        delete this.filter.category_id;
        this.loadProducts();
      }
    }
  }

  loadProducts() {
    this.loading = true;
    this.listState = CoreStates.loading;
    this.filter.from = (this.times - 1) * this.limit + 1;
    this.filter.to = this.times * this.limit;
    this.service.getOffersList(this.filter).subscribe({
      next: value => {
        if (this.showMoreMode) {
          this.showMoreMode = false;
        } else {
          this.productList = [];
        }
        this.productListLoaded(value);
      }
    });
  }

  productListLoaded(data: any) {
    if (data.length > 0) {
      this.loadProductImages(data).then(res => {
        if (!this.productList || this.productList.length === 0) {
          this.productNotFound = true;
          this.total = 0;
        } else {
          this.productNotFound = false;
          this.total = data[0].total_count;
        }
        this.listState = CoreStates.loaded;
      });
    } else {
      if (!this.productList || this.productList.length === 0) {
        this.productNotFound = true;
        this.total = 0;
        this.loading = false;
        this.productList = [];
      } else {
        this.productNotFound = false;
        if (data.length > 0) {
          this.total = data[0].total_count;
        } else {
          this.productList = [];
          this.productNotFound = true;
          this.loading = false;
        }
      }
      this.listState = CoreStates.loaded;
    }
  }

  loadMore() {
    if (this.filter.to < this.total) {
      this.times++;
      this.showMoreMode = true;
      this.loadProducts();
    }
  }

  onViewProductDetails(productId: number) {
    const link: string = `/product-details/${productId}`;
    window.open(link, '_blank');
  }

  getImage(file: FrontOfferListItemModel): Promise<any> {
    return new Promise<any>(data => {
      let san = this.sanitizerMinio;
      let size = 0;
      let fileMinio: BlobPart[] = [];
      this.minio.isFileExist(file.file_path + '/thumbs', file.file_name).then(isExist => {
        if (isExist === 1) {
          this.minio.getMinioObject(file.file_path + '/thumbs', file.file_name).then(dataStream => {
            dataStream.on('data', function (chunk: any) {
              size += chunk.length;
              fileMinio.push(chunk);
            });
            dataStream.on('end', function () {
              let blob = new Blob(fileMinio, { type: dataStream.headers['content-type'] });
              const unsafeImg = URL.createObjectURL(blob);
              file.thumb_image = san.bypassSecurityTrustUrl(unsafeImg);
              file.image_loaded = true;
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
        this.productList.push(items[i]);
        this.getImage(items[i]).then(() => {
          if (i === items.length - 1) {
            data(1);
          }
        });
      }
      this.loading = false;
      this.filterPriceSort(this.priceSortType);
    });
  }
}
