import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private csvPath = 'assets/countries.csv';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get(this.csvPath, { responseType: 'text' }).pipe(
      map(data => this.parseCSV(data))
    );
  }

  private parseCSV(data: string): Country[] {
    const lines = data.split('\n');
    const countries: Country[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const [code, name] = line.split(';').map(field => field.trim());
        if (code && name) {
          countries.push({ code, name });
        }
      }
    }

    return countries.sort((a, b) => a.name.localeCompare(b.name));
  }
}
