import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { WizardState } from '../../../services/wizard-state';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-upload.html',
  styleUrl: './document-upload.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class DocumentUpload implements OnInit, OnDestroy {
  documentForm!: FormGroup;
  private destroy$ = new Subject<void>();

  governmentIdFiles: File[] = [];
  businessRegistrationFiles: File[] = [];
  bankStatementFiles: File[] = [];
  taxReturnFiles: File[] = [];
  additionalFiles: File[] = [];

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
    this.documentForm = this.fb.group({
      governmentId: [null, [Validators.required]],
      businessRegistration: [null, [Validators.required]],
      bankStatements: [null, [Validators.required]],
      taxReturns: [null, [Validators.required]],
      additionalDocs: [null],
    });
  }

  private loadSavedData(): void {
    // Note: File objects cannot be serialized to localStorage
    // Users will need to re-upload files after page refresh
    // This is expected behavior for client-side file handling
    const formData = this.wizardState.getFormData();
    if (formData.documents) {
      // Check if files exist and are actual File objects (not deserialized plain objects)
      const hasValidFiles = (files: any): files is File[] =>
        Array.isArray(files) && files.length > 0 && files[0] instanceof File;

      this.governmentIdFiles = hasValidFiles(formData.documents.governmentId)
        ? formData.documents.governmentId : [];
      this.businessRegistrationFiles = hasValidFiles(formData.documents.businessRegistration)
        ? formData.documents.businessRegistration : [];
      this.bankStatementFiles = hasValidFiles(formData.documents.bankStatements)
        ? formData.documents.bankStatements : [];
      this.taxReturnFiles = hasValidFiles(formData.documents.taxReturns)
        ? formData.documents.taxReturns : [];
      this.additionalFiles = hasValidFiles(formData.documents.additionalDocs)
        ? formData.documents.additionalDocs : [];

      this.updateFormValidity();
    }
  }

  private setupFormSubscription(): void {
    this.documentForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.saveToWizardState();
      });
  }

  private saveToWizardState(): void {
    this.wizardState.updateFormData('documents', {
      governmentId: this.governmentIdFiles,
      businessRegistration: this.businessRegistrationFiles,
      bankStatements: this.bankStatementFiles,
      taxReturns: this.taxReturnFiles,
      additionalDocs: this.additionalFiles,
    });
  }

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const newFiles = Array.from(input.files);

      switch (fileType) {
        case 'governmentId':
          this.governmentIdFiles = [...this.governmentIdFiles, ...newFiles];
          break;
        case 'businessRegistration':
          this.businessRegistrationFiles = [...this.businessRegistrationFiles, ...newFiles];
          break;
        case 'bankStatements':
          this.bankStatementFiles = [...this.bankStatementFiles, ...newFiles];
          break;
        case 'taxReturns':
          this.taxReturnFiles = [...this.taxReturnFiles, ...newFiles];
          break;
        case 'additionalDocs':
          this.additionalFiles = [...this.additionalFiles, ...newFiles];
          break;
      }

      this.updateFormValidity();
      this.saveToWizardState();
      input.value = '';
    }
  }

  removeFile(fileType: string, index: number): void {
    switch (fileType) {
      case 'governmentId':
        this.governmentIdFiles = this.governmentIdFiles.filter((_, i) => i !== index);
        break;
      case 'businessRegistration':
        this.businessRegistrationFiles = this.businessRegistrationFiles.filter((_, i) => i !== index);
        break;
      case 'bankStatements':
        this.bankStatementFiles = this.bankStatementFiles.filter((_, i) => i !== index);
        break;
      case 'taxReturns':
        this.taxReturnFiles = this.taxReturnFiles.filter((_, i) => i !== index);
        break;
      case 'additionalDocs':
        this.additionalFiles = this.additionalFiles.filter((_, i) => i !== index);
        break;
    }

    this.updateFormValidity();
    this.saveToWizardState();
  }

  private updateFormValidity(): void {
    this.documentForm.patchValue({
      governmentId: this.governmentIdFiles.length > 0 ? this.governmentIdFiles : null,
      businessRegistration: this.businessRegistrationFiles.length > 0 ? this.businessRegistrationFiles : null,
      bankStatements: this.bankStatementFiles.length >= 3 ? this.bankStatementFiles : null,
      taxReturns: this.taxReturnFiles.length >= 2 ? this.taxReturnFiles : null,
      additionalDocs: this.additionalFiles.length > 0 ? this.additionalFiles : null,
    }, { emitEvent: false });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.documentForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFormData() {
    return {
      governmentId: this.governmentIdFiles,
      businessRegistration: this.businessRegistrationFiles,
      bankStatements: this.bankStatementFiles,
      taxReturns: this.taxReturnFiles,
      additionalDocs: this.additionalFiles,
    };
  }

  isFormValid(): boolean {
    return this.governmentIdFiles.length > 0 &&
           this.businessRegistrationFiles.length > 0 &&
           this.bankStatementFiles.length >= 3 &&
           this.taxReturnFiles.length >= 2;
  }

  markAllAsTouched(): void {
    this.documentForm.markAllAsTouched();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
