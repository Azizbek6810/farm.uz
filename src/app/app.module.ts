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

@NgModule({
  declarations: [AppComponent, HomePageComponent, HeaderComponent, FooterComponent, BreadcrumbComponent, DealsComponent, ProductListComponent, UsefulToKnowComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    HttpClientModule,
    SharedModule,
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
