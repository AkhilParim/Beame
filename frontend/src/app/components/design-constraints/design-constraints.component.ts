import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { developmentClasses } from '../../data/form-data';
import { NoWheelDirective } from '../../directives/no-wheel.directive';

@Component({
  selector: 'app-design-constraints',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NoWheelDirective],
  templateUrl: './design-constraints.component.html',
  styleUrl: './design-constraints.component.scss'
})
export class DesignConstraintsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  constraintsForm: FormGroup;
  developmentClasses = developmentClasses;

  protectedTreeTypes = [
    'Corridor Tree/Green Corridor Tree',
    'Parkway Tree',
    'Other'
  ];

  constructor(private fb: FormBuilder) {
    this.constraintsForm = this.fb.group({
      cityFundedPublicProject: [false],
      street: this.fb.group({
        proposedCurb: [false],
        noCurb: [false],
        proposedStreetWidening: [false],
        proposedMarkings: [false],
        proposedConcrete: [false],
        proposedAsphalt: [false],
        proposedNewROW: [false],
        proposedDriveway: [false],
        proposedSignage: [false],
        proposedDrainage: [false],
        utilityRelocation: [false],
        extensionWidth: ['', [Validators.min(0)]],
        proposedROWWidth: ['', [Validators.min(0)]],
        proposedStreetWidth: ['', [Validators.min(0)]]
      }),
      sidewalk: this.fb.group({
        proposedSidewalkRepair: [false],
        proposedSidewalk: [false],
        proposedSidewalkExtension: [false],
        proposedRamp: [false],
        proposedSidewalkWidth: ['', [Validators.min(0)]]
      }),
      abandonedEasement: [false],
      protectedTreesPresent: [false],
      protectedTreeType: [''],
      siteEnlargement: [false],
      enlargementArea: ['', [Validators.min(0)]],
      newParkingLot: [false],
      parkingLot: this.fb.group({
        area: ['', [Validators.min(0)]],
        numberOfSpots: ['', [Validators.min(0)]],
        stallWidth: ['', [Validators.min(0)]],
        stallLength: ['', [Validators.min(0)]]
      }),
      hasAdjacentProperties: [false],
      adjacentProperties: this.fb.group({
        frontPresent: [false],
        frontTypes: [[]],
        sidePresent: [false],
        sideTypes: [[]],
        rearPresent: [false],
        rearTypes: [[]]
      }),
      additionalNotes: [''],
      imperviousArea: this.fb.group({
        area: ['', [Validators.min(0)]],
        percentage: ['', [Validators.min(0), Validators.max(100)]]
      }),
      perviousArea: this.fb.group({
        area: ['', [Validators.min(0)]],
        percentage: ['', [Validators.min(0), Validators.max(100)]]
      }),
      minimumBuildingDistance: ['', [Validators.min(0)]]
    });
  }

  handleNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    const isPercentage = input.getAttribute('formControlName') === 'percentage';

    if (input.value && value < 0) {
      input.value = '0';
      this.updateFormControl(input, 0);
    } else if (isPercentage && value > 100) {
      input.value = '100';
      this.updateFormControl(input, 100);
    }
  }

  private updateFormControl(input: HTMLInputElement, value: number) {
    const path = input.getAttribute('formControlName');
    const group = input.getAttribute('formGroupName');
    if (path) {
      if (group) {
        this.constraintsForm.get(group)?.get(path)?.setValue(value);
      } else {
        this.constraintsForm.get(path)?.setValue(value);
      }
    }
  }

  handlePropertyTypeChange(event: Event, location: 'front' | 'side' | 'rear', className: string) {
    const checkbox = event.target as HTMLInputElement;
    this.updatePropertyTypes(location, className, checkbox.checked);
  }

  private updatePropertyTypes(location: 'front' | 'side' | 'rear', className: string, checked: boolean) {
    const typesControl = this.constraintsForm.get(`adjacentProperties.${location}Types`);
    const currentTypes = typesControl?.value as string[] || [];
    
    if (checked) {
      typesControl?.setValue([...currentTypes, className]);
    } else {
      typesControl?.setValue(currentTypes.filter(type => type !== className));
    }
  }

  isPropertyTypeSelected(location: 'front' | 'side' | 'rear', className: string): boolean {
    const types = this.constraintsForm.get(`adjacentProperties.${location}Types`)?.value as string[] || [];
    return types.includes(className);
  }

  onSubmit() {
    if (this.constraintsForm.valid) {
        this.save.emit(this.constraintsForm.value);
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
  }
} 