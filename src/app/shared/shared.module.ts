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

@NgModule({
  declarations: [
    StringSlicePipe,
    NumberFormatPipe,
    PublicFilterComponent,
    ProductNotFoundComponent,
    ProductSearchComponent
  ],
  imports: [CommonModule, NgSelectModule, TranslateModule, FormsModule],
  exports: [StringSlicePipe, NumberFormatPipe, PublicFilterComponent, ProductNotFoundComponent, ProductSearchComponent]
})
export class SharedModule {}
