import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NavigationFooter } from './navigation-footer'

describe('NavigationFooter Component', () => {
  let component: NavigationFooter
  let fixture: ComponentFixture<NavigationFooter>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationFooter],
    }).compileComponents()

    fixture = TestBed.createComponent(NavigationFooter)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  describe('Component Creation', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy()
    })
  })

  describe('Default Input Values', () => {
    it('should default isFirstStep to false', () => {
      expect(component.isFirstStep).toBe(false)
    })

    it('should default isLastStep to false', () => {
      expect(component.isLastStep).toBe(false)
    })

    it('should default continueDisabled to false', () => {
      expect(component.continueDisabled).toBe(false)
    })

    it('should default showSaveExit to true', () => {
      expect(component.showSaveExit).toBe(true)
    })

    it('should default isSubmitting to false', () => {
      expect(component.isSubmitting).toBe(false)
    })

    it('should default submitButtonText to "Processing..."', () => {
      expect(component.submitButtonText).toBe('Processing...')
    })
  })

  describe('EventEmitter Outputs', () => {
    it('should have a back EventEmitter', () => {
      expect(component.back).toBeDefined()
    })

    it('should have a continue EventEmitter', () => {
      expect(component.continue).toBeDefined()
    })

    it('should have a saveExit EventEmitter', () => {
      expect(component.saveExit).toBeDefined()
    })
  })

  describe('onBack()', () => {
    it('should emit back event when isFirstStep is false', () => {
      jest.spyOn(component.back, 'emit')
      component.isFirstStep = false

      component.onBack()

      expect(component.back.emit).toHaveBeenCalled()
    })

    it('should not emit back event when isFirstStep is true', () => {
      jest.spyOn(component.back, 'emit')
      component.isFirstStep = true

      component.onBack()

      expect(component.back.emit).not.toHaveBeenCalled()
    })

    it('should emit back event exactly once per call', () => {
      jest.spyOn(component.back, 'emit')
      component.isFirstStep = false

      component.onBack()

      expect(component.back.emit).toHaveBeenCalledTimes(1)
    })
  })

  describe('onContinue()', () => {
    it('should emit continue event when not disabled and not submitting', () => {
      jest.spyOn(component.continue, 'emit')
      component.continueDisabled = false
      component.isSubmitting = false

      component.onContinue()

      expect(component.continue.emit).toHaveBeenCalled()
    })

    it('should not emit continue event when continueDisabled is true', () => {
      jest.spyOn(component.continue, 'emit')
      component.continueDisabled = true
      component.isSubmitting = false

      component.onContinue()

      expect(component.continue.emit).not.toHaveBeenCalled()
    })

    it('should not emit continue event when isSubmitting is true', () => {
      jest.spyOn(component.continue, 'emit')
      component.continueDisabled = false
      component.isSubmitting = true

      component.onContinue()

      expect(component.continue.emit).not.toHaveBeenCalled()
    })

    it('should not emit continue event when both disabled and submitting', () => {
      jest.spyOn(component.continue, 'emit')
      component.continueDisabled = true
      component.isSubmitting = true

      component.onContinue()

      expect(component.continue.emit).not.toHaveBeenCalled()
    })

    it('should emit continue event exactly once per call', () => {
      jest.spyOn(component.continue, 'emit')
      component.continueDisabled = false
      component.isSubmitting = false

      component.onContinue()

      expect(component.continue.emit).toHaveBeenCalledTimes(1)
    })
  })

  describe('onSaveExit()', () => {
    it('should emit saveExit event', () => {
      jest.spyOn(component.saveExit, 'emit')

      component.onSaveExit()

      expect(component.saveExit.emit).toHaveBeenCalled()
    })

    it('should emit saveExit event exactly once per call', () => {
      jest.spyOn(component.saveExit, 'emit')

      component.onSaveExit()

      expect(component.saveExit.emit).toHaveBeenCalledTimes(1)
    })

    it('should emit saveExit regardless of other input states', () => {
      jest.spyOn(component.saveExit, 'emit')
      component.isFirstStep = true
      component.isLastStep = true
      component.continueDisabled = true
      component.isSubmitting = true

      component.onSaveExit()

      expect(component.saveExit.emit).toHaveBeenCalled()
    })
  })

  describe('Input State Changes', () => {
    it('should accept updated isFirstStep value', () => {
      component.isFirstStep = true
      fixture.detectChanges()

      expect(component.isFirstStep).toBe(true)
    })

    it('should accept updated isLastStep value', () => {
      component.isLastStep = true
      fixture.detectChanges()

      expect(component.isLastStep).toBe(true)
    })

    it('should accept updated continueDisabled value', () => {
      component.continueDisabled = true
      fixture.detectChanges()

      expect(component.continueDisabled).toBe(true)
    })

    it('should accept updated showSaveExit value', () => {
      component.showSaveExit = false
      fixture.detectChanges()

      expect(component.showSaveExit).toBe(false)
    })

    it('should accept updated isSubmitting value', () => {
      component.isSubmitting = true
      fixture.detectChanges()

      expect(component.isSubmitting).toBe(true)
    })

    it('should accept custom submitButtonText', () => {
      component.submitButtonText = 'Submitting...'
      fixture.detectChanges()

      expect(component.submitButtonText).toBe('Submitting...')
    })
  })
})
