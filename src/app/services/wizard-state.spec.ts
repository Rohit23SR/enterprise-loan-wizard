import { TestBed } from '@angular/core/testing';
import { WizardState, WizardFormData, PersonalInfo, BusinessInfo, FinancialDetails } from './wizard-state';

describe('WizardState', () => {
  let service: WizardState;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {};

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return localStorageMock[key] || null;
    });

    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      localStorageMock[key] = value;
    });

    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key: string) => {
      delete localStorageMock[key];
    });

    jest.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [WizardState]
    });

    service = TestBed.inject(WizardState);
  });

  afterEach(() => {
    service.stopAutoSave();
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with step 0', () => {
      expect(service.currentStep()).toBe(0);
    });

    it('should have 5 steps configured', () => {
      expect(service.steps.length).toBe(5);
      expect(service.totalSteps()).toBe(5);
    });

    it('should initialize all steps as incomplete', () => {
      service.steps.forEach(step => {
        expect(step.completed).toBe(false);
        expect(step.hasErrors).toBe(false);
      });
    });

    it('should initialize with empty form data', () => {
      const formData = service.getFormData();
      expect(formData.personalInfo).toEqual({});
      expect(formData.businessInfo).toEqual({});
      expect(formData.financialDetails).toEqual({});
      expect(formData.review).toEqual({});
    });

    it('should initialize documents with empty arrays', () => {
      const formData = service.getFormData();
      expect(formData.documents?.governmentId).toEqual([]);
      expect(formData.documents?.businessRegistration).toEqual([]);
      expect(formData.documents?.bankStatements).toEqual([]);
      expect(formData.documents?.taxReturns).toEqual([]);
      expect(formData.documents?.additionalDocs).toEqual([]);
    });
  });

  describe('Computed Properties', () => {
    it('should calculate isFirstStep correctly', () => {
      service.currentStep.set(0);
      expect(service.isFirstStep()).toBe(true);

      service.currentStep.set(1);
      expect(service.isFirstStep()).toBe(false);
    });

    it('should calculate isLastStep correctly', () => {
      service.currentStep.set(4);
      expect(service.isLastStep()).toBe(true);

      service.currentStep.set(3);
      expect(service.isLastStep()).toBe(false);
    });

    it('should provide currentStepData correctly', () => {
      service.currentStep.set(0);
      const stepData = service.currentStepData();
      expect(stepData.id).toBe(1);
      expect(stepData.name).toBe('personal-info');
    });

    it('should calculate progress correctly', () => {
      service.currentStep.set(0);
      expect(service.progress()).toBe(20); // (1/5) * 100

      service.currentStep.set(2);
      expect(service.progress()).toBe(60); // (3/5) * 100

      service.currentStep.set(4);
      expect(service.progress()).toBe(100); // (5/5) * 100
    });
  });

  describe('Form Data Management', () => {
    it('should update personal info data', () => {
      const personalData: Partial<PersonalInfo> = {
        fullName: 'John Doe',
        email: 'john@example.com'
      };

      service.updateFormData('personalInfo', personalData);
      const formData = service.getFormData();

      expect(formData.personalInfo.fullName).toBe('John Doe');
      expect(formData.personalInfo.email).toBe('john@example.com');
    });

    it('should update business info data', () => {
      const businessData: Partial<BusinessInfo> = {
        businessName: 'Test Company',
        abn: '12345678901'
      };

      service.updateFormData('businessInfo', businessData);
      const formData = service.getFormData();

      expect(formData.businessInfo.businessName).toBe('Test Company');
      expect(formData.businessInfo.abn).toBe('12345678901');
    });

    it('should merge data on multiple updates', () => {
      service.updateFormData('personalInfo', { fullName: 'John Doe' });
      service.updateFormData('personalInfo', { email: 'john@example.com' });

      const formData = service.getFormData();
      expect(formData.personalInfo.fullName).toBe('John Doe');
      expect(formData.personalInfo.email).toBe('john@example.com');
    });

    it('should emit form data through observable', (done) => {
      service.formData$.subscribe(data => {
        if (data.personalInfo.fullName) {
          expect(data.personalInfo.fullName).toBe('Test User');
          done();
        }
      });

      service.updateFormData('personalInfo', { fullName: 'Test User' });
    });
  });

  describe('Navigation', () => {
    it('should navigate to next step', () => {
      service.currentStep.set(0);
      service.nextStep();
      expect(service.currentStep()).toBe(1);
    });

    it('should not navigate past last step', () => {
      service.currentStep.set(4);
      service.nextStep();
      expect(service.currentStep()).toBe(4);
    });

    it('should mark step as completed when moving to next step', () => {
      service.currentStep.set(0);
      service.nextStep();
      expect(service.steps[0].completed).toBe(true);
    });

    it('should navigate to previous step', () => {
      service.currentStep.set(2);
      service.previousStep();
      expect(service.currentStep()).toBe(1);
    });

    it('should not navigate before first step', () => {
      service.currentStep.set(0);
      service.previousStep();
      expect(service.currentStep()).toBe(0);
    });

    it('should navigate to specific step', () => {
      service.goToStep(3);
      expect(service.currentStep()).toBe(3);
    });

    it('should not navigate to invalid step index', () => {
      service.currentStep.set(2);
      service.goToStep(-1);
      expect(service.currentStep()).toBe(2);

      service.goToStep(10);
      expect(service.currentStep()).toBe(2);
    });
  });

  describe('Step Status Management', () => {
    it('should mark step as completed', () => {
      service.markStepAsCompleted(0);
      expect(service.steps[0].completed).toBe(true);
      expect(service.steps[0].hasErrors).toBe(false);
    });

    it('should mark step as error', () => {
      service.markStepAsError(1);
      expect(service.steps[1].hasErrors).toBe(true);
      expect(service.steps[1].completed).toBe(false);
    });

    it('should clear errors when marking as completed', () => {
      service.markStepAsError(0);
      service.markStepAsCompleted(0);
      expect(service.steps[0].hasErrors).toBe(false);
      expect(service.steps[0].completed).toBe(true);
    });

    it('should handle invalid step index gracefully', () => {
      expect(() => service.markStepAsCompleted(-1)).not.toThrow();
      expect(() => service.markStepAsCompleted(10)).not.toThrow();
      expect(() => service.markStepAsError(-1)).not.toThrow();
      expect(() => service.markStepAsError(10)).not.toThrow();
    });
  });

  describe('LocalStorage Operations', () => {
    it('should save form data to localStorage', () => {
      service.updateFormData('personalInfo', { fullName: 'John Doe' });

      const stored = JSON.parse(localStorageMock['enterprise-loan-wizard-data']);
      expect(stored.formData.personalInfo.fullName).toBe('John Doe');
    });

    it('should save current step to localStorage', () => {
      service.currentStep.set(2);
      service.updateFormData('personalInfo', {}); // Trigger save

      const stored = JSON.parse(localStorageMock['enterprise-loan-wizard-data']);
      expect(stored.currentStep).toBe(2);
    });

    it('should include timestamp when saving', () => {
      service.updateFormData('personalInfo', { fullName: 'Test' });

      const stored = JSON.parse(localStorageMock['enterprise-loan-wizard-data']);
      expect(stored.timestamp).toBeDefined();
      expect(new Date(stored.timestamp)).toBeInstanceOf(Date);
    });

    it('should load data from localStorage on initialization', () => {
      const testData = {
        formData: {
          personalInfo: { fullName: 'Saved User' },
          businessInfo: {},
          financialDetails: {},
          documents: {
            governmentId: [],
            businessRegistration: [],
            bankStatements: [],
            taxReturns: [],
            additionalDocs: []
          },
          review: {}
        },
        currentStep: 2,
        steps: service.steps,
        timestamp: new Date().toISOString()
      };

      localStorageMock['enterprise-loan-wizard-data'] = JSON.stringify(testData);

      // Create new service instance to trigger constructor
      const newService = new WizardState();

      expect(newService.currentStep()).toBe(2);
      expect(newService.getFormData().personalInfo.fullName).toBe('Saved User');

      newService.stopAutoSave();
    });

    it('should clear storage and reset state', () => {
      service.updateFormData('personalInfo', { fullName: 'Test' });
      service.currentStep.set(3);
      service.markStepAsCompleted(0);

      service.clearStorage();

      expect(localStorageMock['enterprise-loan-wizard-data']).toBeUndefined();
      expect(service.currentStep()).toBe(0);
      expect(service.getFormData().personalInfo.fullName).toBeUndefined();
      expect(service.steps[0].completed).toBe(false);
    });

    it('should not load data older than 7 days', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 8); // 8 days ago

      const oldData = {
        formData: {
          personalInfo: { fullName: 'Old User' },
          businessInfo: {},
          financialDetails: {},
          documents: {
            governmentId: [],
            businessRegistration: [],
            bankStatements: [],
            taxReturns: [],
            additionalDocs: []
          },
          review: {}
        },
        currentStep: 2,
        steps: service.steps,
        timestamp: oldDate.toISOString()
      };

      localStorageMock['enterprise-loan-wizard-data'] = JSON.stringify(oldData);

      const newService = new WizardState();

      expect(newService.currentStep()).toBe(0);
      expect(newService.getFormData().personalInfo.fullName).toBeUndefined();

      newService.stopAutoSave();
    });
  });

  describe('Auto-save Functionality', () => {
    it('should auto-save data every 30 seconds', () => {
      service.updateFormData('personalInfo', { fullName: 'John' });

      // Clear the storage
      delete localStorageMock['enterprise-loan-wizard-data'];

      // Fast-forward time by 30 seconds
      jest.advanceTimersByTime(30000);

      expect(localStorageMock['enterprise-loan-wizard-data']).toBeDefined();
    });

    it('should stop auto-save when requested', () => {
      service.updateFormData('personalInfo', { fullName: 'John' });
      service.stopAutoSave();

      delete localStorageMock['enterprise-loan-wizard-data'];

      jest.advanceTimersByTime(30000);

      expect(localStorageMock['enterprise-loan-wizard-data']).toBeUndefined();
    });
  });

  describe('Unsaved Changes Detection', () => {
    it('should detect when there are no unsaved changes', () => {
      expect(service.hasUnsavedChanges()).toBe(false);
    });

    it('should detect when there are unsaved changes', () => {
      service.updateFormData('personalInfo', { fullName: 'John Doe' });
      expect(service.hasUnsavedChanges()).toBe(true);
    });
  });

  describe('Form Validation', () => {
    describe('Personal Info Validation', () => {
      it('should validate complete personal info', () => {
        const completeData: Partial<PersonalInfo> = {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '0412345678',
          dateOfBirth: '1990-01-01',
          tfn: '123456789',
          streetAddress: '123 Test St',
          city: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          country: 'Australia'
        };

        service.updateFormData('personalInfo', completeData);
        expect(service.isStepValid(0)).toBe(true);
      });

      it('should invalidate incomplete personal info', () => {
        service.updateFormData('personalInfo', { fullName: 'John Doe' });
        expect(service.isStepValid(0)).toBe(false);
      });
    });

    describe('Business Info Validation', () => {
      it('should validate business info with sameAsPersonal true', () => {
        const businessData: Partial<BusinessInfo> = {
          businessName: 'Test Company',
          businessType: 'Sole Trader',
          industry: 'Technology',
          yearsInBusiness: 5,
          abn: '12345678901',
          sameAsPersonal: true,
          annualRevenue: 500000,
          numberOfEmployees: 10,
          businessDescription: 'Test description'
        };

        service.updateFormData('businessInfo', businessData);
        expect(service.isStepValid(1)).toBe(true);
      });

      it('should require business address when sameAsPersonal is false', () => {
        const businessData: Partial<BusinessInfo> = {
          businessName: 'Test Company',
          businessType: 'Company',
          industry: 'Technology',
          yearsInBusiness: 5,
          abn: '12345678901',
          sameAsPersonal: false,
          annualRevenue: 500000,
          numberOfEmployees: 10,
          businessDescription: 'Test description'
        };

        service.updateFormData('businessInfo', businessData);
        expect(service.isStepValid(1)).toBe(false);

        // Add address fields
        service.updateFormData('businessInfo', {
          businessStreet: '123 Business St',
          businessCity: 'Melbourne',
          businessState: 'VIC',
          businessPostcode: '3000',
          businessCountry: 'Australia'
        });
        expect(service.isStepValid(1)).toBe(true);
      });
    });

    describe('Financial Details Validation', () => {
      it('should validate financial details without collateral', () => {
        const financialData: Partial<FinancialDetails> = {
          loanAmount: 100000,
          loanPurpose: 'Expansion',
          desiredTerm: '5 years',
          avgMonthlyRevenue: 50000,
          monthlyExpenses: 30000,
          existingDebt: 10000,
          creditScoreRange: '700-749',
          hasCollateral: false
        };

        service.updateFormData('financialDetails', financialData);
        expect(service.isStepValid(2)).toBe(true);
      });

      it('should require collateral details when hasCollateral is true', () => {
        const financialData: Partial<FinancialDetails> = {
          loanAmount: 100000,
          loanPurpose: 'Expansion',
          desiredTerm: '5 years',
          avgMonthlyRevenue: 50000,
          monthlyExpenses: 30000,
          existingDebt: 10000,
          creditScoreRange: '700-749',
          hasCollateral: true
        };

        service.updateFormData('financialDetails', financialData);
        expect(service.isStepValid(2)).toBe(false);

        // Add collateral details
        service.updateFormData('financialDetails', {
          collateralType: 'Property',
          collateralValue: 500000
        });
        expect(service.isStepValid(2)).toBe(true);
      });
    });

    describe('Documents Validation', () => {
      it('should validate complete document upload', () => {
        const mockFile = new File([''], 'test.pdf');

        service.updateFormData('documents', {
          governmentId: [mockFile],
          businessRegistration: [mockFile],
          bankStatements: [mockFile, mockFile, mockFile],
          taxReturns: [mockFile, mockFile]
        });

        expect(service.isStepValid(3)).toBe(true);
      });

      it('should require at least 3 bank statements', () => {
        const mockFile = new File([''], 'test.pdf');

        service.updateFormData('documents', {
          governmentId: [mockFile],
          businessRegistration: [mockFile],
          bankStatements: [mockFile, mockFile], // Only 2
          taxReturns: [mockFile, mockFile]
        });

        expect(service.isStepValid(3)).toBe(false);
      });

      it('should require at least 2 tax returns', () => {
        const mockFile = new File([''], 'test.pdf');

        service.updateFormData('documents', {
          governmentId: [mockFile],
          businessRegistration: [mockFile],
          bankStatements: [mockFile, mockFile, mockFile],
          taxReturns: [mockFile] // Only 1
        });

        expect(service.isStepValid(3)).toBe(false);
      });
    });

    describe('Review Validation', () => {
      it('should validate complete review confirmation', () => {
        service.updateFormData('review', {
          certifyAccurate: true,
          agreeToTerms: true,
          consentToCreditCheck: true
        });

        expect(service.isStepValid(4)).toBe(true);
      });

      it('should invalidate incomplete review', () => {
        service.updateFormData('review', {
          certifyAccurate: true,
          agreeToTerms: false,
          consentToCreditCheck: true
        });

        expect(service.isStepValid(4)).toBe(false);
      });
    });

    it('should return false for invalid step index', () => {
      expect(service.isStepValid(-1)).toBe(false);
      expect(service.isStepValid(10)).toBe(false);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      jest.useRealTimers(); // Use real timers for async tests
    });

    afterEach(() => {
      jest.useFakeTimers();
    });

    it('should successfully submit application', async () => {
      const result = await service.submitApplication();

      expect(result.success).toBe(true);
      expect(result.referenceNumber).toBeDefined();
      expect(result.referenceNumber).toMatch(/^LN-\d{4}-\d{4}$/);
    });

    it('should store submitted data in localStorage', async () => {
      service.updateFormData('personalInfo', { fullName: 'John Doe' });

      const result = await service.submitApplication();

      const storedData = JSON.parse(localStorageMock['last-submitted-application']);
      expect(storedData.personalInfo.fullName).toBe('John Doe');
      expect(storedData.referenceNumber).toBe(result.referenceNumber);
      expect(storedData.submittedDate).toBeDefined();
    });

    it('should clear wizard data after submission', async () => {
      service.updateFormData('personalInfo', { fullName: 'John Doe' });
      service.currentStep.set(4);

      await service.submitApplication();

      expect(localStorageMock['enterprise-loan-wizard-data']).toBeUndefined();
      expect(service.currentStep()).toBe(0);
      expect(service.getFormData().personalInfo.fullName).toBeUndefined();
    });

    it('should stop auto-save after submission', async () => {
      const stopAutoSaveSpy = jest.spyOn(service, 'stopAutoSave');

      await service.submitApplication();

      expect(stopAutoSaveSpy).toHaveBeenCalled();
    });
  });
});
