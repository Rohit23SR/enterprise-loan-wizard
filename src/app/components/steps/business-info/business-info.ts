import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardState } from '../../../services/wizard-state';

@Component({
  selector: 'app-business-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './business-info.html',
  styleUrl: './business-info.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class BusinessInfo implements OnInit, OnDestroy {
  businessForm!: FormGroup;
  private destroy$ = new Subject<void>();

  businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'LLC',
    'Corporation',
    'S-Corporation',
    'Non-Profit'
  ];

  industries = [
    'Retail',
    'Manufacturing',
    'Technology',
    'Healthcare',
    'Construction',
    'Food & Beverage',
    'Professional Services',
    'Real Estate',
    'Transportation',
    'Other'
  ];

  states = [
    { code: 'NSW', name: 'New South Wales' },
    { code: 'VIC', name: 'Victoria' },
    { code: 'QLD', name: 'Queensland' },
    { code: 'WA', name: 'Western Australia' },
    { code: 'SA', name: 'South Australia' },
    { code: 'TAS', name: 'Tasmania' },
    { code: 'ACT', name: 'Australian Capital Territory' },
    { code: 'NT', name: 'Northern Territory' },
  ];

  countries = [
    { code: 'AU', name: 'Australia' },
  ];

  constructor(
    private fb: FormBuilder,
    private wizardState: WizardState
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSavedData();
    this.setupFormSubscription();
    this.setupConditionalValidation();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.businessForm = this.fb.group({
      businessName: ['', [Validators.required]],
      businessType: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      yearsInBusiness: [null, [Validators.required, Validators.min(0)]],
      abn: ['', [Validators.required, Validators.minLength(11)]],
      sameAsPersonal: [false],
      businessStreet: [''],
      businessCity: [''],
      businessState: [''],
      businessPostcode: [''],
      businessCountry: ['AU'],
      annualRevenue: [null, [Validators.required, Validators.min(0)]],
      numberOfEmployees: [null, [Validators.required, Validators.min(0)]],
      businessDescription: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  private setupConditionalValidation(): void {
    this.businessForm.get('sameAsPersonal')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((sameAsPersonal) => {
        const addressFields = ['businessStreet', 'businessCity', 'businessState', 'businessPostcode', 'businessCountry'];

        if (sameAsPersonal) {
          addressFields.forEach(field => {
            this.businessForm.get(field)?.clearValidators();
            this.businessForm.get(field)?.updateValueAndValidity();
          });
        } else {
          addressFields.forEach(field => {
            this.businessForm.get(field)?.setValidators([Validators.required]);
            this.businessForm.get(field)?.updateValueAndValidity();
          });
        }
      });
  }

  private loadSavedData(): void {
    const formData = this.wizardState.getFormData();
    if (formData.businessInfo && Object.keys(formData.businessInfo).length > 0) {
      this.businessForm.patchValue(formData.businessInfo);
    }
  }

  private setupFormSubscription(): void {
    this.businessForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        this.wizardState.updateFormData('businessInfo', values);
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.businessForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getCharCount(): number {
    return this.businessForm.get('businessDescription')?.value?.length || 0;
  }

  getFormData() {
    return this.businessForm.value;
  }

  isFormValid(): boolean {
    return this.businessForm.valid;
  }

  markAllAsTouched(): void {
    this.businessForm.markAllAsTouched();
  }
}
