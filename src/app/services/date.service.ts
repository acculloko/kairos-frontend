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

  convertToDate(dateString: string): Date {
    // Expected format: "dd/MM/yyyy HH:mm:ss"
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  formatDate(date: string, dateFormat: string): string {
    if (!date) return '';
    return format(new Date(date), dateFormat);
  }

  formatDateToString(date: Date | null): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDateTime(date: Date): string {
    return date
      ? `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString(
          'en-GB'
        )}`
      : '';
  }

  formatHoursToReadableString(totalHours: number): string {
    const hours = Math.floor(totalHours); // Get whole hours
    const minutes = Math.round((totalHours - hours) * 60); // Convert decimal part to minutes
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  }
}
