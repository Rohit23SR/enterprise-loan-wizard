import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FinancialDetails } from './financial-details'
import { WizardState } from '../../../services/wizard-state'
import { MIN_LOAN_AMOUNT } from '../../../constants/wizard-config'

describe('FinancialDetails Component', () => {
  let component: FinancialDetails
  let fixture: ComponentFixture<FinancialDetails>
  let wizardState: WizardState

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialDetails, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [WizardState],
    }).compileComponents()

    wizardState = TestBed.inject(WizardState)
    wizardState.clearStorage()
    fixture = TestBed.createComponent(FinancialDetails)
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

    it('should initialize the form with all fields', () => {
      expect(component.financialForm).toBeDefined()
      expect(component.financialForm.get('loanAmount')).toBeDefined()
      expect(component.financialForm.get('loanPurpose')).toBeDefined()
      expect(component.financialForm.get('desiredTerm')).toBeDefined()
      expect(component.financialForm.get('avgMonthlyRevenue')).toBeDefined()
      expect(component.financialForm.get('monthlyExpenses')).toBeDefined()
      expect(component.financialForm.get('existingDebt')).toBeDefined()
      expect(component.financialForm.get('creditScoreRange')).toBeDefined()
      expect(component.financialForm.get('hasCollateral')).toBeDefined()
      expect(component.financialForm.get('collateralType')).toBeDefined()
      expect(component.financialForm.get('collateralValue')).toBeDefined()
    })

    it('should default hasCollateral to false', () => {
      expect(component.financialForm.get('hasCollateral')?.value).toBe(false)
    })

    it('should have loanPurposes array defined', () => {
      expect(component.loanPurposes.length).toBeGreaterThan(0)
      expect(component.loanPurposes).toContain('Business Expansion')
      expect(component.loanPurposes).toContain('Working Capital')
    })

    it('should have loanTerms array defined', () => {
      expect(component.loanTerms.length).toBeGreaterThan(0)
      expect(component.loanTerms).toContain('12 months')
      expect(component.loanTerms).toContain('60 months')
    })

    it('should have creditScoreRanges array defined', () => {
      expect(component.creditScoreRanges.length).toBeGreaterThan(0)
      expect(component.creditScoreRanges).toContain('Excellent (750+)')
      expect(component.creditScoreRanges).toContain('Very Poor (<600)')
    })

    it('should have collateralTypes array defined', () => {
      expect(component.collateralTypes.length).toBeGreaterThan(0)
      expect(component.collateralTypes).toContain('Real Estate')
      expect(component.collateralTypes).toContain('Equipment')
    })
  })

  describe('Form Validation', () => {
    describe('loanAmount', () => {
      it('should be invalid when null', () => {
        const control = component.financialForm.get('loanAmount')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be invalid when below MIN_LOAN_AMOUNT', () => {
        const control = component.financialForm.get('loanAmount')
        control?.setValue(MIN_LOAN_AMOUNT - 1)
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['min']).toBeDefined()
      })

      it('should be valid at exactly MIN_LOAN_AMOUNT', () => {
        const control = component.financialForm.get('loanAmount')
        control?.setValue(MIN_LOAN_AMOUNT)
        expect(control?.valid).toBe(true)
      })

      it('should be valid above MIN_LOAN_AMOUNT', () => {
        const control = component.financialForm.get('loanAmount')
        control?.setValue(50000)
        expect(control?.valid).toBe(true)
      })
    })

    describe('loanPurpose', () => {
      it('should be invalid when empty', () => {
        const control = component.financialForm.get('loanPurpose')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a value', () => {
        const control = component.financialForm.get('loanPurpose')
        control?.setValue('Business Expansion')
        expect(control?.valid).toBe(true)
      })
    })

    describe('desiredTerm', () => {
      it('should be invalid when empty', () => {
        const control = component.financialForm.get('desiredTerm')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a value', () => {
        const control = component.financialForm.get('desiredTerm')
        control?.setValue('24 months')
        expect(control?.valid).toBe(true)
      })
    })

    describe('avgMonthlyRevenue', () => {
      it('should be invalid when null', () => {
        const control = component.financialForm.get('avgMonthlyRevenue')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with zero', () => {
        const control = component.financialForm.get('avgMonthlyRevenue')
        control?.setValue(0)
        expect(control?.valid).toBe(true)
      })
    })

    describe('monthlyExpenses', () => {
      it('should be invalid when null', () => {
        const control = component.financialForm.get('monthlyExpenses')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with zero', () => {
        const control = component.financialForm.get('monthlyExpenses')
        control?.setValue(0)
        expect(control?.valid).toBe(true)
      })
    })

    describe('existingDebt', () => {
      it('should be invalid when null', () => {
        const control = component.financialForm.get('existingDebt')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with zero', () => {
        const control = component.financialForm.get('existingDebt')
        control?.setValue(0)
        expect(control?.valid).toBe(true)
      })
    })

    describe('creditScoreRange', () => {
      it('should be invalid when empty', () => {
        const control = component.financialForm.get('creditScoreRange')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a value', () => {
        const control = component.financialForm.get('creditScoreRange')
        control?.setValue('Good (700-749)')
        expect(control?.valid).toBe(true)
      })
    })
  })

  describe('Conditional Validation (hasCollateral)', () => {
    it('should not require collateral fields when hasCollateral is false', () => {
      expect(component.financialForm.get('collateralType')?.valid).toBe(true)
      expect(component.financialForm.get('collateralValue')?.valid).toBe(true)
    })

    it('should require collateralType when hasCollateral is true', () => {
      component.financialForm.get('hasCollateral')?.setValue(true)

      const control = component.financialForm.get('collateralType')
      expect(control?.valid).toBe(false)
      expect(control?.errors?.['required']).toBe(true)
    })

    it('should require collateralValue with min(1) when hasCollateral is true', () => {
      component.financialForm.get('hasCollateral')?.setValue(true)

      const control = component.financialForm.get('collateralValue')
      expect(control?.valid).toBe(false)
      expect(control?.errors?.['required']).toBe(true)

      control?.setValue(0)
      expect(control?.valid).toBe(false)
      expect(control?.errors?.['min']).toBeDefined()

      control?.setValue(1)
      expect(control?.valid).toBe(true)
    })

    it('should clear validators when hasCollateral is toggled back to false', () => {
      // Set to true first
      component.financialForm.get('hasCollateral')?.setValue(true)
      expect(component.financialForm.get('collateralType')?.errors?.['required']).toBe(true)

      // Toggle back to false
      component.financialForm.get('hasCollateral')?.setValue(false)
      expect(component.financialForm.get('collateralType')?.valid).toBe(true)
      expect(component.financialForm.get('collateralValue')?.valid).toBe(true)
    })

    it('should toggle validators back and forth correctly', () => {
      component.financialForm.get('hasCollateral')?.setValue(true)
      expect(component.financialForm.get('collateralType')?.errors?.['required']).toBe(true)

      component.financialForm.get('hasCollateral')?.setValue(false)
      expect(component.financialForm.get('collateralType')?.valid).toBe(true)

      component.financialForm.get('hasCollateral')?.setValue(true)
      expect(component.financialForm.get('collateralType')?.errors?.['required']).toBe(true)
    })

    it('should accept valid collateral fields when hasCollateral is true', () => {
      component.financialForm.get('hasCollateral')?.setValue(true)
      component.financialForm.patchValue({
        collateralType: 'Real Estate',
        collateralValue: 250000,
      })

      expect(component.financialForm.get('collateralType')?.valid).toBe(true)
      expect(component.financialForm.get('collateralValue')?.valid).toBe(true)
    })
  })

  describe('Public Methods', () => {
    describe('isFormValid', () => {
      it('should return false for invalid form', () => {
        expect(component.isFormValid()).toBe(false)
      })

      it('should return true for valid form without collateral', () => {
        component.financialForm.patchValue({
          loanAmount: 50000,
          loanPurpose: 'Business Expansion',
          desiredTerm: '24 months',
          avgMonthlyRevenue: 20000,
          monthlyExpenses: 15000,
          existingDebt: 0,
          creditScoreRange: 'Good (700-749)',
          hasCollateral: false,
        })
        expect(component.isFormValid()).toBe(true)
      })
    })

    describe('markAllAsTouched', () => {
      it('should mark all fields as touched', () => {
        component.markAllAsTouched()

        expect(component.financialForm.get('loanAmount')?.touched).toBe(true)
        expect(component.financialForm.get('loanPurpose')?.touched).toBe(true)
        expect(component.financialForm.get('desiredTerm')?.touched).toBe(true)
        expect(component.financialForm.get('avgMonthlyRevenue')?.touched).toBe(true)
        expect(component.financialForm.get('monthlyExpenses')?.touched).toBe(true)
        expect(component.financialForm.get('existingDebt')?.touched).toBe(true)
        expect(component.financialForm.get('creditScoreRange')?.touched).toBe(true)
      })
    })

    describe('getFormData', () => {
      it('should return current form values', () => {
        component.financialForm.patchValue({
          loanAmount: 75000,
          loanPurpose: 'Equipment Purchase',
        })

        const data = component.getFormData()
        expect(data.loanAmount).toBe(75000)
        expect(data.loanPurpose).toBe('Equipment Purchase')
      })
    })

    describe('isFieldInvalid', () => {
      it('should return false for untouched invalid field', () => {
        expect(component.isFieldInvalid('loanAmount')).toBe(false)
      })

      it('should return true for touched invalid field', () => {
        const control = component.financialForm.get('loanAmount')
        control?.markAsTouched()
        expect(component.isFieldInvalid('loanAmount')).toBe(true)
      })

      it('should return false for valid touched field', () => {
        const control = component.financialForm.get('loanAmount')
        control?.setValue(50000)
        control?.markAsTouched()
        expect(component.isFieldInvalid('loanAmount')).toBe(false)
      })

      it('should return false for non-existent field', () => {
        expect(component.isFieldInvalid('nonExistentField')).toBe(false)
      })
    })
  })

  describe('Form Data Integration', () => {
    it('should update wizard state when form changes', (done) => {
      component.financialForm.patchValue({
        loanAmount: 100000,
        loanPurpose: 'Working Capital',
      })

      setTimeout(() => {
        const formData = wizardState.getFormData()
        expect(formData.financialDetails.loanAmount).toBe(100000)
        expect(formData.financialDetails.loanPurpose).toBe('Working Capital')
        done()
      }, 100)
    })

    it('should load saved data on init', () => {
      wizardState.updateFormData('financialDetails', {
        loanAmount: 200000,
        loanPurpose: 'Real Estate',
      })

      const newFixture = TestBed.createComponent(FinancialDetails)
      const newComponent = newFixture.componentInstance
      newFixture.detectChanges()

      expect(newComponent.financialForm.get('loanAmount')?.value).toBe(200000)
      expect(newComponent.financialForm.get('loanPurpose')?.value).toBe('Real Estate')
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
