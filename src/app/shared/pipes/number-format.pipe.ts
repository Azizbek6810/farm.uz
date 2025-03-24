import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): string {
    const pipe = new DecimalPipe('en-US');
    return pipe.transform(value, '1.2-2');
  }
}
