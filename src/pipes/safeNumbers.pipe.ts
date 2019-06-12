import {Pipe, PipeTransform} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({
    name: 'safeNumber'
})
//Checks the number(which is a string from HTML input). If it's empty string or null, just return null.
//else, transform it using the decimalPipe (aka putting commas between the numbers).
export class SafeNumberPipe implements PipeTransform {
    constructor(private decimalPipe: DecimalPipe) {
    }
    
    transform(value: any, args?: any): any {
        //console.log(!isNaN(Number('')));
        //return !isNaN(Number(value)) ? this.decimalPipe.transform(value, args) : null;

        if(value === '' || value === null) {
            return null;
        } else if(!isNaN(Number(value))) {
            return this.decimalPipe.transform(value, args);
        }
    }
}