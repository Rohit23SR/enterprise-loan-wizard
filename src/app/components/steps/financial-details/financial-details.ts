import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardState } from '../../../services/wizard-state';

@Component({
  selector: 'app-financial-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './financial-details.html',
  styleUrl: './financial-details.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class FinancialDetails implements OnInit, OnDestroy {
  financialForm!: FormGroup;
  private destroy$ = new Subject<void>();

  loanPurposes = [
    'Business Expansion',
    'Equipment Purchase',
    'Working Capital',
    'Inventory',
    'Real Estate',
    'Debt Consolidation',
    'Other'
  ];

  loanTerms = [
    '12 months',
    '24 months',
    '36 months',
    '48 months',
    '60 months'
  ];

  creditScoreRanges = [
    'Excellent (750+)',
    'Good (700-749)',
    'Fair (650-699)',
    'Poor (600-649)',
    'Very Poor (<600)'
  ];

  collateralTypes = [
    'Real Estate',
    'Equipment',
    'Inventory',
    'Accounts Receivable',
    'Vehicles',
    'Other'
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
    this.financialForm = this.fb.group({
      loanAmount: [null, [Validators.required, Validators.min(1000)]],
      loanPurpose: ['', [Validators.required]],
      desiredTerm: ['', [Validators.required]],
      avgMonthlyRevenue: [null, [Validators.required, Validators.min(0)]],
      monthlyExpenses: [null, [Validators.required, Validators.min(0)]],
      existingDebt: [null, [Validators.required, Validators.min(0)]],
      creditScoreRange: ['', [Validators.required]],
      hasCollateral: [false],
      collateralType: [''],
      collateralValue: [null],
    });
  }

  private setupConditionalValidation(): void {
    this.financialForm.get('hasCollateral')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasCollateral) => {
        if (hasCollateral) {
          this.financialForm.get('collateralType')?.setValidators([Validators.required]);
          this.financialForm.get('collateralValue')?.setValidators([Validators.required, Validators.min(1)]);
        } else {
          this.financialForm.get('collateralType')?.clearValidators();
          this.financialForm.get('collateralValue')?.clearValidators();
        }
        this.financialForm.get('collateralType')?.updateValueAndValidity();
        this.financialForm.get('collateralValue')?.updateValueAndValidity();
      });
  }

  private loadSavedData(): void {
    const formData = this.wizardState.getFormData();
    if (formData.financialDetails && Object.keys(formData.financialDetails).length > 0) {
      this.financialForm.patchValue(formData.financialDetails);
    }
  }

  private setupFormSubscription(): void {
    this.financialForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        this.wizardState.updateFormData('financialDetails', values);
      });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.financialForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFormData() {
    return this.financialForm.value;
  }

  isFormValid(): boolean {
    return this.financialForm.valid;
  }

  markAllAsTouched(): void {
    this.financialForm.markAllAsTouched();
  }
}
