import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardState, WizardFormData } from '../../../services/wizard-state';

@Component({
  selector: 'app-review-submit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-submit.html',
  styleUrl: './review-submit.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ReviewSubmit implements OnInit, OnDestroy {
  reviewForm!: FormGroup;
  private destroy$ = new Subject<void>();
  applicationData!: WizardFormData;

  constructor(
    private fb: FormBuilder,
    private wizardState: WizardState
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadApplicationData();
    this.loadSavedData();
    this.setupFormSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.reviewForm = this.fb.group({
      certifyAccurate: [false, [Validators.requiredTrue]],
      agreeToTerms: [false, [Validators.requiredTrue]],
      consentToCreditCheck: [false, [Validators.requiredTrue]],
    });
  }

  private loadApplicationData(): void {
    this.applicationData = this.wizardState.getFormData();
  }

  private loadSavedData(): void {
    const formData = this.wizardState.getFormData();
    if (formData.review && Object.keys(formData.review).length > 0) {
      this.reviewForm.patchValue(formData.review);
    }
  }

  private setupFormSubscription(): void {
    this.reviewForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((values) => {
        this.wizardState.updateFormData('review', values);
      });
  }

  getFormData() {
    return this.reviewForm.value;
  }

  isFormValid(): boolean {
    return this.reviewForm.valid;
  }

  markAllAsTouched(): void {
    this.reviewForm.markAllAsTouched();
  }

  // Helper methods for displaying data
  get personalInfo() {
    return this.applicationData.personalInfo;
  }

  get businessInfo() {
    return this.applicationData.businessInfo;
  }

  get financialDetails() {
    return this.applicationData.financialDetails;
  }

  get documents() {
    return this.applicationData.documents;
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  maskTFN(tfn: string | undefined): string {
    if (!tfn) return 'N/A';
    return `*** *** ${tfn.slice(-3)}`;
  }

  maskABN(abn: string | undefined): string {
    if (!abn) return 'N/A';
    return `** *** *** ${abn.slice(-3)}`;
  }

  getFileCount(files: File[] | undefined): number {
    return files?.length || 0;
  }
}
