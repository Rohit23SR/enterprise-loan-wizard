import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReviewSubmit } from './review-submit'
import { WizardState } from '../../../services/wizard-state'

describe('ReviewSubmit Component', () => {
  let component: ReviewSubmit
  let fixture: ComponentFixture<ReviewSubmit>
  let wizardState: WizardState

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewSubmit, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [WizardState],
    }).compileComponents()

    wizardState = TestBed.inject(WizardState)
    wizardState.clearStorage()
    fixture = TestBed.createComponent(ReviewSubmit)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  afterEach(() => {
    wizardState.stopAutoSave()
  })

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy()
    })

    it('should initialize the review form', () => {
      expect(component.reviewForm).toBeDefined()
    })

    it('should have 3 checkbox controls', () => {
      expect(component.reviewForm.get('certifyAccurate')).toBeDefined()
      expect(component.reviewForm.get('agreeToTerms')).toBeDefined()
      expect(component.reviewForm.get('consentToCreditCheck')).toBeDefined()
    })

    it('should default all checkboxes to false', () => {
      expect(component.reviewForm.get('certifyAccurate')?.value).toBe(false)
      expect(component.reviewForm.get('agreeToTerms')?.value).toBe(false)
      expect(component.reviewForm.get('consentToCreditCheck')?.value).toBe(false)
    })

    it('should load application data on init', () => {
      expect(component.applicationData).toBeDefined()
    })
  })

  describe('Checkbox Validation', () => {
    it('should have requiredTrue validator on certifyAccurate', () => {
      const control = component.reviewForm.get('certifyAccurate')
      expect(control?.valid).toBe(false)

      control?.setValue(true)
      expect(control?.valid).toBe(true)

      control?.setValue(false)
      expect(control?.valid).toBe(false)
    })

    it('should have requiredTrue validator on agreeToTerms', () => {
      const control = component.reviewForm.get('agreeToTerms')
      expect(control?.valid).toBe(false)

      control?.setValue(true)
      expect(control?.valid).toBe(true)

      control?.setValue(false)
      expect(control?.valid).toBe(false)
    })

    it('should have requiredTrue validator on consentToCreditCheck', () => {
      const control = component.reviewForm.get('consentToCreditCheck')
      expect(control?.valid).toBe(false)

      control?.setValue(true)
      expect(control?.valid).toBe(true)

      control?.setValue(false)
      expect(control?.valid).toBe(false)
    })

    it('should be invalid when any checkbox is unchecked', () => {
      component.reviewForm.patchValue({
        certifyAccurate: true,
        agreeToTerms: true,
        consentToCreditCheck: false,
      })
      expect(component.reviewForm.valid).toBe(false)
    })

    it('should be invalid when only first checkbox is checked', () => {
      component.reviewForm.patchValue({
        certifyAccurate: true,
        agreeToTerms: false,
        consentToCreditCheck: false,
      })
      expect(component.reviewForm.valid).toBe(false)
    })

    it('should be valid when all checkboxes are checked', () => {
      component.reviewForm.patchValue({
        certifyAccurate: true,
        agreeToTerms: true,
        consentToCreditCheck: true,
      })
      expect(component.reviewForm.valid).toBe(true)
    })
  })

  describe('Formatting Methods', () => {
    describe('formatCurrency', () => {
      it('should format a number as AUD currency', () => {
        const result = component.formatCurrency(50000)
        expect(result).toContain('50,000')
      })

      it('should return "$0" for undefined', () => {
        expect(component.formatCurrency(undefined)).toBe('$0')
      })

      it('should handle zero', () => {
        const result = component.formatCurrency(0)
        expect(result).toContain('0')
      })
    })

    describe('formatDate', () => {
      it('should format a date string in Australian format', () => {
        const result = component.formatDate('1990-01-15')
        expect(result).toContain('January')
        expect(result).toContain('1990')
        expect(result).toContain('15')
      })

      it('should return "N/A" for undefined', () => {
        expect(component.formatDate(undefined)).toBe('N/A')
      })
    })

    describe('maskTFN', () => {
      it('should mask TFN showing only last 3 digits', () => {
        const result = component.maskTFN('123456789')
        expect(result).toBe('*** *** 789')
      })

      it('should return "N/A" for undefined', () => {
        expect(component.maskTFN(undefined)).toBe('N/A')
      })

      it('should return "N/A" for empty string', () => {
        expect(component.maskTFN('')).toBe('N/A')
      })
    })

    describe('maskABN', () => {
      it('should mask ABN showing only last 3 digits', () => {
        const result = component.maskABN('12345678901')
        expect(result).toBe('** *** *** 901')
      })

      it('should return "N/A" for undefined', () => {
        expect(component.maskABN(undefined)).toBe('N/A')
      })

      it('should return "N/A" for empty string', () => {
        expect(component.maskABN('')).toBe('N/A')
      })
    })
  })

  describe('getFileCount', () => {
    it('should return 0 for undefined', () => {
      expect(component.getFileCount(undefined)).toBe(0)
    })

    it('should return 0 for empty array', () => {
      expect(component.getFileCount([])).toBe(0)
    })

    it('should return correct count for non-empty array', () => {
      const files = [
        new File(['x'], 'a.pdf', { type: 'application/pdf' }),
        new File(['x'], 'b.pdf', { type: 'application/pdf' }),
        new File(['x'], 'c.pdf', { type: 'application/pdf' }),
      ]
      expect(component.getFileCount(files)).toBe(3)
    })
  })

  describe('Public Methods', () => {
    describe('isFormValid', () => {
      it('should return false when form is invalid', () => {
        expect(component.isFormValid()).toBe(false)
      })

      it('should return true when all checkboxes are checked', () => {
        component.reviewForm.patchValue({
          certifyAccurate: true,
          agreeToTerms: true,
          consentToCreditCheck: true,
        })
        expect(component.isFormValid()).toBe(true)
      })
    })

    describe('markAllAsTouched', () => {
      it('should mark all fields as touched', () => {
        component.markAllAsTouched()

        expect(component.reviewForm.get('certifyAccurate')?.touched).toBe(true)
        expect(component.reviewForm.get('agreeToTerms')?.touched).toBe(true)
        expect(component.reviewForm.get('consentToCreditCheck')?.touched).toBe(true)
      })
    })

    describe('getFormData', () => {
      it('should return current form values', () => {
        component.reviewForm.patchValue({
          certifyAccurate: true,
          agreeToTerms: false,
          consentToCreditCheck: true,
        })

        const data = component.getFormData()
        expect(data.certifyAccurate).toBe(true)
        expect(data.agreeToTerms).toBe(false)
        expect(data.consentToCreditCheck).toBe(true)
      })
    })
  })

  describe('Form Data Integration', () => {
    it('should update wizard state when form changes', (done) => {
      component.reviewForm.patchValue({
        certifyAccurate: true,
        agreeToTerms: true,
        consentToCreditCheck: true,
      })

      setTimeout(() => {
        const formData = wizardState.getFormData()
        expect(formData.review.certifyAccurate).toBe(true)
        expect(formData.review.agreeToTerms).toBe(true)
        expect(formData.review.consentToCreditCheck).toBe(true)
        done()
      }, 100)
    })
  })

  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next')
      const completeSpy = jest.spyOn(component['destroy$'], 'complete')

      component.ngOnDestroy()

      expect(destroySpy).toHaveBeenCalled()
      expect(completeSpy).toHaveBeenCalled()
    })
  })
})
