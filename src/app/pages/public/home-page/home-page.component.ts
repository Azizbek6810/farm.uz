import { Component, OnInit } from '@angular/core';
import {
  FrontOfferListItemModel,
  ICategoryListModel,
  IdNameModel, IProductItemModel,
  ProductsFilter
} from "../../../core/models/common.models";
import { CommonService } from 'src/app/core/services/common.service';
import { CoreStates } from 'src/app/core/models/enum.models';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import SwiperCore , {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Controller,
  SwiperOptions,
} from 'swiper';

declare var Highcharts: any;
declare var $: any;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };
  onSlideChange() {
    console.log('slide change');
  }

}
