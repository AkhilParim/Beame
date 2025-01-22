import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  DevelopmentClass, 
  developmentClasses, 
  developmentStatuses, 
  streetTypes, 
  floodplainZones 
} from '../../data/form-data';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ProjectStorageService } from '../../services/project-storage.service';
import { DesignConstraintsComponent } from '../design-constraints/design-constraints.component';
import { NoWheelDirective } from '../../directives/no-wheel.directive';
import { NoEnterSubmitDirective } from '../../directives/no-enter-submit.directive';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    DesignConstraintsComponent,
    NoWheelDirective,
    NoEnterSubmitDirective
  ],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {
  projectForm: FormGroup; // TODO: could give a type
  isTestMode = false;
  showDesignConstraints = false;
  designConstraintsData: any;

  developmentClasses: DevelopmentClass[] = developmentClasses;
  developmentStatuses = developmentStatuses;
  streetTypes = streetTypes;
  floodplainZones = floodplainZones;
  selectedClassTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private projectStorage: ProjectStorageService
  ) {
    this.isTestMode = this.route.snapshot.data['isTestMode'] || false;

    this.projectForm = this.fb.group({
      projectName: ['', this.isTestMode ? [] : [Validators.required]],
      projectDescription: [''],
      developmentType: ['', Validators.required],
      classType: ['', Validators.required],
      developmentStatus: ['', Validators.required],
      propertySize: ['', [Validators.required, Validators.min(0)]],
      buildingHeight: ['', [Validators.required, Validators.min(0)]],
      numberOfStreets: [1, Validators.required],
      adjacentStreet1: ['', Validators.required],
      adjacentStreet2: [''],
      adjacentStreet3: [''],
      adjacentStreet4: [''],
      floodplainZone: ['', Validators.required],
      testQuery: ['', this.isTestMode ? [Validators.required] : []]
    });

    this.projectForm.get('numberOfStreets')?.valueChanges.subscribe(newNumberOfStreets => {
      // Reset values for removed streets and set validators for added streets
      const numStreets = Number(newNumberOfStreets);
      
      for (let i = 1; i <= 4; i++) {
        const streetControl = this.projectForm.get(`adjacentStreet${i}`)!;
        if (i <= numStreets) {
          streetControl.setValidators([Validators.required]);
        } else {
          streetControl.clearValidators();
          this.projectForm.patchValue({ [`adjacentStreet${i}`]: '' });
        }
        streetControl.updateValueAndValidity();
      }
    });

    this.projectForm.get('developmentType')?.valueChanges.subscribe(selectedType => {
      this.projectForm.patchValue({ classType: '' });
      const selectedClass = this.developmentClasses.find(dc => dc.name === selectedType);
      this.selectedClassTypes = selectedClass?.types || [];
    });
  }

  onDesignConstraintsSave(data: any) {
    this.designConstraintsData = data;
    this.toastService.showToast('Design constraints saved successfully', 'success');
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formData = {
        project: this.projectForm.value,
        designConstraints: this.designConstraintsData
      };
      
      // Add project to storage and set as current
      let savedProject;
      if (this.isTestMode) {
        savedProject = formData;  // no storage for test mode
      } else {
        savedProject = this.projectStorage.addProject(formData);
      }
      
      this.router.navigate(['/report'], { state: { formData: savedProject, isTestMode: this.isTestMode, isNewReport: true } });
    } else {
      Object.keys(this.projectForm.controls).forEach(key => {
        const control = this.projectForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      this.toastService.showToast('Please fill in all required fields', 'error');
    }
  }

  get developmentTypes(): string[] {
    return this.developmentClasses.map(dc => dc.name);
  }

  get numberOfStreetsToShow(): number {
    const value = this.projectForm.get('numberOfStreets')?.value;
    return value ? Number(value) : 0;  // Return 0 if no value is selected
  }
}
