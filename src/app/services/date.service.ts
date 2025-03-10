import { Injectable } from '@angular/core';
import { format, isValid, parse } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  parseDate(dateStr: string, dateFormat: string): Date | null {
    if (!dateStr) return null;
    const parsedDate = parse(dateStr, dateFormat, new Date());
    return isValid(parsedDate) ? parsedDate : null;
  }

  formatDate(date: string, dateFormat: string): string {
    if (!date) return '';
    return format(new Date(date), dateFormat);
  }

  formatDateTime(date: Date): string {
    return date
      ? `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString(
          'en-GB'
        )}`
      : '';
  }
}
