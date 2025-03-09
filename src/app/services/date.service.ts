import { Injectable } from '@angular/core';
import { isValid, parse } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  parseDate(dateStr: string, format: string): Date | null {
    if (!dateStr) return null;
    const parsedDate = parse(dateStr, format, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  }
}
