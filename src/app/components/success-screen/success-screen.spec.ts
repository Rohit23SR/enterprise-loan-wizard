import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { ActivatedRoute, Router } from '@angular/router'
import { of, Subject } from 'rxjs'
import { SuccessScreen } from './success-screen'
import { SUBMITTED_APP_STORAGE_KEY } from '../../constants/wizard-config'

jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    internal: { pageSize: { getWidth: () => 210 } },
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    text: jest.fn(),
    setFont: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
  })),
}))

const mockSubmittedData = {
  personalInfo: {
    fullName: 'John Smith',
    email: 'john@example.com',
    phone: '0412345678',
    dateOfBirth: '1990-01-15',
    streetAddress: '123 Main St',
    city: 'Sydney',
    state: 'NSW',
    postcode: '2000',
    country: 'Australia',
  },
  businessInfo: {
    businessName: 'Smith Enterprises',
    businessType: 'Pty Ltd',
    industry: 'Technology',
    yearsInBusiness: 5,
    abn: '12345678901',
    annualRevenue: 500000,
    numberOfEmployees: 10,
  },
  financialDetails: {
    loanAmount: 100000,
    loanPurpose: 'Business Expansion',
    desiredTerm: '5 years',
    avgMonthlyRevenue: 41000,
    monthlyExpenses: 30000,
    existingDebt: 20000,
    creditScoreRange: '700-749',
    hasCollateral: false,
  },
  documents: {
    governmentId: [{ name: 'id.pdf' }],
    businessRegistration: [{ name: 'reg.pdf' }],
    bankStatements: [{ name: 'bs1.pdf' }, { name: 'bs2.pdf' }, { name: 'bs3.pdf' }],
    taxReturns: [{ name: 'tax1.pdf' }, { name: 'tax2.pdf' }],
  },
  review: { agreed: true },
  referenceNumber: 'LN-2026-1234',
  submittedDate: '2026-03-21T10:00:00.000Z',
}

