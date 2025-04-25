import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderComponent } from './provider.component';
import { ProviderInfoComponent } from './provider-info/provider-info.component';
import { AddEditOfferComponent } from './add-edit-offer/add-edit-offer.component';

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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProviderRoutingModule {}
