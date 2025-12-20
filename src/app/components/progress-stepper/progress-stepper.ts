import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardStep } from '../../services/wizard-state';

@Component({
  selector: 'app-progress-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-stepper.html',
  styleUrl: './progress-stepper.scss',
})
export class ProgressStepper {
  @Input() steps: WizardStep[] = [];
  @Input() currentStep: number = 0;
  @Output() stepClick = new EventEmitter<number>();

  getStepStatus(index: number): 'completed' | 'active' | 'upcoming' | 'error' {
    const step = this.steps[index];

    // Current step should always show as active (highest priority)
    if (index === this.currentStep) return 'active';

    // Error state for steps with validation errors
    if (step.hasErrors) return 'error';

    // Completed state for successfully validated previous steps
    if (step.completed) return 'completed';

    // Default state for future steps
    return 'upcoming';
  }

  onStepClick(index: number): void {
    // Allow clicking on completed steps to go back
    if (index < this.currentStep) {
      this.stepClick.emit(index);
    }
  }

  isStepClickable(index: number): boolean {
    return index < this.currentStep;
  }
}
