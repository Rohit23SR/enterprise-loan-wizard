import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { jsPDF } from 'jspdf';

interface SubmittedApplication {
  personalInfo: any;
  businessInfo: any;
  financialDetails: any;
  documents: any;
  review: any;
  referenceNumber: string;
  submittedDate: string;
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
export class SuccessScreen implements OnInit {
  referenceNumber: string = '';
  private submittedData: SubmittedApplication | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.referenceNumber = params['ref'] || 'N/A';
    });

    // Load submitted application data
    const stored = localStorage.getItem('last-submitted-application');
    if (stored) {
      this.submittedData = JSON.parse(stored);
    }
  }

  downloadReceipt(): void {
    if (!this.submittedData) {
      alert('No application data available for PDF generation.');
      return;
    }

    this.generatePDF();
  }

  private generatePDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Primary color
    doc.text('Loan Application Receipt', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Reference: ${this.referenceNumber}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 5;
    const submittedDate = new Date(this.submittedData!.submittedDate);
    doc.text(`Submitted: ${submittedDate.toLocaleDateString('en-AU', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })}`, pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 15;

    // Personal Information
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('Personal Information', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const personal = this.submittedData!.personalInfo;
    this.addField(doc, 'Full Name', personal.fullName || '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Email', personal.email || '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Phone', personal.phone || '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Date of Birth', personal.dateOfBirth ? new Date(personal.dateOfBirth).toLocaleDateString('en-AU') : '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Address', `${personal.streetAddress || ''}, ${personal.city || ''}, ${personal.state || ''} ${personal.postcode || ''}`, yPosition);
    yPosition += 6;
    this.addField(doc, 'Country', personal.country || '', yPosition);

    yPosition += 12;

    // Business Information
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('Business Information', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const business = this.submittedData!.businessInfo;
    this.addField(doc, 'Business Name', business.businessName || '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Business Type', business.businessType || '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Industry', business.industry || '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Years in Business', String(business.yearsInBusiness || ''), yPosition);
    yPosition += 6;
    this.addField(doc, 'ABN', this.maskABN(business.abn || ''), yPosition);
    yPosition += 6;
    this.addField(doc, 'Annual Revenue', this.formatCurrency(business.annualRevenue || 0), yPosition);
    yPosition += 6;
    this.addField(doc, 'Number of Employees', String(business.numberOfEmployees || ''), yPosition);

    yPosition += 12;

    // Check if we need a new page
    if (yPosition > 240) {
      doc.addPage();
      yPosition = 20;
    }

    // Financial Details
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('Financial Details', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const financial = this.submittedData!.financialDetails;
    this.addField(doc, 'Loan Amount', this.formatCurrency(financial.loanAmount || 0), yPosition);
    yPosition += 6;
    this.addField(doc, 'Loan Purpose', financial.loanPurpose || '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Desired Term', financial.desiredTerm || '', yPosition);
    yPosition += 6;
    this.addField(doc, 'Avg Monthly Revenue', this.formatCurrency(financial.avgMonthlyRevenue || 0), yPosition);
    yPosition += 6;
    this.addField(doc, 'Monthly Expenses', this.formatCurrency(financial.monthlyExpenses || 0), yPosition);
    yPosition += 6;
    this.addField(doc, 'Existing Debt', this.formatCurrency(financial.existingDebt || 0), yPosition);
    yPosition += 6;
    this.addField(doc, 'Credit Score Range', financial.creditScoreRange || '', yPosition);
    yPosition += 6;

    if (financial.hasCollateral) {
      this.addField(doc, 'Collateral Type', financial.collateralType || '', yPosition);
      yPosition += 6;
      this.addField(doc, 'Collateral Value', this.formatCurrency(financial.collateralValue || 0), yPosition);
      yPosition += 6;
    }

    yPosition += 12;

    // Documents
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text('Submitted Documents', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const docs = this.submittedData!.documents;
    this.addField(doc, 'Government ID', `${docs.governmentId?.length || 0} file(s)`, yPosition);
    yPosition += 6;
    this.addField(doc, 'Business Registration', `${docs.businessRegistration?.length || 0} file(s)`, yPosition);
    yPosition += 6;
    this.addField(doc, 'Bank Statements', `${docs.bankStatements?.length || 0} file(s)`, yPosition);
    yPosition += 6;
    this.addField(doc, 'Tax Returns', `${docs.taxReturns?.length || 0} file(s)`, yPosition);
    yPosition += 6;
    if (docs.additionalDocs && docs.additionalDocs.length > 0) {
      this.addField(doc, 'Additional Documents', `${docs.additionalDocs.length} file(s)`, yPosition);
      yPosition += 6;
    }

    yPosition += 12;

    // Footer
    if (yPosition > 260) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('This is an automatically generated receipt for your loan application.', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text('Please keep this for your records.', pageWidth / 2, yPosition, { align: 'center' });

    // Save PDF
    doc.save(`Loan-Application-${this.referenceNumber}.pdf`);
  }

  private addField(doc: jsPDF, label: string, value: string, y: number): void {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 80, y);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private maskABN(abn: string): string {
    if (!abn) return 'N/A';
    return `** *** *** ${abn.slice(-3)}`;
  }

  returnToDashboard(): void {
    // Navigate back to wizard or home
    this.router.navigate(['/']);
  }
}
