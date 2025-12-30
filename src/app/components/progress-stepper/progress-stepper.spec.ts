import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressStepper } from './progress-stepper';
import { WizardStep } from '../../services/wizard-state';

describe('ProgressStepper Component', () => {
  let component: ProgressStepper;
  let fixture: ComponentFixture<ProgressStepper>;
  let mockSteps: WizardStep[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressStepper]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressStepper);
    component = fixture.componentInstance;

    // Create mock steps
    mockSteps = [
      {
        id: 1,
        name: 'personal-info',
        label: 'Personal Info',
        description: 'Personal Information',
        completed: false,
        hasErrors: false
      },
      {
        id: 2,
        name: 'business-info',
        label: 'Business Info',
        description: 'Business Information',
        completed: false,
        hasErrors: false
      },
      {
        id: 3,
        name: 'financial-details',
        label: 'Financial Details',
        description: 'Financial Details',
        completed: false,
        hasErrors: false
      },
      {
        id: 4,
        name: 'documents',
        label: 'Documents',
        description: 'Document Upload',
        completed: false,
        hasErrors: false
      },
      {
        id: 5,
        name: 'review',
        label: 'Review',
        description: 'Review & Submit',
        completed: false,
        hasErrors: false
      }
    ];

    component.steps = [...mockSteps];
    component.currentStep = 0;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have steps input initialized', () => {
      expect(component.steps).toBeDefined();
      expect(component.steps.length).toBe(5);
    });

    it('should have currentStep input initialized', () => {
      expect(component.currentStep).toBeDefined();
      expect(component.currentStep).toBe(0);
    });

    it('should have stepClick output event emitter', () => {
      expect(component.stepClick).toBeDefined();
    });
  });

  describe('getStepStatus', () => {
    it('should return "active" for current step', () => {
      component.currentStep = 2;
      expect(component.getStepStatus(2)).toBe('active');
    });

    it('should return "active" for current step even if marked as completed', () => {
      component.currentStep = 2;
      component.steps[2].completed = true;
      expect(component.getStepStatus(2)).toBe('active');
    });

    it('should return "active" for current step even if it has errors', () => {
      component.currentStep = 2;
      component.steps[2].hasErrors = true;
      expect(component.getStepStatus(2)).toBe('active');
    });

    it('should return "error" for non-current step with errors', () => {
      component.currentStep = 2;
      component.steps[1].hasErrors = true;
      expect(component.getStepStatus(1)).toBe('error');
    });

    it('should return "completed" for completed steps', () => {
      component.currentStep = 2;
      component.steps[0].completed = true;
      component.steps[1].completed = true;
      expect(component.getStepStatus(0)).toBe('completed');
      expect(component.getStepStatus(1)).toBe('completed');
    });

    it('should return "upcoming" for future steps', () => {
      component.currentStep = 1;
      expect(component.getStepStatus(2)).toBe('upcoming');
      expect(component.getStepStatus(3)).toBe('upcoming');
      expect(component.getStepStatus(4)).toBe('upcoming');
    });

    it('should prioritize error over completed', () => {
      component.currentStep = 2;
      component.steps[1].completed = true;
      component.steps[1].hasErrors = true;
      expect(component.getStepStatus(1)).toBe('error');
    });

    it('should handle first step correctly', () => {
      component.currentStep = 0;
      expect(component.getStepStatus(0)).toBe('active');
      expect(component.getStepStatus(1)).toBe('upcoming');
    });

    it('should handle last step correctly', () => {
      component.currentStep = 4;
      component.steps[0].completed = true;
      component.steps[1].completed = true;
      component.steps[2].completed = true;
      component.steps[3].completed = true;

      expect(component.getStepStatus(4)).toBe('active');
      expect(component.getStepStatus(3)).toBe('completed');
    });
  });

  describe('isStepClickable', () => {
    it('should return true for previous steps', () => {
      component.currentStep = 3;
      expect(component.isStepClickable(0)).toBe(true);
      expect(component.isStepClickable(1)).toBe(true);
      expect(component.isStepClickable(2)).toBe(true);
    });

    it('should return false for current step', () => {
      component.currentStep = 2;
      expect(component.isStepClickable(2)).toBe(false);
    });

    it('should return false for future steps', () => {
      component.currentStep = 2;
      expect(component.isStepClickable(3)).toBe(false);
      expect(component.isStepClickable(4)).toBe(false);
    });

    it('should return false for first step when on first step', () => {
      component.currentStep = 0;
      expect(component.isStepClickable(0)).toBe(false);
    });

    it('should allow clicking on any previous step from last step', () => {
      component.currentStep = 4;
      expect(component.isStepClickable(0)).toBe(true);
      expect(component.isStepClickable(1)).toBe(true);
      expect(component.isStepClickable(2)).toBe(true);
      expect(component.isStepClickable(3)).toBe(true);
      expect(component.isStepClickable(4)).toBe(false);
    });
  });

  describe('onStepClick', () => {
    it('should emit stepClick event for previous steps', () => {
      component.currentStep = 3;
      jest.spyOn(component.stepClick, 'emit');

      component.onStepClick(1);

      expect(component.stepClick.emit).toHaveBeenCalledWith(1);
    });

    it('should not emit stepClick event for current step', () => {
      component.currentStep = 2;
      jest.spyOn(component.stepClick, 'emit');

      component.onStepClick(2);

      expect(component.stepClick.emit).not.toHaveBeenCalled();
    });

    it('should not emit stepClick event for future steps', () => {
      component.currentStep = 1;
      jest.spyOn(component.stepClick, 'emit');

      component.onStepClick(3);

      expect(component.stepClick.emit).not.toHaveBeenCalled();
    });

    it('should allow navigating back to first step', () => {
      component.currentStep = 4;
      jest.spyOn(component.stepClick, 'emit');

      component.onStepClick(0);

      expect(component.stepClick.emit).toHaveBeenCalledWith(0);
    });

    it('should emit correct index when clicked', () => {
      component.currentStep = 4;
      jest.spyOn(component.stepClick, 'emit');

      component.onStepClick(2);

      expect(component.stepClick.emit).toHaveBeenCalledWith(2);
      expect(component.stepClick.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Step State Combinations', () => {
    it('should handle all steps completed except current', () => {
      component.currentStep = 4;
      component.steps[0].completed = true;
      component.steps[1].completed = true;
      component.steps[2].completed = true;
      component.steps[3].completed = true;

      expect(component.getStepStatus(0)).toBe('completed');
      expect(component.getStepStatus(1)).toBe('completed');
      expect(component.getStepStatus(2)).toBe('completed');
      expect(component.getStepStatus(3)).toBe('completed');
      expect(component.getStepStatus(4)).toBe('active');
    });

    it('should handle mixed completed and error states', () => {
      component.currentStep = 3;
      component.steps[0].completed = true;
      component.steps[1].hasErrors = true;
      component.steps[2].completed = true;

      expect(component.getStepStatus(0)).toBe('completed');
      expect(component.getStepStatus(1)).toBe('error');
      expect(component.getStepStatus(2)).toBe('completed');
      expect(component.getStepStatus(3)).toBe('active');
      expect(component.getStepStatus(4)).toBe('upcoming');
    });

    it('should handle progressing through all steps', () => {
      // Start at step 0
      component.currentStep = 0;
      expect(component.getStepStatus(0)).toBe('active');

      // Move to step 1, mark step 0 as completed
      component.steps[0].completed = true;
      component.currentStep = 1;
      expect(component.getStepStatus(0)).toBe('completed');
      expect(component.getStepStatus(1)).toBe('active');

      // Move to step 2, mark step 1 as completed
      component.steps[1].completed = true;
      component.currentStep = 2;
      expect(component.getStepStatus(0)).toBe('completed');
      expect(component.getStepStatus(1)).toBe('completed');
      expect(component.getStepStatus(2)).toBe('active');
    });

    it('should handle going back to fix errors', () => {
      // Setup: currently on step 3, previous steps completed
      component.currentStep = 3;
      component.steps[0].completed = true;
      component.steps[1].completed = true;
      component.steps[2].completed = true;

      // User goes back to step 1 to fix something
      component.currentStep = 1;

      expect(component.getStepStatus(0)).toBe('completed');
      expect(component.getStepStatus(1)).toBe('active');
      expect(component.getStepStatus(2)).toBe('completed');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty steps array', () => {
      component.steps = [];
      expect(() => component.getStepStatus(0)).not.toThrow();
    });

    it('should handle accessing step beyond array length', () => {
      expect(() => component.getStepStatus(10)).not.toThrow();
    });

    it('should handle negative step index', () => {
      expect(() => component.getStepStatus(-1)).not.toThrow();
      expect(() => component.isStepClickable(-1)).not.toThrow();
      expect(() => component.onStepClick(-1)).not.toThrow();
    });

    it('should handle single step wizard', () => {
      component.steps = [mockSteps[0]];
      component.currentStep = 0;

      expect(component.getStepStatus(0)).toBe('active');
      expect(component.isStepClickable(0)).toBe(false);
    });
  });

  describe('Input/Output Binding', () => {
    it('should update when steps input changes', () => {
      const newSteps = [...mockSteps];
      newSteps[0].completed = true;

      component.steps = newSteps;
      fixture.detectChanges();

      expect(component.steps[0].completed).toBe(true);
    });

    it('should update when currentStep input changes', () => {
      component.currentStep = 3;
      fixture.detectChanges();

      expect(component.currentStep).toBe(3);
      expect(component.getStepStatus(3)).toBe('active');
    });

    it('should emit event through stepClick output', (done) => {
      component.currentStep = 2;

      component.stepClick.subscribe((index: number) => {
        expect(index).toBe(0);
        done();
      });

      component.onStepClick(0);
    });
  });
});
