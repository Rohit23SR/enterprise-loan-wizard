# Enterprise Loan Wizard

A modern, enterprise-grade multi-step loan application wizard built with Angular 20. This application provides a comprehensive, user-friendly interface for Australian business loan applications with automatic data persistence, form validation, and PDF receipt generation.

## Live Demo

**Production URL:** [https://enterprise-loan-wizard.vercel.app](https://enterprise-loan-wizard.vercel.app)

> **🔒 Secure HTTPS Deployment on Vercel**
>
> The application is deployed securely using Vercel with:
> - HTTPS encryption (TLS 1.3)
> - Security headers (CSP, HSTS, X-Frame-Options, etc.)
> - Global edge network (CDN)
> - Automatic deployments from Git
> - 100% FREE (Hobby tier)
>
> **Note:** This application handles sensitive financial data and requires HTTPS. Vercel provides enterprise-grade security for free.

## Features

- **5-Step Wizard Interface** - Intuitive multi-step form flow with progress tracking
- **Auto-Save Functionality** - Automatic form data persistence every 30 seconds using localStorage
- **Australian Localization** - TFN, ABN, Australian states, postcodes, and currency formatting
- **Real-time Validation** - Comprehensive form validation with instant feedback
- **Document Upload** - Support for multiple file types with file management
- **PDF Receipt Generation** - Automatic PDF generation with jsPDF library
- **Responsive Design** - Mobile-first design that works across all devices
- **Accessibility** - WCAG 2.1 Level AA compliant
- **Modern UI/UX** - Contemporary design with smooth animations and transitions

## Technology Stack

### Core Framework
- **Angular**: 20.1.0 (Standalone Components)
- **TypeScript**: 5.8.2
- **RxJS**: 7.8.0

### Key Dependencies
- **ngx-mask**: 20.0.3 - Input masking for TFN, ABN, phone numbers, etc.
- **jsPDF**: 3.0.4 - PDF generation for application receipts
- **@angular/animations**: 20.3.15 - Smooth page transitions and UI animations

### Development Tools
- **Angular CLI**: 20.1.0
- **Karma & Jasmine**: Testing framework
- **SCSS**: Styling with CSS variables

## Project Structure

```
enterprise-loan-wizard/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── wizard/              # Main wizard container
│   │   │   ├── progress-stepper/    # Step indicator
│   │   │   ├── navigation-footer/   # Navigation buttons
│   │   │   ├── success-screen/      # Submission success page
│   │   │   ├── shared/              # Shared components
│   │   │   │   ├── form-input/
│   │   │   │   └── form-select/
│   │   │   └── steps/               # Individual form steps
│   │   │       ├── personal-info/
│   │   │       ├── business-info/
│   │   │       ├── financial-details/
│   │   │       ├── document-upload/
│   │   │       └── review-submit/
│   │   ├── services/
│   │   │   └── wizard-state.ts      # Centralized state management
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── styles.scss                  # Global styles & design system
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd enterprise-loan-wizard
```

2. Install dependencies:
```bash
npm install
```

### Development Server

Start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

### Building for Production

Build the project for production:

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory with optimizations enabled.

### Deploying to Production

**Deploy to Vercel (FREE):**

#### Method 1: Vercel Dashboard (Recommended - 2 minutes)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Sign up/login (free account)
   - Click "Import Git Repository"
   - Select your repository
   - Click "Deploy"
   - Done! Your app will be live at `https://your-app-name.vercel.app`

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Method 3: One-Click Deploy

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/enterprise-loan-wizard)

**What you get (100% FREE):**
- HTTPS encryption (TLS 1.3)
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Global CDN with 300+ edge locations
- Automatic SSL certificates
- DDoS protection
- Auto-deploy on Git push
- 100GB bandwidth/month
- Unlimited deployments

**Custom Domain (Optional):**
- Go to Vercel Dashboard → Settings → Domains
- Add your custom domain
- Follow DNS instructions
- SSL automatically provisioned

