import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardState } from '../../../services/wizard-state';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class PersonalInfo implements OnInit, OnDestroy {
  personalForm!: FormGroup;
  private destroy$ = new Subject<void>();

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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.personalForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      dateOfBirth: ['', [Validators.required, this.ageValidator]],
      tfn: ['', [Validators.required, Validators.minLength(9)]],
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postcode: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
      country: ['AU', [Validators.required]],
    });
  }

  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 < 18 ? { underAge: true } : null;
    }

    return age < 18 ? { underAge: true } : null;
  }

  private loadSavedData(): void {
    const formData = this.wizardState.getFormData();
    if (formData.personalInfo && Object.keys(formData.personalInfo).length > 0) {
      this.personalForm.patchValue(formData.personalInfo);
    }
  }

  private setupFormSubscription(): void {
    this.personalForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        this.wizardState.updateFormData('personalInfo', values);
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.personalForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFormData() {
    return this.personalForm.value;
  }

  isFormValid(): boolean {
    return this.personalForm.valid;
  }

  markAllAsTouched(): void {
    this.personalForm.markAllAsTouched();
  }
}
