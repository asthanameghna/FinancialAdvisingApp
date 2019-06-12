import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'keys',
    pure: false
})

@Injectable()
/**
 * Method to allow iteration through javascript Object, by returning the keys as an array
 * creates a custom pipe (normal *ngFor directive does not allow such operation).
 * 
 * @export
 * @class KeysPipe
 * @implements {PipeTransform}
 */
export class ObjectKeysPipe implements PipeTransform {
    transform(object: any): string[] {
        if (object)
          return Object.keys(object);
        else
          return [];
    }
}