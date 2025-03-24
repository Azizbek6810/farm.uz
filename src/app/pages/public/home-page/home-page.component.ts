import { Component, OnInit } from '@angular/core';
import {
  FrontOfferListItemModel,
  ICategoryListModel,
  IdNameModel,
  IProductItemModel,
  ProductsFilter
} from '../../../core/models/common.models';
import { CommonService } from 'src/app/core/services/common.service';
import { CoreStates } from 'src/app/core/models/enum.models';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MinioService } from 'src/app/core/services/minio.service';
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  SwiperOptions
} from 'swiper';

declare var Highcharts: any;
declare var $: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  filter: ProductsFilter = new ProductsFilter();
  limit: number = 12;
  productList: FrontOfferListItemModel[] = [];
  loading: boolean = false;
  productNotFound: boolean = false;
  total: number;
  listState = CoreStates.none;
  selectedRegion: IdNameModel = new IdNameModel();
  categoryList: ICategoryListModel[] = [];
  isMapLoading: boolean = false;
  currentRegion: number = 2105;

  constructor(
    private service: CommonService,
    private minio: MinioService,
    private sanitizerMinio: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.initSmallChart();
    this.loadCategories();
    this.selectedRegion.id = 2105;
    this.selectedRegion.name = 'TashkentCity';
  }

  loadCategories() {
    this.service.getAllCategories().subscribe({
      next: data => {
        this.categoryList = data;
        if (this.categoryList.length > 0) {
          this.categoryList.forEach(item => {
            item.products.forEach(product => {
              this.getCategoryImage(product).then((res: any) => {
                product.thumb_image = res.thumb_image;
                product.image_loaded = res.image_loaded;
              });
            });
          });
        }
      }
    });
  }

  redirectToProductList(categoryId?: number, productCode?: string): void {
    let url: string = '';
    if (categoryId && productCode) {
      url = `/product-list/${categoryId}/${productCode}`;
      window.open(url, '_blank');
    } else if (categoryId && !productCode) {
      url = `/product-list/${categoryId}`;
      window.open(url, '_blank');
    } else if (!categoryId && !productCode) {
      url = `/product-list`;
      window.open(url, '_blank');
    }
  }

  getCategoryImage(file: IProductItemModel): Promise<any> {
    return new Promise<any>(data => {
      let san = this.sanitizerMinio;
      let size = 0;
      let fileMinio: BlobPart[] = [];
      this.minio.isProdFileExist(file.picture_path).then(isExist => {
        if (isExist === 1) {
          this.minio.getMinioObjectForProduct(file.picture_path).then(dataStream => {
            dataStream.on('data', function (chunk: any) {
              size = size + chunk.length;
              fileMinio.push(chunk);
            });
            dataStream.on('end', function () {
              let blob = new Blob(fileMinio, { type: dataStream.headers['content-type'] });
              const unsafeImg = URL.createObjectURL(blob);
              file.thumb_image = san.bypassSecurityTrustUrl(unsafeImg);
              file.image_loaded = true;
              data(file);
            });
            dataStream.on('error', function (error: any) {
              data(file);
            });
          });
        } else {
          data(null);
        }
      });
    });
  }

  downloadFile(path: any) {
    this.minio.isFileExist(null, null, path).then(data => {
      if (data === 1) {
        this.minio.saveMiniObject(null, 'ASD123', path);
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.filter.from = 0;
    this.filter.to = 10;
    const m = {
      from: 1,
      to: 12
    };
    this.service.getOffersList(m).subscribe(data => {
      this.productListLoaded(data);
    });
  }

  onViewProductDetails(productId: number) {
    const link: string = `/product-details/${productId}`;
    window.open(link, '_blank');
  }

  productListLoaded(data: any) {
    if (data.length > 0) {
      this.loadProductImages(data).then((res: any) => {
        if (!this.productList || this.productList.length == 0) {
          this.productNotFound = true;
          this.total = 0;
        } else {
          this.productNotFound = false;
          this.loading = false;
          this.total = data[0].total_count;
        }
        this.listState = CoreStates.loaded;
      });
    } else {
      if (!this.productList || this.productList.length == 0) {
        this.productNotFound = true;
        this.total = 0;
      } else {
        this.productNotFound = false;
        if (data.length > 0) {
          this.total = data[0].total_count;
        }
      }
      this.listState = CoreStates.loaded;
    }
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
        this.getImage(items[i]).then((file: any) => {
          if (i === items.length - 1) {
            data(1);
          }
        });
      }
    });
  }

  singleRegion(e: any) {
    if (e) {
      this.selectedRegion = new IdNameModel();
      this.selectedRegion.id = e.id;
      this.selectedRegion.name = e.name;
      this.changeRegion();
    }
  }

  changeRegion(): void {
    this.isMapLoading = true;
    setTimeout(() => {
      this.isMapLoading = false;
    }, 500);
  }

  initSmallChart() {}

  // config: SwiperOptions = {
  //   slidesPerView: 3,
  //   spaceBetween: 50,
  //   navigation: true,
  //   pagination: { clickable: true },
  //   scrollbar: { draggable: true }
  // };
  // onSlideChange() {
  //   console.log('slide change');
  // }
}
