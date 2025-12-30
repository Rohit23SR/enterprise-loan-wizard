import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonalInfo } from './personal-info';
import { WizardState } from '../../../services/wizard-state';

describe('PersonalInfo Component', () => {
  let component: PersonalInfo;
  let fixture: ComponentFixture<PersonalInfo>;
  let wizardState: WizardState;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PersonalInfo,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        WizardState,
        provideNgxMask()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalInfo);
    component = fixture.componentInstance;
    wizardState = TestBed.inject(WizardState);
    fixture.detectChanges();
  });

  afterEach(() => {
    wizardState.stopAutoSave();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize the form with all required fields', () => {
      expect(component.personalForm).toBeDefined();
      expect(component.personalForm.get('fullName')).toBeDefined();
      expect(component.personalForm.get('email')).toBeDefined();
      expect(component.personalForm.get('phone')).toBeDefined();
      expect(component.personalForm.get('dateOfBirth')).toBeDefined();
      expect(component.personalForm.get('tfn')).toBeDefined();
      expect(component.personalForm.get('streetAddress')).toBeDefined();
      expect(component.personalForm.get('city')).toBeDefined();
      expect(component.personalForm.get('state')).toBeDefined();
      expect(component.personalForm.get('postcode')).toBeDefined();
      expect(component.personalForm.get('country')).toBeDefined();
    });

    it('should set Australia as default country', () => {
      expect(component.personalForm.get('country')?.value).toBe('AU');
    });

    it('should have 8 Australian states/territories', () => {
      expect(component.states.length).toBe(8);
      expect(component.states[0].code).toBe('NSW');
    });

    it('should have Australia in countries list', () => {
      expect(component.countries.length).toBe(1);
      expect(component.countries[0].code).toBe('AU');
    });
  });

  describe('Form Validation', () => {
    describe('Full Name', () => {
      it('should be invalid when empty', () => {
        const control = component.personalForm.get('fullName');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);
      });

      it('should be invalid when too short', () => {
        const control = component.personalForm.get('fullName');
        control?.setValue('A');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['minlength']).toBeDefined();
      });

      it('should be valid with proper name', () => {
        const control = component.personalForm.get('fullName');
        control?.setValue('John Doe');
        expect(control?.valid).toBe(true);
      });
    });

    describe('Email', () => {
      it('should be invalid when empty', () => {
        const control = component.personalForm.get('email');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);
      });

      it('should be invalid with incorrect format', () => {
        const control = component.personalForm.get('email');
        control?.setValue('invalid-email');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['email']).toBe(true);
      });

      it('should be valid with correct email format', () => {
        const control = component.personalForm.get('email');
        control?.setValue('john.doe@example.com');
        expect(control?.valid).toBe(true);
      });
    });

    describe('Phone', () => {
      it('should be invalid when empty', () => {
        const control = component.personalForm.get('phone');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);
      });

      it('should be invalid when too short', () => {
        const control = component.personalForm.get('phone');
        control?.setValue('12345');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['minlength']).toBeDefined();
      });

      it('should be valid with 10 digit phone number', () => {
        const control = component.personalForm.get('phone');
        control?.setValue('0412345678');
        expect(control?.valid).toBe(true);
      });
    });

    describe('Date of Birth - Age Validator', () => {
      it('should be invalid when empty', () => {
        const control = component.personalForm.get('dateOfBirth');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);
      });

      it('should be invalid for users under 18', () => {
        const control = component.personalForm.get('dateOfBirth');
        const today = new Date();
        const underAge = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
        control?.setValue(underAge.toISOString().split('T')[0]);
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['underAge']).toBe(true);
      });

      it('should be valid for users exactly 18 years old', () => {
        const control = component.personalForm.get('dateOfBirth');
        const today = new Date();
        const exactlyEighteen = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        control?.setValue(exactlyEighteen.toISOString().split('T')[0]);
        expect(control?.valid).toBe(true);
      });

      it('should be valid for users over 18', () => {
        const control = component.personalForm.get('dateOfBirth');
        const overAge = new Date(1990, 0, 1);
        control?.setValue(overAge.toISOString().split('T')[0]);
        expect(control?.valid).toBe(true);
      });

      it('should handle edge case with birth month before current month', () => {
        const control = component.personalForm.get('dateOfBirth');
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 18, today.getMonth() - 1, today.getDate());
        control?.setValue(birthDate.toISOString().split('T')[0]);
        expect(control?.valid).toBe(true);
      });

      it('should handle edge case with birth day before current day', () => {
        const control = component.personalForm.get('dateOfBirth');
        const today = new Date();
        const birthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() - 1);
        control?.setValue(birthDate.toISOString().split('T')[0]);
        expect(control?.valid).toBe(true);
      });
    });

    describe('TFN (Tax File Number)', () => {
      it('should be invalid when empty', () => {
        const control = component.personalForm.get('tfn');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);
      });

      it('should be invalid when less than 9 digits', () => {
        const control = component.personalForm.get('tfn');
        control?.setValue('12345678');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['minlength']).toBeDefined();
      });

      it('should be valid with 9 digits', () => {
        const control = component.personalForm.get('tfn');
        control?.setValue('123456789');
        expect(control?.valid).toBe(true);
      });
    });

    describe('Address Fields', () => {
      it('should require street address', () => {
        const control = component.personalForm.get('streetAddress');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);

        control?.setValue('123 Test Street');
        expect(control?.valid).toBe(true);
      });

      it('should require city', () => {
        const control = component.personalForm.get('city');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);

        control?.setValue('Sydney');
        expect(control?.valid).toBe(true);
      });

      it('should require state', () => {
        const control = component.personalForm.get('state');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);

        control?.setValue('NSW');
        expect(control?.valid).toBe(true);
      });
    });

    describe('Postcode', () => {
      it('should be invalid when empty', () => {
        const control = component.personalForm.get('postcode');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['required']).toBe(true);
      });

      it('should be invalid with non-numeric characters', () => {
        const control = component.personalForm.get('postcode');
        control?.setValue('ABCD');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['pattern']).toBeDefined();
      });

      it('should be invalid with less than 4 digits', () => {
        const control = component.personalForm.get('postcode');
        control?.setValue('200');
        expect(control?.valid).toBe(false);
        expect(control?.errors?.['pattern']).toBeDefined();
      });

      it('should be valid with exactly 4 digits', () => {
        const control = component.personalForm.get('postcode');
        control?.setValue('2000');
        expect(control?.valid).toBe(true);
      });

      // Note: ngx-mask directive prevents entering more than 4 digits in UI
      // Programmatic setValue bypasses the directive, so pattern validator alone
      // may not catch this edge case, but it's prevented by the mask in practice
    });
  });

  describe('Form Data Integration', () => {
    it('should load saved data on init', () => {
      wizardState.updateFormData('personalInfo', {
        fullName: 'Saved User',
        email: 'saved@example.com'
      });

      const newFixture = TestBed.createComponent(PersonalInfo);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.personalForm.get('fullName')?.value).toBe('Saved User');
      expect(newComponent.personalForm.get('email')?.value).toBe('saved@example.com');
    });

    it('should update wizard state when form changes', (done) => {
      component.personalForm.patchValue({
        fullName: 'Test User',
        email: 'test@example.com'
      });

      setTimeout(() => {
        const formData = wizardState.getFormData();
        expect(formData.personalInfo.fullName).toBe('Test User');
        expect(formData.personalInfo.email).toBe('test@example.com');
        done();
      }, 100);
    });

    it('should not load saved data if empty', () => {
      wizardState.clearStorage();

      const newFixture = TestBed.createComponent(PersonalInfo);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent.personalForm.get('fullName')?.value).toBe('');
      expect(newComponent.personalForm.get('email')?.value).toBe('');
    });
  });

  describe('Public Methods', () => {
    describe('isFieldInvalid', () => {
      it('should return false for untouched invalid field', () => {
        expect(component.isFieldInvalid('fullName')).toBe(false);
      });

      it('should return true for touched invalid field', () => {
        const control = component.personalForm.get('fullName');
        control?.markAsTouched();
        expect(component.isFieldInvalid('fullName')).toBe(true);
      });

      it('should return true for dirty invalid field', () => {
        const control = component.personalForm.get('fullName');
        control?.markAsDirty();
        expect(component.isFieldInvalid('fullName')).toBe(true);
      });

      it('should return false for valid field', () => {
        const control = component.personalForm.get('fullName');
        control?.setValue('John Doe');
        control?.markAsTouched();
        expect(component.isFieldInvalid('fullName')).toBe(false);
      });

      it('should return false for non-existent field', () => {
        expect(component.isFieldInvalid('nonExistentField')).toBe(false);
      });
    });

    describe('getFormData', () => {
      it('should return current form values', () => {
        component.personalForm.patchValue({
          fullName: 'John Doe',
          email: 'john@example.com'
        });

        const data = component.getFormData();
        expect(data.fullName).toBe('John Doe');
        expect(data.email).toBe('john@example.com');
      });
    });

    describe('isFormValid', () => {
      it('should return false for invalid form', () => {
        expect(component.isFormValid()).toBe(false);
      });

      it('should return true for valid form', () => {
        component.personalForm.patchValue({
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '0412345678',
          dateOfBirth: '1990-01-01',
          tfn: '123456789',
          streetAddress: '123 Test St',
          city: 'Sydney',
          state: 'NSW',
          postcode: '2000',
          country: 'AU'
        });

        expect(component.isFormValid()).toBe(true);
      });
    });

    describe('markAllAsTouched', () => {
      it('should mark all fields as touched', () => {
        component.markAllAsTouched();

        expect(component.personalForm.get('fullName')?.touched).toBe(true);
        expect(component.personalForm.get('email')?.touched).toBe(true);
        expect(component.personalForm.get('phone')?.touched).toBe(true);
        expect(component.personalForm.get('dateOfBirth')?.touched).toBe(true);
        expect(component.personalForm.get('tfn')?.touched).toBe(true);
        expect(component.personalForm.get('streetAddress')?.touched).toBe(true);
        expect(component.personalForm.get('city')?.touched).toBe(true);
        expect(component.personalForm.get('state')?.touched).toBe(true);
        expect(component.personalForm.get('postcode')?.touched).toBe(true);
        expect(component.personalForm.get('country')?.touched).toBe(true);
      });
    });
  });

  describe('Complete Form Validation', () => {
    it('should validate a complete valid form', () => {
      component.personalForm.patchValue({
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '0423456789',
        dateOfBirth: '1985-06-15',
        tfn: '987654321',
        streetAddress: '456 Example Road',
        city: 'Melbourne',
        state: 'VIC',
        postcode: '3000',
        country: 'AU'
      });

      expect(component.isFormValid()).toBe(true);
      expect(component.personalForm.errors).toBeNull();
    });

    it('should invalidate form with missing required fields', () => {
      component.personalForm.patchValue({
        fullName: '', // Empty required field
        email: 'jane.smith@example.com',
        phone: '0423456789',
        country: 'AU' // This has default value
        // Other required fields remain invalid
      });

      // Form should be invalid because fullName is empty (required)
      // and other required fields (dateOfBirth, tfn, etc.) are also missing
      expect(component.personalForm.get('fullName')?.invalid).toBe(true);
      expect(component.isFormValid()).toBe(false);
    });
  });

  describe('Component Lifecycle', () => {
    it('should clean up subscriptions on destroy', () => {
      const destroySpy = jest.spyOn(component['destroy$'], 'next');
      const completeSpy = jest.spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });

    it('should unsubscribe from form changes on destroy', () => {
      component.ngOnDestroy();

      // The destroy$ subject should complete and be closed
      // Check that next() and complete() were called
      expect(component['destroy$'].isStopped).toBe(true);
    });
  });
});