### Running Tests

Execute unit tests:

```bash
ng test
```

## Application Workflow

### Step 1: Personal Information
- Full name, email, phone number
- Date of birth with 18+ age validation
- Tax File Number (TFN) with format validation
- Australian address (street, city, state/territory, postcode)

### Step 2: Business Information
- Business legal name and type
- Industry and years in operation
- Australian Business Number (ABN) with format validation
- Business address (with option to use personal address)
- Annual revenue and employee count
- Business description

### Step 3: Financial Details
- Loan amount requested
- Loan purpose and desired term
- Monthly revenue and expenses
- Existing debt and credit score range
- Optional collateral information

### Step 4: Document Upload
- Government ID (required, 1+ files)
- Business registration documents (required, 1+ files)
- Bank statements (required, 3+ files)
- Tax returns (required, 2+ files)
- Additional supporting documents (optional)

### Step 5: Review & Submit
- Comprehensive review of all entered data
- Required certifications and agreements
- Final submission with PDF receipt generation

## Key Features Explained

### State Management

The application uses a hybrid approach combining Angular Signals and RxJS:

- **Signals** for reactive UI updates (current step, computed properties)
- **BehaviorSubject** for complex form data management
- **LocalStorage** for automatic data persistence with 7-day expiration

### Form Validation

Multi-layered validation approach:
- HTML5 native validation
- Angular reactive form validators
- Custom validators (age, TFN, ABN, postcode)
- Real-time error feedback

### Australian Localization

- **TFN Format**: 9 digits (000 000 000)
- **ABN Format**: 11 digits (00 000 000 000)
- **Postcode Format**: 4 digits (0000)
- **Phone Format**: 10 digits (0000 000 000)
- **States/Territories**: All 8 Australian states and territories
- **Currency**: AUD with Australian formatting
- **Dates**: Australian date format (DD/MM/YYYY)

### Auto-Save Feature

- Saves form data every 30 seconds automatically
- Data persists across browser sessions
- 7-day expiration for saved data
- Single localStorage key: `enterprise-loan-wizard-data`
- Includes timestamp and step completion status

**Note**: File uploads cannot be persisted to localStorage and will need to be re-uploaded after page refresh.

### PDF Receipt Generation

Upon successful submission, a comprehensive PDF receipt is generated containing:
- Reference number and submission timestamp
- All personal and business information (with sensitive data masked)
- Financial details and loan information
- Document upload summary
- Formatted using jsPDF library

## Design System

### Color Palette

**Primary Color**: `#3B82F6` (Blue)
- Primary Dark: `#1E40AF`
- Primary Light: `#DBEAFE`

**Status Colors**:
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

### Typography

**Font Family**: Inter (Google Fonts)
- Fallback: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI')

**Font Sizes**:
- H1: 2rem (32px)
- H2: 1.5rem (24px)
- H3: 1.125rem (18px)
- Body: 1rem (16px)
- Label: 0.875rem (14px)
- Caption: 0.75rem (12px)

### Spacing

Based on 4px grid:
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

## Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

The application is designed to meet WCAG 2.1 Level AA standards:
- Semantic HTML structure
- ARIA labels and landmarks
- Keyboard navigation support
- Focus indicators
- Sufficient color contrast ratios
- Screen reader compatibility

## Performance

### Bundle Sizes (Production Build)
- Initial Bundle: ~500KB (gzipped)
- Optimized with tree-shaking
- Lazy loading ready for future expansion
- AOT compilation enabled

### Optimizations
- OnPush change detection strategy (where applicable)
- Proper subscription cleanup with takeUntil pattern
- Debounced auto-save to reduce storage operations
- Efficient form validation

## Contributing

When contributing to this project, please:

1. Follow the existing code style and conventions
2. Use TypeScript strict mode
3. Write tests for new features
4. Update documentation as needed
5. Follow the Angular style guide

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
