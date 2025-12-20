import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-footer.html',
  styleUrl: './navigation-footer.scss',
})
export class NavigationFooter {
  @Input() isFirstStep: boolean = false;
  @Input() isLastStep: boolean = false;
  @Input() continueDisabled: boolean = false;
  @Input() showSaveExit: boolean = true;
  @Input() isSubmitting: boolean = false;
  @Input() submitButtonText: string = 'Processing...';

  @Output() back = new EventEmitter<void>();
  @Output() continue = new EventEmitter<void>();
  @Output() saveExit = new EventEmitter<void>();

  onBack(): void {
    if (!this.isFirstStep) {
      this.back.emit();
    }
  }

  onContinue(): void {
    if (!this.continueDisabled && !this.isSubmitting) {
      this.continue.emit();
    }
  }

  onSaveExit(): void {
    this.saveExit.emit();
  }
}
