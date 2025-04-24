import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateformat'
})
export class DateTransformPipe implements PipeTransform {
  transform(value: any, format: string = 'dd.mm.yyyy'): unknown {
    if (!value) {
      return '';
    }if (!format) {
      format = 'shortDate'
    }
    return formatDate(value, format, 'en')
  }
}
