import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringSlicePipe } from './pipes/string-slice.pipe';
import { NumberFormatPipe } from './pipes/number-format.pipe';
import { PublicFilterComponent } from './components/public-filter/public-filter.component';
import { ProductNotFoundComponent } from './components/product-not-found/product-not-found.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { JsDeliveriesComponent } from './components/js-deliveries/js-deliveries.component';
import { DateTransformPipe } from './pipes/date-transform.pipe';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CopyToClipboardComponent } from './components/copy-to-clipboard/copy-to-clipboard.component';
import {TooltipModule} from "ngx-bootstrap/tooltip";
import { FilterByNamePipe } from './pipes/filter-by-name.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { CabinetFilterComponent } from './components/cabinet-filter/cabinet-filter.component';
import { TradeFileManagerComponent } from './components/trade-file-manager/trade-file-manager.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UzbMapComponent } from './components/uzb-map/uzb-map.component';

@NgModule({
  declarations: [
    StringSlicePipe,
    NumberFormatPipe,
    PublicFilterComponent,
    ProductNotFoundComponent,
    ProductSearchComponent,
    SkeletonLoaderComponent,
    JsDeliveriesComponent,
    DateTransformPipe,
    CopyToClipboardComponent,
    FilterByNamePipe,
    LoaderComponent,
    CabinetFilterComponent,
    TradeFileManagerComponent,
    UzbMapComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    TranslateModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    NgbModule,
    NgbTooltipModule,
    TooltipModule,
    ModalModule
  ],
  exports: [
    StringSlicePipe,
    NumberFormatPipe,
    PublicFilterComponent,
    ProductNotFoundComponent,
    ProductSearchComponent,
    SkeletonLoaderComponent,
    DateTransformPipe,
    JsDeliveriesComponent,
    CopyToClipboardComponent,
    FilterByNamePipe,
    LoaderComponent,
    CabinetFilterComponent,
    TradeFileManagerComponent,
    UzbMapComponent
  ]
})
export class SharedModule {}
