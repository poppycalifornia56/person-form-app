import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CountryService } from './services/country.service';
import { Country } from './models/country.model';
import { Person } from './models/person.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [CountryService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  personForm!: FormGroup;
  countries: Country[] = [];
  submitted = false;
  submittedData: Person | null = null;
  isLoading = true;
  loadError = false;
  showSuccessAnimation = false;
  today: string = new Date().toISOString().split('T')[0];

  tooltips: { [key: string]: boolean } = {};

  salutations = [
    { value: 'Herr', label: 'Herr' },
    { value: 'Frau', label: 'Frau' },
    { value: 'Divers', label: 'Divers' }
  ];

  fieldInfo: { [key: string]: string } = {
    anrede: 'Wählen Sie Ihre Anrede aus',
    vorname: 'Geben Sie Ihren Vornamen ein',
    nachname: 'Geben Sie Ihren Nachnamen ein',
    geburtsdatum: 'Wählen Sie Ihr Geburtsdatum aus dem Kalender',
    adresse: 'Vollständige Adresse mit Straße und Hausnummer',
    plz: 'Postleitzahl (genau 5 Ziffern)',
    ort: 'Name Ihrer Stadt oder Gemeinde',
    land: 'Wählen Sie Ihr Land aus der Liste'
  };

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
  }

  private initializeForm(): void {
    this.personForm = this.fb.group({
      anrede: ['', Validators.required],
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      geburtsdatum: ['', [Validators.required, this.pastDateValidator]],
      adresse: ['', Validators.required],
      plz: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ort: ['', Validators.required],
      land: ['', Validators.required]
    });
  }

  private loadCountries(): void {
    this.isLoading = true;
    this.loadError = false;

    this.countryService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.loadError = true;
        this.isLoading = false;
      }
    });
  }

  private pastDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate >= today) {
      return { futureDate: true };
    }

    return null;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.personForm.valid) {
      this.submittedData = this.personForm.value;
      this.showSuccessAnimation = true;
      console.log('Form submitted:', this.submittedData);
    } else {
      this.markFormGroupTouched(this.personForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.personForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.personForm.get(fieldName);
    if (!field || !field.errors) {
      return '';
    }

    if (field.errors['required']) {
      return 'Dieses Feld ist erforderlich';
    }

    if (field.errors['pattern'] && fieldName === 'plz') {
      return 'PLZ muss genau 5 Ziffern enthalten';
    }

    if (field.errors['futureDate']) {
      return 'Geburtsdatum muss in der Vergangenheit liegen';
    }

    return '';
  }

  resetForm(): void {
    this.submitted = false;
    this.submittedData = null;
    this.showSuccessAnimation = false;
    this.personForm.reset();
  }

  getCountryName(code: string): string {
    const country = this.countries.find(c => c.code === code);
    return country ? country.name : code;
  }

  get isFormValid(): boolean {
    return this.personForm.valid;
  }

  showTooltip(field: string): void {
    this.tooltips[field] = true;
  }

  hideTooltip(field: string): void {
    this.tooltips[field] = false;
  }

  isTooltipVisible(field: string): boolean {
    return this.tooltips[field] || false;
  }

  getTooltipText(field: string): string {
    return this.fieldInfo[field] || '';
  }
}
