# Person Form Application

Angular-based form application created as a technical assessment for evoila GmbH.


### Additional Enhancements
- **Field Tooltips** - Helpful hints on hover  
- **Loading Skeleton** - Modern loading animation  

## Key Modifications

### 1. Form Validation (`src/app/app.ts`)
- Implemented Reactive Forms with FormBuilder
- Created custom `pastDateValidator` for birth date validation
- All fields made required with appropriate validators
- PLZ validation: `Validators.pattern(/^\d{5}$/)`

### 2. CSV Integration (`src/app/services/country.service.ts`)
- CSV parsing with semicolon delimiter (not comma)
- BOM character removal for proper encoding
- Alphabetical sorting for better UX
- HTTP client for loading `assets/countries.csv`


### 3. UI/UX Enhancements (`src/app/app.html`, `src/app/app.css`)
- Tooltips for each field with help text
- Loading skeleton instead of spinner

### 4. Configuration (`angular.json`)
- Added `src/assets` to assets array for CSV file access
- Angular 20 requires explicit asset configuration

### 5. App Config (`src/app/app.config.ts`)
- Added `provideHttpClient()` for HTTP requests
- Uses functional providers (Angular 20 pattern)

##  Technologies

- Angular 20.3.9 (Standalone Components)
- TypeScript 5.8.3
- Reactive Forms
- RxJS for async operations
- jsPDF for PDF generation

## Installation
```bash
npm install
ng serve
```

Navigate to `http://localhost:4200`

---

## License

This project was created as a technical assessment for evoila GmbH.
