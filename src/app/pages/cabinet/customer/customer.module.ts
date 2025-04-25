import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { CabinetModule } from '../cabinet.module';
import { MyLotsComponent } from './my-lots/my-lots.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MyDealsComponent } from './my-deals/my-deals.component';

@NgModule({
  declarations: [CustomerComponent, CustomerInfoComponent, MyLotsComponent, MyDealsComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    CabinetModule,
    RouterModule,
    SharedModule,
    TranslateModule,
    PaginationModule,
    FormsModule,
    NgSelectModule,
    ModalModule
  ]
})
export class CustomerModule {}
