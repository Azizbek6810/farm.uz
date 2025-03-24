import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StringSlicePipe } from './pipes/string-slice.pipe';
import { NumberFormatPipe } from './pipes/number-format.pipe';



@NgModule({
  declarations: [StringSlicePipe, NumberFormatPipe],
  imports: [
    CommonModule
  ],
  exports:[StringSlicePipe, NumberFormatPipe]
})
export class SharedModule { }
