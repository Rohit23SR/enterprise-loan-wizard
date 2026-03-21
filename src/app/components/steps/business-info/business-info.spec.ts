import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { provideNgxMask } from 'ngx-mask'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BusinessInfo } from './business-info'
import { WizardState } from '../../../services/wizard-state'
import { AUSTRALIAN_STATES } from '../../../constants/australian-data'

describe('BusinessInfo Component', () => {
  let component: BusinessInfo
  let fixture: ComponentFixture<BusinessInfo>
  let wizardState: WizardState

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessInfo, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [WizardState, provideNgxMask()],
    }).compileComponents()

    wizardState = TestBed.inject(WizardState)
    wizardState.clearStorage()
    fixture = TestBed.createComponent(BusinessInfo)
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

    it('should initialize the form with all required fields', () => {
      expect(component.businessForm).toBeDefined()
      expect(component.businessForm.get('businessName')).toBeDefined()
      expect(component.businessForm.get('businessType')).toBeDefined()
      expect(component.businessForm.get('industry')).toBeDefined()
      expect(component.businessForm.get('yearsInBusiness')).toBeDefined()
      expect(component.businessForm.get('abn')).toBeDefined()
      expect(component.businessForm.get('annualRevenue')).toBeDefined()
      expect(component.businessForm.get('numberOfEmployees')).toBeDefined()
      expect(component.businessForm.get('businessDescription')).toBeDefined()
    })

    it('should initialize address fields', () => {
      expect(component.businessForm.get('sameAsPersonal')).toBeDefined()
      expect(component.businessForm.get('businessStreet')).toBeDefined()
      expect(component.businessForm.get('businessCity')).toBeDefined()
      expect(component.businessForm.get('businessState')).toBeDefined()
      expect(component.businessForm.get('businessPostcode')).toBeDefined()
      expect(component.businessForm.get('businessCountry')).toBeDefined()
    })

    it('should default sameAsPersonal to false', () => {
      expect(component.businessForm.get('sameAsPersonal')?.value).toBe(false)
    })

    it('should default businessCountry to AU', () => {
      expect(component.businessForm.get('businessCountry')?.value).toBe('AU')
    })

    it('should have 8 Australian states/territories from AUSTRALIAN_STATES', () => {
      expect(component.states.length).toBe(8)
      expect(component.states).toEqual(AUSTRALIAN_STATES)
    })

    it('should have Australia in countries list', () => {
      expect(component.countries.length).toBe(1)
      expect(component.countries[0].code).toBe('AU')
    })

    it('should have business types defined', () => {
      expect(component.businessTypes.length).toBeGreaterThan(0)
      expect(component.businessTypes).toContain('Sole Proprietorship')
      expect(component.businessTypes).toContain('Corporation')
    })

    it('should have industries defined', () => {
      expect(component.industries.length).toBeGreaterThan(0)
      expect(component.industries).toContain('Technology')
      expect(component.industries).toContain('Retail')
    })
  })

  describe('Form Validation', () => {
    describe('businessName', () => {
      it('should be invalid when empty', () => {
        const control = component.businessForm.get('businessName')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a value', () => {
        const control = component.businessForm.get('businessName')
        control?.setValue('Acme Corp')
        expect(control?.valid).toBe(true)
      })
    })

    describe('businessType', () => {
      it('should be invalid when empty', () => {
        const control = component.businessForm.get('businessType')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a value', () => {
        const control = component.businessForm.get('businessType')
        control?.setValue('LLC')
        expect(control?.valid).toBe(true)
      })
    })

    describe('industry', () => {
      it('should be invalid when empty', () => {
        const control = component.businessForm.get('industry')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a value', () => {
        const control = component.businessForm.get('industry')
        control?.setValue('Technology')
        expect(control?.valid).toBe(true)
      })
    })

    describe('yearsInBusiness', () => {
      it('should be invalid when null', () => {
        const control = component.businessForm.get('yearsInBusiness')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a non-negative value', () => {
        const control = component.businessForm.get('yearsInBusiness')
        control?.setValue(5)
        expect(control?.valid).toBe(true)
      })

      it('should be valid with zero', () => {
        const control = component.businessForm.get('yearsInBusiness')
        control?.setValue(0)
        expect(control?.valid).toBe(true)
      })
    })

    describe('abn', () => {
      it('should be invalid when empty', () => {
        const control = component.businessForm.get('abn')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be invalid when less than 11 characters', () => {
        const control = component.businessForm.get('abn')
        control?.setValue('1234567890')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['minlength']).toBeDefined()
      })

      it('should be valid with exactly 11 characters', () => {
        const control = component.businessForm.get('abn')
        control?.setValue('12345678901')
        expect(control?.valid).toBe(true)
      })
    })

    describe('annualRevenue', () => {
      it('should be invalid when null', () => {
        const control = component.businessForm.get('annualRevenue')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a non-negative value', () => {
        const control = component.businessForm.get('annualRevenue')
        control?.setValue(500000)
        expect(control?.valid).toBe(true)
      })
    })

    describe('numberOfEmployees', () => {
      it('should be invalid when null', () => {
        const control = component.businessForm.get('numberOfEmployees')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with a non-negative value', () => {
        const control = component.businessForm.get('numberOfEmployees')
        control?.setValue(10)
        expect(control?.valid).toBe(true)
      })
    })

    describe('businessDescription', () => {
      it('should be invalid when empty', () => {
        const control = component.businessForm.get('businessDescription')
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['required']).toBe(true)
      })

      it('should be valid with text within 500 characters', () => {
        const control = component.businessForm.get('businessDescription')
        control?.setValue('A small technology startup providing SaaS solutions.')
        expect(control?.valid).toBe(true)
      })

      it('should be invalid when exceeding 500 characters', () => {
        const control = component.businessForm.get('businessDescription')
        control?.setValue('A'.repeat(501))
        expect(control?.valid).toBe(false)
        expect(control?.errors?.['maxlength']).toBeDefined()
      })

      it('should be valid at exactly 500 characters', () => {
        const control = component.businessForm.get('businessDescription')
        control?.setValue('A'.repeat(500))
        expect(control?.valid).toBe(true)
      })
    })
  })

  describe('Conditional Validation (sameAsPersonal)', () => {
    it('should not require address fields initially (no validators set until toggle)', () => {
      // Initially sameAsPersonal is false, but validators are not set until
      // the valueChanges fires. The form initializes without validators on address fields.
      const street = component.businessForm.get('businessStreet')
      const city = component.businessForm.get('businessCity')
      const state = component.businessForm.get('businessState')
      const postcode = component.businessForm.get('businessPostcode')

      // Address fields start with no validators in initializeForm
      expect(street?.valid).toBe(true)
      expect(city?.valid).toBe(true)
      expect(state?.valid).toBe(true)
      expect(postcode?.valid).toBe(true)
    })

    it('should add required validators to address fields when sameAsPersonal is set to false', () => {
      component.businessForm.get('sameAsPersonal')?.setValue(false)

      const street = component.businessForm.get('businessStreet')
      const city = component.businessForm.get('businessCity')
      const state = component.businessForm.get('businessState')
      const postcode = component.businessForm.get('businessPostcode')
      const country = component.businessForm.get('businessCountry')

      expect(street?.valid).toBe(false)
      expect(street?.errors?.['required']).toBe(true)
      expect(city?.valid).toBe(false)
      expect(city?.errors?.['required']).toBe(true)
      expect(state?.valid).toBe(false)
      expect(state?.errors?.['required']).toBe(true)
      expect(postcode?.valid).toBe(false)
      expect(postcode?.errors?.['required']).toBe(true)
      // businessCountry already has 'AU' so it passes required
      expect(country?.valid).toBe(true)
    })

    it('should clear validators on address fields when sameAsPersonal is true', () => {
      // First set to false to add validators
      component.businessForm.get('sameAsPersonal')?.setValue(false)
      expect(component.businessForm.get('businessStreet')?.errors?.['required']).toBe(true)

      // Then set to true to clear validators
      component.businessForm.get('sameAsPersonal')?.setValue(true)
      expect(component.businessForm.get('businessStreet')?.valid).toBe(true)
      expect(component.businessForm.get('businessCity')?.valid).toBe(true)
      expect(component.businessForm.get('businessState')?.valid).toBe(true)
      expect(component.businessForm.get('businessPostcode')?.valid).toBe(true)
      expect(component.businessForm.get('businessCountry')?.valid).toBe(true)
    })

    it('should toggle validators back and forth correctly', () => {
      // Toggle to false
      component.businessForm.get('sameAsPersonal')?.setValue(false)
      expect(component.businessForm.get('businessStreet')?.errors?.['required']).toBe(true)

      // Toggle to true
      component.businessForm.get('sameAsPersonal')?.setValue(true)
      expect(component.businessForm.get('businessStreet')?.valid).toBe(true)

      // Toggle back to false
      component.businessForm.get('sameAsPersonal')?.setValue(false)
      expect(component.businessForm.get('businessStreet')?.errors?.['required']).toBe(true)
    })

    it('should allow address fields to be valid when filled and sameAsPersonal is false', () => {
      component.businessForm.get('sameAsPersonal')?.setValue(false)

      component.businessForm.patchValue({
        businessStreet: '123 Business Rd',
        businessCity: 'Sydney',
        businessState: 'NSW',
        businessPostcode: '2000',
        businessCountry: 'AU',
      })

      expect(component.businessForm.get('businessStreet')?.valid).toBe(true)
      expect(component.businessForm.get('businessCity')?.valid).toBe(true)
      expect(component.businessForm.get('businessState')?.valid).toBe(true)
      expect(component.businessForm.get('businessPostcode')?.valid).toBe(true)
      expect(component.businessForm.get('businessCountry')?.valid).toBe(true)
    })
  })

  describe('Public Methods', () => {
    describe('isFormValid', () => {
      it('should return false for invalid form', () => {
        expect(component.isFormValid()).toBe(false)
      })

      it('should return true for valid form with sameAsPersonal true', () => {
        component.businessForm.get('sameAsPersonal')?.setValue(true)
        component.businessForm.patchValue({
          businessName: 'Acme Corp',
          businessType: 'LLC',
          industry: 'Technology',
          yearsInBusiness: 5,
          abn: '12345678901',
          annualRevenue: 500000,
          numberOfEmployees: 10,
          businessDescription: 'A technology company.',
        })
        expect(component.isFormValid()).toBe(true)
      })
    })

    describe('markAllAsTouched', () => {
      it('should mark all fields as touched', () => {
        component.markAllAsTouched()

        expect(component.businessForm.get('businessName')?.touched).toBe(true)
        expect(component.businessForm.get('businessType')?.touched).toBe(true)
        expect(component.businessForm.get('industry')?.touched).toBe(true)
        expect(component.businessForm.get('yearsInBusiness')?.touched).toBe(true)
        expect(component.businessForm.get('abn')?.touched).toBe(true)
        expect(component.businessForm.get('annualRevenue')?.touched).toBe(true)
        expect(component.businessForm.get('numberOfEmployees')?.touched).toBe(true)
        expect(component.businessForm.get('businessDescription')?.touched).toBe(true)
      })
    })

    describe('getFormData', () => {
      it('should return current form values', () => {
        component.businessForm.patchValue({
          businessName: 'Test Corp',
          industry: 'Retail',
        })

        const data = component.getFormData()
        expect(data.businessName).toBe('Test Corp')
        expect(data.industry).toBe('Retail')
      })
    })

    describe('getCharCount', () => {
      it('should return 0 when description is empty', () => {
        expect(component.getCharCount()).toBe(0)
      })

      it('should return correct count when description has text', () => {
        component.businessForm.get('businessDescription')?.setValue('Hello World')
        expect(component.getCharCount()).toBe(11)
      })
    })

    describe('isFieldInvalid', () => {
      it('should return false for untouched invalid field', () => {
        expect(component.isFieldInvalid('businessName')).toBe(false)
      })

      it('should return true for touched invalid field', () => {
        const control = component.businessForm.get('businessName')
        control?.markAsTouched()
        expect(component.isFieldInvalid('businessName')).toBe(true)
      })

      it('should return false for valid touched field', () => {
        const control = component.businessForm.get('businessName')
        control?.setValue('Acme Corp')
        control?.markAsTouched()
        expect(component.isFieldInvalid('businessName')).toBe(false)
      })

      it('should return false for non-existent field', () => {
        expect(component.isFieldInvalid('nonExistentField')).toBe(false)
      })
    })
  })

  describe('Form Data Integration', () => {
    it('should update wizard state when form changes', (done) => {
      component.businessForm.patchValue({
        businessName: 'Integration Corp',
        industry: 'Manufacturing',
      })

      setTimeout(() => {
        const formData = wizardState.getFormData()
        expect(formData.businessInfo.businessName).toBe('Integration Corp')
        expect(formData.businessInfo.industry).toBe('Manufacturing')
        done()
      }, 100)
    })

    it('should load saved data on init', () => {
      wizardState.updateFormData('businessInfo', {
        businessName: 'Saved Corp',
        industry: 'Healthcare',
      })

      const newFixture = TestBed.createComponent(BusinessInfo)
      const newComponent = newFixture.componentInstance
      newFixture.detectChanges()

      expect(newComponent.businessForm.get('businessName')?.value).toBe('Saved Corp')
      expect(newComponent.businessForm.get('industry')?.value).toBe('Healthcare')
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
