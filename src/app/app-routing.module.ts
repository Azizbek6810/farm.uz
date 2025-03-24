import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/public/home-page/home-page.component';
import { DealsComponent } from './pages/public/deals/deals.component';
import { ProductListComponent } from './pages/public/product-list/product-list.component';
import { UsefulToKnowComponent } from './pages/public/useful-to-know/useful-to-know.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  {path: 'deals', component: DealsComponent},
  {path: 'product-list', component: ProductListComponent},
  {path: 'useful-know', component: UsefulToKnowComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
