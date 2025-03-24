import { Component, OnInit } from '@angular/core';
import { FilterResult, FrontOfferListItemModel, ProductsFilter } from '../../../core/models/common.models';
import { CoreStates, PublicFilterSection } from '../../../core/models/enum.models';
import { CommonService } from '../../../core/services/common.service';
import { MinioService } from '../../../core/services/minio.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {}

  redirectToProductList(){}

  onViewProductDetails(id: number){}
}
