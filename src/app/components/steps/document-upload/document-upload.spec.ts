import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DocumentUpload } from './document-upload'
import { WizardState } from '../../../services/wizard-state'

describe('DocumentUpload Component', () => {
  let component: DocumentUpload
  let fixture: ComponentFixture<DocumentUpload>
  let wizardState: WizardState

  const createMockFile = (name: string = 'test.pdf', size: number = 1024): File => {
    const content = 'x'.repeat(size)
    return new File([content], name, { type: 'application/pdf' })
  }

  const createMockFileEvent = (files: File[]): Event => {
    return {
      target: {
        files: files,
        value: 'C:\\fakepath\\test.pdf',
      },
    } as unknown as Event
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentUpload, ReactiveFormsModule, BrowserAnimationsModule],
      providers: [WizardState],
    }).compileComponents()

    wizardState = TestBed.inject(WizardState)
    wizardState.clearStorage()
    fixture = TestBed.createComponent(DocumentUpload)
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

    it('should initialize the document form', () => {
      expect(component.documentForm).toBeDefined()
      expect(component.documentForm.get('governmentId')).toBeDefined()
      expect(component.documentForm.get('businessRegistration')).toBeDefined()
      expect(component.documentForm.get('bankStatements')).toBeDefined()
      expect(component.documentForm.get('taxReturns')).toBeDefined()
      expect(component.documentForm.get('additionalDocs')).toBeDefined()
    })

    it('should initialize file arrays as empty', () => {
      expect(component.governmentIdFiles).toEqual([])
      expect(component.businessRegistrationFiles).toEqual([])
      expect(component.bankStatementFiles).toEqual([])
      expect(component.taxReturnFiles).toEqual([])
      expect(component.additionalFiles).toEqual([])
    })

    it('should have additionalDocs as optional (no required validator)', () => {
      const control = component.documentForm.get('additionalDocs')
      // additionalDocs has no Validators.required
      control?.setValue(null)
      expect(control?.errors?.['required']).toBeUndefined()
    })
  })

  describe('onFileSelected', () => {
    it('should add files to governmentIdFiles', () => {
      const file = createMockFile('id.pdf')
      const event = createMockFileEvent([file])
      component.onFileSelected(event, 'governmentId')

      expect(component.governmentIdFiles.length).toBe(1)
      expect(component.governmentIdFiles[0].name).toBe('id.pdf')
    })

    it('should add files to businessRegistrationFiles', () => {
      const file = createMockFile('registration.pdf')
      const event = createMockFileEvent([file])
      component.onFileSelected(event, 'businessRegistration')

      expect(component.businessRegistrationFiles.length).toBe(1)
      expect(component.businessRegistrationFiles[0].name).toBe('registration.pdf')
    })

    it('should add files to bankStatementFiles', () => {
      const file = createMockFile('statement.pdf')
      const event = createMockFileEvent([file])
      component.onFileSelected(event, 'bankStatements')

      expect(component.bankStatementFiles.length).toBe(1)
      expect(component.bankStatementFiles[0].name).toBe('statement.pdf')
    })

    it('should add files to taxReturnFiles', () => {
      const file = createMockFile('tax.pdf')
      const event = createMockFileEvent([file])
      component.onFileSelected(event, 'taxReturns')

      expect(component.taxReturnFiles.length).toBe(1)
      expect(component.taxReturnFiles[0].name).toBe('tax.pdf')
    })

    it('should add files to additionalFiles', () => {
      const file = createMockFile('extra.pdf')
      const event = createMockFileEvent([file])
      component.onFileSelected(event, 'additionalDocs')

      expect(component.additionalFiles.length).toBe(1)
      expect(component.additionalFiles[0].name).toBe('extra.pdf')
    })

    it('should append to existing files rather than replace', () => {
      const file1 = createMockFile('id1.pdf')
      const file2 = createMockFile('id2.pdf')

      component.onFileSelected(createMockFileEvent([file1]), 'governmentId')
      component.onFileSelected(createMockFileEvent([file2]), 'governmentId')

      expect(component.governmentIdFiles.length).toBe(2)
      expect(component.governmentIdFiles[0].name).toBe('id1.pdf')
      expect(component.governmentIdFiles[1].name).toBe('id2.pdf')
    })

    it('should handle multiple files in a single event', () => {
      const file1 = createMockFile('stmt1.pdf')
      const file2 = createMockFile('stmt2.pdf')
      const file3 = createMockFile('stmt3.pdf')

      component.onFileSelected(createMockFileEvent([file1, file2, file3]), 'bankStatements')

      expect(component.bankStatementFiles.length).toBe(3)
    })

    it('should not add files when input has no files', () => {
      const input = document.createElement('input')
      input.type = 'file'
      const event = { target: input } as unknown as Event

      component.onFileSelected(event, 'governmentId')
      expect(component.governmentIdFiles.length).toBe(0)
    })
  })

  describe('removeFile', () => {
    it('should remove file from governmentIdFiles at correct index', () => {
      const file1 = createMockFile('id1.pdf')
      const file2 = createMockFile('id2.pdf')
      component.onFileSelected(createMockFileEvent([file1, file2]), 'governmentId')

      component.removeFile('governmentId', 0)

      expect(component.governmentIdFiles.length).toBe(1)
      expect(component.governmentIdFiles[0].name).toBe('id2.pdf')
    })

    it('should remove file from businessRegistrationFiles', () => {
      const file = createMockFile('reg.pdf')
      component.onFileSelected(createMockFileEvent([file]), 'businessRegistration')

      component.removeFile('businessRegistration', 0)

      expect(component.businessRegistrationFiles.length).toBe(0)
    })

    it('should remove file from bankStatementFiles', () => {
      const file1 = createMockFile('stmt1.pdf')
      const file2 = createMockFile('stmt2.pdf')
      component.onFileSelected(createMockFileEvent([file1, file2]), 'bankStatements')

      component.removeFile('bankStatements', 1)

      expect(component.bankStatementFiles.length).toBe(1)
      expect(component.bankStatementFiles[0].name).toBe('stmt1.pdf')
    })

    it('should remove file from taxReturnFiles', () => {
      const file = createMockFile('tax.pdf')
      component.onFileSelected(createMockFileEvent([file]), 'taxReturns')

      component.removeFile('taxReturns', 0)

      expect(component.taxReturnFiles.length).toBe(0)
    })

    it('should remove file from additionalFiles', () => {
      const file = createMockFile('extra.pdf')
      component.onFileSelected(createMockFileEvent([file]), 'additionalDocs')

      component.removeFile('additionalDocs', 0)

      expect(component.additionalFiles.length).toBe(0)
    })

    it('should remove the correct file from the middle of the array', () => {
      const file1 = createMockFile('a.pdf')
      const file2 = createMockFile('b.pdf')
      const file3 = createMockFile('c.pdf')
      component.onFileSelected(createMockFileEvent([file1, file2, file3]), 'governmentId')

      component.removeFile('governmentId', 1)

      expect(component.governmentIdFiles.length).toBe(2)
      expect(component.governmentIdFiles[0].name).toBe('a.pdf')
      expect(component.governmentIdFiles[1].name).toBe('c.pdf')
    })
  })

  describe('isFormValid', () => {
    it('should return false when governmentId is empty', () => {
      expect(component.isFormValid()).toBe(false)
    })

    it('should return false when bankStatements has fewer than 3 files', () => {
      component.onFileSelected(createMockFileEvent([createMockFile('id.pdf')]), 'governmentId')
      component.onFileSelected(
        createMockFileEvent([createMockFile('reg.pdf')]),
        'businessRegistration'
      )
      component.onFileSelected(
        createMockFileEvent([createMockFile('stmt1.pdf'), createMockFile('stmt2.pdf')]),
        'bankStatements'
      )
      component.onFileSelected(
        createMockFileEvent([createMockFile('tax1.pdf'), createMockFile('tax2.pdf')]),
        'taxReturns'
      )

      expect(component.isFormValid()).toBe(false)
    })

    it('should return false when taxReturns has fewer than 2 files', () => {
      component.onFileSelected(createMockFileEvent([createMockFile('id.pdf')]), 'governmentId')
      component.onFileSelected(
        createMockFileEvent([createMockFile('reg.pdf')]),
        'businessRegistration'
      )
      component.onFileSelected(
        createMockFileEvent([
          createMockFile('stmt1.pdf'),
          createMockFile('stmt2.pdf'),
          createMockFile('stmt3.pdf'),
        ]),
        'bankStatements'
      )
      component.onFileSelected(createMockFileEvent([createMockFile('tax1.pdf')]), 'taxReturns')

      expect(component.isFormValid()).toBe(false)
    })

    it('should return false when businessRegistration is empty', () => {
      component.onFileSelected(createMockFileEvent([createMockFile('id.pdf')]), 'governmentId')
      // no businessRegistration
      component.onFileSelected(
        createMockFileEvent([
          createMockFile('stmt1.pdf'),
          createMockFile('stmt2.pdf'),
          createMockFile('stmt3.pdf'),
        ]),
        'bankStatements'
      )
      component.onFileSelected(
        createMockFileEvent([createMockFile('tax1.pdf'), createMockFile('tax2.pdf')]),
        'taxReturns'
      )

      expect(component.isFormValid()).toBe(false)
    })

    it('should return true when all minimum requirements are met', () => {
      component.onFileSelected(createMockFileEvent([createMockFile('id.pdf')]), 'governmentId')
      component.onFileSelected(
        createMockFileEvent([createMockFile('reg.pdf')]),
        'businessRegistration'
      )
      component.onFileSelected(
        createMockFileEvent([
          createMockFile('stmt1.pdf'),
          createMockFile('stmt2.pdf'),
          createMockFile('stmt3.pdf'),
        ]),
        'bankStatements'
      )
      component.onFileSelected(
        createMockFileEvent([createMockFile('tax1.pdf'), createMockFile('tax2.pdf')]),
        'taxReturns'
      )

      expect(component.isFormValid()).toBe(true)
    })

    it('should return true without additional docs (optional)', () => {
      component.onFileSelected(createMockFileEvent([createMockFile('id.pdf')]), 'governmentId')
      component.onFileSelected(
        createMockFileEvent([createMockFile('reg.pdf')]),
        'businessRegistration'
      )
      component.onFileSelected(
        createMockFileEvent([
          createMockFile('s1.pdf'),
          createMockFile('s2.pdf'),
          createMockFile('s3.pdf'),
        ]),
        'bankStatements'
      )
      component.onFileSelected(
        createMockFileEvent([createMockFile('t1.pdf'), createMockFile('t2.pdf')]),
        'taxReturns'
      )

      // No additional docs added
      expect(component.additionalFiles.length).toBe(0)
      expect(component.isFormValid()).toBe(true)
    })
  })

  describe('formatFileSize', () => {
    it('should return "0 Bytes" for 0', () => {
      expect(component.formatFileSize(0)).toBe('0 Bytes')
    })

    it('should format bytes correctly for 1024 bytes (1 KB)', () => {
      expect(component.formatFileSize(1024)).toBe('1 KB')
    })

    it('should format megabytes correctly for 1048576 bytes (1 MB)', () => {
      expect(component.formatFileSize(1048576)).toBe('1 MB')
    })

    it('should format with decimal precision', () => {
      expect(component.formatFileSize(1536)).toBe('1.5 KB')
    })

    it('should handle small byte values', () => {
      expect(component.formatFileSize(500)).toBe('500 Bytes')
    })
  })

  describe('Public Methods', () => {
    describe('getFormData', () => {
      it('should return file arrays', () => {
        const file = createMockFile('test.pdf')
        component.onFileSelected(createMockFileEvent([file]), 'governmentId')

        const data = component.getFormData()
        expect(data.governmentId.length).toBe(1)
        expect(data.governmentId[0].name).toBe('test.pdf')
        expect(data.businessRegistration).toEqual([])
        expect(data.bankStatements).toEqual([])
        expect(data.taxReturns).toEqual([])
        expect(data.additionalDocs).toEqual([])
      })
    })

    describe('markAllAsTouched', () => {
      it('should mark all form fields as touched', () => {
        component.markAllAsTouched()

        expect(component.documentForm.get('governmentId')?.touched).toBe(true)
        expect(component.documentForm.get('businessRegistration')?.touched).toBe(true)
        expect(component.documentForm.get('bankStatements')?.touched).toBe(true)
        expect(component.documentForm.get('taxReturns')?.touched).toBe(true)
        expect(component.documentForm.get('additionalDocs')?.touched).toBe(true)
      })
    })

    describe('isFieldInvalid', () => {
      it('should return false for untouched field', () => {
        expect(component.isFieldInvalid('governmentId')).toBe(false)
      })

      it('should return true for touched invalid field', () => {
        component.documentForm.get('governmentId')?.markAsTouched()
        expect(component.isFieldInvalid('governmentId')).toBe(true)
      })

      it('should return false for touched valid field', () => {
        component.onFileSelected(createMockFileEvent([createMockFile()]), 'governmentId')
        component.documentForm.get('governmentId')?.markAsTouched()
        expect(component.isFieldInvalid('governmentId')).toBe(false)
      })
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
