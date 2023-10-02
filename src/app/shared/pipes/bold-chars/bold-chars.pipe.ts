import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boldChars',
})
export class BoldCharsPipe implements PipeTransform {
  transform(value: string, chars?: string) {
    if (!chars) {
      return value;
    }

    const reqExp = new RegExp(`(${chars})`, 'ig');
    return value.replace(reqExp, (match) => `<b>${match}</b>`);
  }
}
