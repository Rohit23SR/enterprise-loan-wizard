import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { trigger, transition, style, animate } from '@angular/animations'
import { Subject, takeUntil } from 'rxjs'
import { jsPDF } from 'jspdf'
import {
  PersonalInfo,
  BusinessInfo,
  FinancialDetails,
  DocumentUpload,
  ReviewConfirmation,
} from '../../services/wizard-state'
import { SUBMITTED_APP_STORAGE_KEY } from '../../constants/wizard-config'
import { formatCurrencyAUD, maskABN } from '../../utils/formatting'

interface SubmittedApplication {
  personalInfo: Partial<PersonalInfo>
  businessInfo: Partial<BusinessInfo>
  financialDetails: Partial<FinancialDetails>
  documents: Partial<DocumentUpload>
  review: Partial<ReviewConfirmation>
  referenceNumber: string
  submittedDate: string
}

@Component({
  selector: 'app-success-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success-screen.html',
  styleUrl: './success-screen.scss',
  animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class SuccessScreen implements OnInit, OnDestroy {
  referenceNumber: string = ''
  pdfError = false
  private submittedData: SubmittedApplication | null = null
  private destroy$ = new Subject<void>()

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.referenceNumber = params['ref'] || 'N/A'
    })

    // Load submitted application data
    const stored = localStorage.getItem(SUBMITTED_APP_STORAGE_KEY)
    if (stored) {
      try {
        this.submittedData = JSON.parse(stored)
      } catch (error) {
        console.error('Error parsing submitted application data:', error)
        this.submittedData = null
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  downloadReceipt(): void {
    if (!this.submittedData) {
      this.pdfError = true
      return
    }
    this.pdfError = false
    this.generatePDF()
  }

  private generatePDF(): void {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Header
    doc.setFontSize(22)
    doc.setTextColor(79, 70, 229) // Primary color
    doc.text('Loan Application Receipt', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Reference: ${this.referenceNumber}`, pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 5
    const submittedDate = new Date(this.submittedData!.submittedDate)
    doc.text(
      `Submitted: ${submittedDate.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    )

    yPosition += 15

    // Personal Information
    doc.setFontSize(14)
    doc.setTextColor(79, 70, 229)
    doc.text('Personal Information', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const personal = this.submittedData!.personalInfo
    this.addField(doc, 'Full Name', personal.fullName || '', yPosition)
    yPosition += 6
    this.addField(doc, 'Email', personal.email || '', yPosition)
    yPosition += 6
    this.addField(doc, 'Phone', personal.phone || '', yPosition)
    yPosition += 6
    this.addField(
      doc,
      'Date of Birth',
      personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString('en-AU') : '',
      yPosition
    )
    yPosition += 6
    this.addField(
      doc,
      'Address',
      `${personal.streetAddress || ''}, ${personal.city || ''}, ${personal.state || ''} ${personal.postcode || ''}`,
      yPosition
    )
    yPosition += 6
    this.addField(doc, 'Country', personal.country || '', yPosition)

    yPosition += 12

    // Business Information
    doc.setFontSize(14)
    doc.setTextColor(79, 70, 229)
    doc.text('Business Information', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const business = this.submittedData!.businessInfo
    this.addField(doc, 'Business Name', business.businessName || '', yPosition)
    yPosition += 6
    this.addField(doc, 'Business Type', business.businessType || '', yPosition)
    yPosition += 6
    this.addField(doc, 'Industry', business.industry || '', yPosition)
    yPosition += 6
    this.addField(doc, 'Years in Business', String(business.yearsInBusiness || ''), yPosition)
    yPosition += 6
    this.addField(doc, 'ABN', maskABN(business.abn), yPosition)
    yPosition += 6
    this.addField(doc, 'Annual Revenue', formatCurrencyAUD(business.annualRevenue), yPosition)
    yPosition += 6
    this.addField(doc, 'Number of Employees', String(business.numberOfEmployees || ''), yPosition)

    yPosition += 12

    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage()
      yPosition = 20
    }

    // Financial Details
    doc.setFontSize(14)
    doc.setTextColor(79, 70, 229)
    doc.text('Financial Details', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const financial = this.submittedData!.financialDetails
    this.addField(doc, 'Loan Amount', formatCurrencyAUD(financial.loanAmount), yPosition)
    yPosition += 6
    this.addField(doc, 'Loan Purpose', financial.loanPurpose || '', yPosition)
    yPosition += 6
    this.addField(doc, 'Desired Term', financial.desiredTerm || '', yPosition)
    yPosition += 6
    this.addField(
      doc,
      'Avg Monthly Revenue',
      formatCurrencyAUD(financial.avgMonthlyRevenue),
      yPosition
    )
    yPosition += 6
    this.addField(doc, 'Monthly Expenses', formatCurrencyAUD(financial.monthlyExpenses), yPosition)
    yPosition += 6
    this.addField(doc, 'Existing Debt', formatCurrencyAUD(financial.existingDebt), yPosition)
    yPosition += 6
    this.addField(doc, 'Credit Score Range', financial.creditScoreRange || '', yPosition)
    yPosition += 6

    if (financial.hasCollateral) {
      this.addField(doc, 'Collateral Type', financial.collateralType || '', yPosition)
      yPosition += 6
      this.addField(
        doc,
        'Collateral Value',
        formatCurrencyAUD(financial.collateralValue),
        yPosition
      )
      yPosition += 6
    }

    yPosition += 12

    // Documents
    doc.setFontSize(14)
    doc.setTextColor(79, 70, 229)
    doc.text('Submitted Documents', 20, yPosition)
    yPosition += 8

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const docs = this.submittedData!.documents
    this.addField(doc, 'Government ID', `${docs.governmentId?.length || 0} file(s)`, yPosition)
    yPosition += 6
    this.addField(
      doc,
      'Business Registration',
      `${docs.businessRegistration?.length || 0} file(s)`,
      yPosition
    )
    yPosition += 6
    this.addField(doc, 'Bank Statements', `${docs.bankStatements?.length || 0} file(s)`, yPosition)
    yPosition += 6
    this.addField(doc, 'Tax Returns', `${docs.taxReturns?.length || 0} file(s)`, yPosition)
    yPosition += 6
    if (docs.additionalDocs && docs.additionalDocs.length > 0) {
      this.addField(doc, 'Additional Documents', `${docs.additionalDocs.length} file(s)`, yPosition)
      yPosition += 6
    }

    yPosition += 12

    // Footer
    if (yPosition > 260) {
      doc.addPage()
      yPosition = 20
    }

    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(
      'This is an automatically generated receipt for your loan application.',
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    )
    yPosition += 5
    doc.text('Please keep this for your records.', pageWidth / 2, yPosition, { align: 'center' })

    // Save PDF
    doc.save(`Loan-Application-${this.referenceNumber}.pdf`)
  }

  private addField(doc: jsPDF, label: string, value: string, y: number): void {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, 20, y)
    doc.setFont('helvetica', 'normal')
    doc.text(value, 80, y)
  }

  returnToDashboard(): void {
    // Navigate back to wizard or home
    this.router.navigate(['/'])
  }
}
