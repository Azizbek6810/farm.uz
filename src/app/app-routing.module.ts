import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/public/home-page/home-page.component';
import { DealsComponent } from './pages/public/deals/deals.component';
import { ProductListComponent } from './pages/public/product-list/product-list.component';
import { UsefulToKnowComponent } from './pages/public/useful-to-know/useful-to-know.component';
import { ProductDetailsComponent } from './pages/public/product-list/product-details/product-details.component';
import { LotDetailsComponent } from './pages/public/product-list/lot-details/lot-details.component';
import { RedirectComponent } from './pages/sign/redirect/redirect.component';
import { LoginRoleComponent } from './pages/sign/login-role/login-role.component';
import { SubUserRoleComponent } from './pages/sign/sub-user-role/sub-user-role.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  {path: 'deals', component: DealsComponent},
  {path: 'deals/:type', component: DealsComponent},
  {path: 'useful-know', component: UsefulToKnowComponent},
  {path: 'product-list', component: ProductListComponent},
  {path: 'product-list/:category_id', component: ProductListComponent},
  {path: 'product-list/:category_id/:product_code', component: ProductListComponent},
  {path: 'product-details/:id', component: ProductDetailsComponent},
  {path: 'lot-details/:id', component: LotDetailsComponent},
  {path: 'redirect', component: RedirectComponent},
  {path: 'login-role', component: LoginRoleComponent},
  {path: 'sub-user-role', component: SubUserRoleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
