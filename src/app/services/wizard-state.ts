import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  tfn: string;
  streetAddress: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  industry: string;
  yearsInBusiness: number;
  abn: string;
  sameAsPersonal: boolean;
  businessStreet: string;
  businessCity: string;
  businessState: string;
  businessPostcode: string;
  businessCountry: string;
  annualRevenue: number;
  numberOfEmployees: number;
  businessDescription: string;
}

export interface FinancialDetails {
  loanAmount: number;
  loanPurpose: string;
  desiredTerm: string;
  avgMonthlyRevenue: number;
  monthlyExpenses: number;
  existingDebt: number;
  creditScoreRange: string;
  hasCollateral: boolean;
  collateralType?: string;
  collateralValue?: number;
}

export interface DocumentUpload {
  governmentId: File[];
  businessRegistration: File[];
  bankStatements: File[];
  taxReturns: File[];
  additionalDocs: File[];
}

export interface ReviewConfirmation {
  certifyAccurate: boolean;
  agreeToTerms: boolean;
  consentToCreditCheck: boolean;
}

export interface WizardFormData {
  personalInfo: Partial<PersonalInfo>;
  businessInfo: Partial<BusinessInfo>;
  financialDetails: Partial<FinancialDetails>;
  documents: Partial<DocumentUpload>;
  review: Partial<ReviewConfirmation>;
}

export interface WizardStep {
  id: number;
  name: string;
  label: string;
  description: string;
  completed: boolean;
  hasErrors: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WizardState {
  private readonly STORAGE_KEY = 'enterprise-loan-wizard-data';
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  private autoSaveTimer: any;

  // Current step (0-indexed)
  currentStep = signal<number>(0);

  // Form data
  private formDataSubject = new BehaviorSubject<WizardFormData>(this.getInitialFormData());
  formData$ = this.formDataSubject.asObservable();

  // Steps configuration
  steps: WizardStep[] = [
    {
      id: 1,
      name: 'personal-info',
      label: 'Personal Info',
      description: 'Personal Information',
      completed: false,
      hasErrors: false,
    },
    {
      id: 2,
      name: 'business-info',
      label: 'Business Info',
      description: 'Business Information',
      completed: false,
      hasErrors: false,
    },
    {
      id: 3,
      name: 'financial-details',
      label: 'Financial Details',
      description: 'Financial Details',
      completed: false,
      hasErrors: false,
    },
    {
      id: 4,
      name: 'documents',
      label: 'Documents',
      description: 'Document Upload',
      completed: false,
      hasErrors: false,
    },
    {
      id: 5,
      name: 'review',
      label: 'Review',
      description: 'Review & Submit',
      completed: false,
      hasErrors: false,
    },
  ];

  // Computed properties
  totalSteps = computed(() => this.steps.length);
  isFirstStep = computed(() => this.currentStep() === 0);
  isLastStep = computed(() => this.currentStep() === this.steps.length - 1);
  currentStepData = computed(() => this.steps[this.currentStep()]);
  progress = computed(() => ((this.currentStep() + 1) / this.steps.length) * 100);

  constructor() {
    this.loadFromStorage();
    this.startAutoSave();
  }

  // Get initial form data structure
  private getInitialFormData(): WizardFormData {
    return {
      personalInfo: {},
      businessInfo: {},
      financialDetails: {},
      documents: {
        governmentId: [],
        businessRegistration: [],
        bankStatements: [],
        taxReturns: [],
        additionalDocs: [],
      },
      review: {},
    };
  }

  // Get current form data
  getFormData(): WizardFormData {
    return this.formDataSubject.value;
  }

  // Update specific section of form data
  updateFormData<K extends keyof WizardFormData>(
    section: K,
    data: Partial<WizardFormData[K]>
  ): void {
    const currentData = this.formDataSubject.value;
    const updatedData = {
      ...currentData,
      [section]: {
        ...currentData[section],
        ...data,
      },
    };
    this.formDataSubject.next(updatedData);
    this.saveToStorage();
  }

  // Navigation methods
  nextStep(): void {
    if (!this.isLastStep()) {
      this.markStepAsCompleted(this.currentStep());
      this.currentStep.update((step) => step + 1);
    }
  }

  previousStep(): void {
    if (!this.isFirstStep()) {
      this.currentStep.update((step) => step - 1);
    }
  }

  goToStep(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.currentStep.set(stepIndex);
    }
  }

