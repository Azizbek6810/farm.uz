import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from './provider.component';
import { ProviderInfoComponent } from './provider-info/provider-info.component';
import { AddEditOfferComponent } from './add-edit-offer/add-edit-offer.component';
import { MyDealsComponent } from './my-deals/my-deals.component';
import { OfferListComponent } from './offer-list/offer-list.component';
import { MyLotsComponent } from './my-lots/my-lots.component';
import { RivalLotsComponent } from './rival-lots/rival-lots.component';

const routes: Routes = [
  {
    path: '',
    component: ProviderComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/cabinet/provider/info'
      },
      {
        path: 'info',
        component: ProviderInfoComponent
      },
      {
        path: 'add-offer',
        component: AddEditOfferComponent
      },
      {
        path: 'edit-offer/:id',
        component: AddEditOfferComponent
      },
      {
        path: 'my-deals/:status',
        component: MyDealsComponent
      },
      {
        path: 'offer-list/:statusId',
        component: OfferListComponent
      },
      {
        path: 'my-lots/:statusId',
        component: MyLotsComponent
      },
      {
        path: 'rival-lots',
        component: RivalLotsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule {}
