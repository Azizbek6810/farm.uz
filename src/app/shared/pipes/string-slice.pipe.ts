import { Pipe, PipeTransform } from '@angular/core';
import { SlicePipe } from '@angular/common';

@Pipe({
  name: 'slice2'
})
export class StringSlicePipe implements PipeTransform {
  transform(str: string, size: number = -1): unknown {
    if (!str) {
      return '-';
    }
    if (size == -1) {
      return str;
    }
    let slice = new SlicePipe();

    return str.length > size ? slice.transform(str, 0, size) + '...' : str;
  }
}