  // Step status management
  markStepAsCompleted(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[stepIndex].completed = true;
      this.steps[stepIndex].hasErrors = false;
    }
  }

  markStepAsError(stepIndex: number): void {
    if (stepIndex >= 0 && stepIndex < this.steps.length) {
      this.steps[stepIndex].hasErrors = true;
      this.steps[stepIndex].completed = false;
    }
  }

  // Check if user can navigate away
  hasUnsavedChanges(): boolean {
    const currentData = this.formDataSubject.value;
    const initialData = this.getInitialFormData();
    return JSON.stringify(currentData) !== JSON.stringify(initialData);
  }

  // LocalStorage methods
  private saveToStorage(): void {
    try {
      const data = {
        formData: this.formDataSubject.value,
        currentStep: this.currentStep(),
        steps: this.steps,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);

        // Check if data is not too old (e.g., 7 days)
        const savedTime = new Date(data.timestamp).getTime();
        const now = new Date().getTime();
        const daysDiff = (now - savedTime) / (1000 * 60 * 60 * 24);

        if (daysDiff < 7) {
          this.formDataSubject.next(data.formData);
          this.currentStep.set(data.currentStep);
          if (data.steps) {
            this.steps = data.steps;
          }
        } else {
          // Clear old data
          this.clearStorage();
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.formDataSubject.next(this.getInitialFormData());
    this.currentStep.set(0);
    this.steps.forEach((step) => {
      step.completed = false;
      step.hasErrors = false;
    });
  }

  // Auto-save functionality
  private startAutoSave(): void {
    this.autoSaveTimer = setInterval(() => {
      this.saveToStorage();
    }, this.AUTO_SAVE_INTERVAL);
  }

  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
  }

  // Form submission
  async submitApplication(): Promise<{ success: boolean; referenceNumber?: string }> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate reference number
      const refNumber = `LN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Store submitted data for PDF generation before clearing
      const submittedData = {
        ...this.formDataSubject.value,
        referenceNumber: refNumber,
        submittedDate: new Date().toISOString(),
      };
      localStorage.setItem('last-submitted-application', JSON.stringify(submittedData));

      // Clear storage after successful submission
      this.clearStorage();
      this.stopAutoSave();

      return {
        success: true,
        referenceNumber: refNumber,
      };
    } catch (error) {
      console.error('Error submitting application:', error);
      return {
        success: false,
      };
    }
  }

  // Validation helpers
  isStepValid(stepIndex: number): boolean {
    const formData = this.getFormData();

    switch (stepIndex) {
      case 0: // Personal Info
        return this.validatePersonalInfo(formData.personalInfo);
      case 1: // Business Info
        return this.validateBusinessInfo(formData.businessInfo);
      case 2: // Financial Details
        return this.validateFinancialDetails(formData.financialDetails);
      case 3: // Documents
        return this.validateDocuments(formData.documents);
      case 4: // Review
        return this.validateReview(formData.review);
      default:
        return false;
    }
  }

  private validatePersonalInfo(data: Partial<PersonalInfo>): boolean {
    return !!(
      data.fullName &&
      data.email &&
      data.phone &&
      data.dateOfBirth &&
      data.tfn &&
      data.streetAddress &&
      data.city &&
      data.state &&
      data.postcode &&
      data.country
    );
  }

  private validateBusinessInfo(data: Partial<BusinessInfo>): boolean {
    const baseValidation = !!(
      data.businessName &&
      data.businessType &&
      data.industry &&
      data.yearsInBusiness !== undefined &&
      data.abn &&
      data.annualRevenue !== undefined &&
      data.numberOfEmployees !== undefined &&
      data.businessDescription
    );

    if (data.sameAsPersonal) {
      return baseValidation;
    }

    return !!(
      baseValidation &&
      data.businessStreet &&
      data.businessCity &&
      data.businessState &&
      data.businessPostcode &&
      data.businessCountry
    );
  }

  private validateFinancialDetails(data: Partial<FinancialDetails>): boolean {
    const baseValidation = !!(
      data.loanAmount &&
      data.loanPurpose &&
      data.desiredTerm &&
      data.avgMonthlyRevenue !== undefined &&
      data.monthlyExpenses !== undefined &&
      data.existingDebt !== undefined &&
      data.creditScoreRange &&
      data.hasCollateral !== undefined
    );

    if (data.hasCollateral) {
      return !!(baseValidation && data.collateralType && data.collateralValue);
    }

    return baseValidation;
  }

  private validateDocuments(data: Partial<DocumentUpload>): boolean {
    return !!(
      data.governmentId &&
      data.governmentId.length > 0 &&
      data.businessRegistration &&
      data.businessRegistration.length > 0 &&
      data.bankStatements &&
      data.bankStatements.length >= 3 &&
      data.taxReturns &&
      data.taxReturns.length >= 2
    );
  }

  private validateReview(data: Partial<ReviewConfirmation>): boolean {
    return !!(
      data.certifyAccurate &&
      data.agreeToTerms &&
      data.consentToCreditCheck
    );
  }
}
