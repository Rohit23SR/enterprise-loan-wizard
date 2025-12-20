import { Component, OnInit, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WizardState } from '../../services/wizard-state';
import { ProgressStepper } from '../progress-stepper/progress-stepper';
import { NavigationFooter } from '../navigation-footer/navigation-footer';
import { PersonalInfo } from '../steps/personal-info/personal-info';
import { BusinessInfo } from '../steps/business-info/business-info';
import { FinancialDetails } from '../steps/financial-details/financial-details';
import { DocumentUpload } from '../steps/document-upload/document-upload';
import { ReviewSubmit } from '../steps/review-submit/review-submit';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ProgressStepper,
    NavigationFooter,
    PersonalInfo,
    BusinessInfo,
    FinancialDetails,
    DocumentUpload,
    ReviewSubmit,
  ],
  templateUrl: './wizard.html',
  styleUrl: './wizard.scss',
})
export class Wizard implements OnInit {
  @ViewChild(PersonalInfo) personalInfoComponent?: PersonalInfo;
  @ViewChild(BusinessInfo) businessInfoComponent?: BusinessInfo;
  @ViewChild(FinancialDetails) financialDetailsComponent?: FinancialDetails;
  @ViewChild(DocumentUpload) documentUploadComponent?: DocumentUpload;
  @ViewChild(ReviewSubmit) reviewSubmitComponent?: ReviewSubmit;

  isSubmitting = false;

  constructor(
    public wizardState: WizardState,
    private router: Router
  ) {
    // React to step changes
    effect(() => {
      const currentStep = this.wizardState.currentStep();
      // Scroll to top when step changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  ngOnInit(): void {
    // Optional: Add navigation guard logic here
  }

  onStepClick(stepIndex: number): void {
    this.wizardState.goToStep(stepIndex);
  }

  onBack(): void {
    this.wizardState.previousStep();
  }

  async onContinue(): Promise<void> {
    const currentStep = this.wizardState.currentStep();

    // Mark all fields as touched first to show validation errors
    this.markCurrentStepAsTouched();

    // Validate current step before proceeding
    if (!this.validateCurrentStep()) {
      // Mark step as having errors
      this.wizardState.markStepAsError(currentStep);
      return;
    }

    // If on last step (Review), submit the application
    if (this.wizardState.isLastStep()) {
      await this.submitApplication();
    } else {
      this.wizardState.nextStep();
    }
  }

  onSaveExit(): void {
    if (confirm('Your progress has been saved. Do you want to exit?')) {
      // Redirect to home or dashboard
      // router.navigate(['/']);
      alert('Your application has been saved. You can return to continue later.');
    }
  }

  private validateCurrentStep(): boolean {
    const currentStep = this.wizardState.currentStep();

    switch (currentStep) {
      case 0:
        return this.personalInfoComponent?.isFormValid() ?? false;
      case 1:
        return this.businessInfoComponent?.isFormValid() ?? false;
      case 2:
        return this.financialDetailsComponent?.isFormValid() ?? false;
      case 3:
        return this.documentUploadComponent?.isFormValid() ?? false;
      case 4:
        return this.reviewSubmitComponent?.isFormValid() ?? false;
      default:
        return false;
    }
  }

  private markCurrentStepAsTouched(): void {
    const currentStep = this.wizardState.currentStep();

    switch (currentStep) {
      case 0:
        this.personalInfoComponent?.markAllAsTouched();
        break;
      case 1:
        this.businessInfoComponent?.markAllAsTouched();
        break;
      case 2:
        this.financialDetailsComponent?.markAllAsTouched();
        break;
      case 3:
        this.documentUploadComponent?.markAllAsTouched();
        break;
      case 4:
        this.reviewSubmitComponent?.markAllAsTouched();
        break;
    }
  }

  private async submitApplication(): Promise<void> {
    this.isSubmitting = true;

    try {
      const result = await this.wizardState.submitApplication();

      if (result.success) {
        // Navigate to success screen
        this.router.navigate(['/success'], {
          queryParams: { ref: result.referenceNumber },
        });
      } else {
        alert('There was an error submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      this.isSubmitting = false;
    }
  }

  get continueButtonText(): string {
    if (this.isSubmitting) {
      return 'Processing...';
    }
    return this.wizardState.isLastStep() ? 'Submit Application' : 'Continue';
  }

  get isContinueDisabled(): boolean {
    return this.isSubmitting;
  }
}
