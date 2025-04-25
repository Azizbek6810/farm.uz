import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProviderRoutingModule } from './provider-routing.module';
import { ProviderComponent } from './provider.component';
import { ProviderInfoComponent } from './provider-info/provider-info.component';
import { CabinetModule } from '../cabinet.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddEditOfferComponent } from './add-edit-offer/add-edit-offer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MyDealsComponent } from './my-deals/my-deals.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { MyLotsComponent } from './my-lots/my-lots.component';
import { RivalLotsComponent } from './rival-lots/rival-lots.component';


@NgModule({
  declarations: [
    ProviderComponent,
    ProviderInfoComponent,
    AddEditOfferComponent,
    MyDealsComponent,
    OfferListComponent,
    MyLotsComponent,
    RivalLotsComponent
  ],
  imports: [
    CommonModule,
    ProviderRoutingModule,
    CabinetModule,
    TranslateModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule,
    ModalModule,
    PaginationModule,
    TooltipModule
  ]
})
export class ProviderModule { }
