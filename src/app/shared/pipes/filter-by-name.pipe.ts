import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByName'
})
export class FilterByNamePipe implements PipeTransform {
  transform(items: any[], filter: Object): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item => item.short_name.indexOf(filter) !== -1 || item.name_code.indexOf(filter) !== -1);
  }
}
