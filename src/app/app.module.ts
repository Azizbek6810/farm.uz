import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/public/home-page/home-page.component';
import { HeaderComponent } from './pages/public/elements/header/header.component';
import { FooterComponent } from './pages/public/elements/footer/footer.component';
import { SwiperModule } from 'swiper/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GlobalInterceptor } from './core/interceptors/global.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './shared/shared.module';
import { BreadcrumbComponent } from './pages/public/elements/breadcrumb/breadcrumb.component';
import { DealsComponent } from './pages/public/deals/deals.component';
import { ProductListComponent } from './pages/public/product-list/product-list.component';
import { UsefulToKnowComponent } from './pages/public/useful-to-know/useful-to-know.component';
import { ProductDetailsComponent } from './pages/public/product-list/product-details/product-details.component';
import { LotDetailsComponent } from './pages/public/product-list/lot-details/lot-details.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { RedirectComponent } from './pages/sign/redirect/redirect.component';
import { LoginRoleComponent } from './pages/sign/login-role/login-role.component';
import { SubUserRoleComponent } from './pages/sign/sub-user-role/sub-user-role.component';
import { CabinetComponent } from './pages/cabinet/cabinet.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    DealsComponent,
    ProductListComponent,
    UsefulToKnowComponent,
    ProductDetailsComponent,
    LotDetailsComponent,
    RedirectComponent,
    LoginRoleComponent,
    SubUserRoleComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    HttpClientModule,
    SharedModule,
    TooltipModule,
    ProgressbarModule,
    NgSelectModule,
    FormsModule,
    ModalModule.forRoot(),
    TranslateModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      autoDismiss: true,
      disableTimeOut: 'extendedTimeOut',
      closeButton: true,
      positionClass: 'toast-top-right',
      progressBar: true,
      iconClasses: {
        error: 'toast-error',
        success: 'toast-success'
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