describe('SuccessScreen Component', () => {
  let component: SuccessScreen
  let fixture: ComponentFixture<SuccessScreen>
  let mockRouter: { navigate: jest.Mock }
  let queryParamsSubject: Subject<Record<string, string>>
  let getItemSpy: jest.SpyInstance

  function createComponent(queryParams: Record<string, string> = { ref: 'LN-2026-1234' }) {
    queryParamsSubject = new Subject<Record<string, string>>()

    mockRouter = { navigate: jest.fn() }

    TestBed.configureTestingModule({
      imports: [SuccessScreen, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: queryParamsSubject.asObservable() },
        },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(SuccessScreen)
    component = fixture.componentInstance
    fixture.detectChanges()

    // Emit query params after component subscribes
    queryParamsSubject.next(queryParams)
    fixture.detectChanges()
  }

  beforeEach(() => {
    getItemSpy = jest.spyOn(Storage.prototype, 'getItem')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Component Creation', () => {
    it('should create the component', () => {
      getItemSpy.mockReturnValue(null)
      createComponent()

      expect(component).toBeTruthy()
    })

    it('should initialize referenceNumber as empty string before ngOnInit', () => {
      getItemSpy.mockReturnValue(null)

      TestBed.configureTestingModule({
        imports: [SuccessScreen, NoopAnimationsModule],
        providers: [
          { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
          { provide: Router, useValue: { navigate: jest.fn() } },
        ],
      }).compileComponents()

      const f = TestBed.createComponent(SuccessScreen)
      const c = f.componentInstance
      expect(c.referenceNumber).toBe('')
    })

    it('should initialize pdfError as false', () => {
      getItemSpy.mockReturnValue(null)
      createComponent()

      expect(component.pdfError).toBe(false)
    })
  })

  describe('Query Parameter Handling', () => {
    it('should read ref query param and set referenceNumber', () => {
      getItemSpy.mockReturnValue(null)
      createComponent({ ref: 'LN-2026-9999' })

      expect(component.referenceNumber).toBe('LN-2026-9999')
    })

    it('should fall back to N/A when no ref param is present', () => {
      getItemSpy.mockReturnValue(null)
      createComponent({})

      expect(component.referenceNumber).toBe('N/A')
    })

    it('should update referenceNumber when query params change', () => {
      getItemSpy.mockReturnValue(null)
      createComponent({ ref: 'LN-2026-1111' })

      expect(component.referenceNumber).toBe('LN-2026-1111')

      queryParamsSubject.next({ ref: 'LN-2026-2222' })
      fixture.detectChanges()

      expect(component.referenceNumber).toBe('LN-2026-2222')
    })
  })

  describe('LocalStorage Data Loading', () => {
    it('should load submitted data from localStorage', () => {
      getItemSpy.mockReturnValue(JSON.stringify(mockSubmittedData))
      createComponent()

      expect(getItemSpy).toHaveBeenCalledWith(SUBMITTED_APP_STORAGE_KEY)
    })

    it('should handle missing localStorage data gracefully', () => {
      getItemSpy.mockReturnValue(null)
      createComponent()

      // submittedData is private, test indirectly via downloadReceipt
      component.downloadReceipt()
      expect(component.pdfError).toBe(true)
    })

    it('should handle corrupted JSON in localStorage', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      getItemSpy.mockReturnValue('{invalid json!!!')
      createComponent()

      // submittedData should be null due to catch block
      component.downloadReceipt()
      expect(component.pdfError).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error parsing submitted application data:',
        expect.any(SyntaxError)
      )
    })

    it('should parse valid JSON from localStorage without error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      getItemSpy.mockReturnValue(JSON.stringify(mockSubmittedData))
      createComponent()

      expect(consoleSpy).not.toHaveBeenCalled()
    })
  })

  describe('downloadReceipt()', () => {
    it('should set pdfError to true when no submitted data is available', () => {
      getItemSpy.mockReturnValue(null)
      createComponent()

      component.downloadReceipt()

      expect(component.pdfError).toBe(true)
    })

    it('should not call generatePDF when no submitted data is available', () => {
      getItemSpy.mockReturnValue(null)
      createComponent()

      const generateSpy = jest.spyOn(component as any, 'generatePDF')
      component.downloadReceipt()

      expect(generateSpy).not.toHaveBeenCalled()
    })

    it('should call generatePDF when submitted data exists', () => {
      getItemSpy.mockReturnValue(JSON.stringify(mockSubmittedData))
      createComponent()

      const generateSpy = jest.spyOn(component as any, 'generatePDF')
      component.downloadReceipt()

      expect(generateSpy).toHaveBeenCalled()
    })

    it('should reset pdfError to false when data exists and download is triggered', () => {
      getItemSpy.mockReturnValue(JSON.stringify(mockSubmittedData))
      createComponent()

      // First set pdfError to true
      component.pdfError = true
      component.downloadReceipt()

      expect(component.pdfError).toBe(false)
    })

    it('should create a jsPDF instance and call save when generating PDF', () => {
      const { jsPDF } = require('jspdf')
      getItemSpy.mockReturnValue(JSON.stringify(mockSubmittedData))
      createComponent()

      jsPDF.mockClear()
      component.downloadReceipt()

      expect(jsPDF).toHaveBeenCalled()
      const mockInstance = jsPDF.mock.results[0].value
      expect(mockInstance.save).toHaveBeenCalledWith(expect.stringContaining('Loan-Application-'))
    })
  })

  describe('returnToDashboard()', () => {
    it('should navigate to root path', () => {
      getItemSpy.mockReturnValue(null)
      createComponent()

      component.returnToDashboard()

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/'])
    })

    it('should call navigate exactly once', () => {
      getItemSpy.mockReturnValue(null)
      createComponent()

      component.returnToDashboard()

      expect(mockRouter.navigate).toHaveBeenCalledTimes(1)
    })
  })

  describe('ngOnDestroy()', () => {
    it('should complete destroy$ subject', () => {
      getItemSpy.mockReturnValue(null)
      createComponent()

      const destroy$ = (component as any).destroy$ as Subject<void>
      const nextSpy = jest.spyOn(destroy$, 'next')
      const completeSpy = jest.spyOn(destroy$, 'complete')

      component.ngOnDestroy()

      expect(nextSpy).toHaveBeenCalled()
      expect(completeSpy).toHaveBeenCalled()
    })

    it('should stop receiving query param updates after destroy', () => {
      getItemSpy.mockReturnValue(null)
      createComponent({ ref: 'LN-2026-FIRST' })

      expect(component.referenceNumber).toBe('LN-2026-FIRST')

      component.ngOnDestroy()

      // After destroy, emitting new query params should not update referenceNumber
      queryParamsSubject.next({ ref: 'LN-2026-AFTER-DESTROY' })
      expect(component.referenceNumber).toBe('LN-2026-FIRST')
    })
  })
})
