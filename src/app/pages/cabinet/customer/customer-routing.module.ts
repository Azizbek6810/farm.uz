import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { MyLotsComponent } from './my-lots/my-lots.component';
import { MyDealsComponent } from './my-deals/my-deals.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: '',
        redirectTo: '/cabinet/customer/info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: CustomerInfoComponent
      },
      {
        path: 'my-lots',
        component: MyLotsComponent
      },
      {
        path: 'my-deals/:status',
        component: MyDealsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
