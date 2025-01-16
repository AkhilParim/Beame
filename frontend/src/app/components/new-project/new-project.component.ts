import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { 
  DevelopmentClass, 
  developmentClasses, 
  developmentStatuses, 
  streetTypes, 
  floodplainZones 
} from '../../data/form-data';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {
  projectForm: FormGroup;
  isTestMode = false;

  developmentClasses: DevelopmentClass[] = developmentClasses;
  developmentStatuses = developmentStatuses;
  streetTypes = streetTypes;
  floodplainZones = floodplainZones;
  selectedClassTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isTestMode = this.route.snapshot.data['isTestMode'] || false;

    this.projectForm = this.fb.group({
      projectName: [''],
      projectDescription: [''],
      developmentType: [''],
      classType: [''],
      developmentStatus: [''],
      propertySize: [''],
      buildingHeight: [''],
      numberOfStreets: [0],
      adjacentStreet1: [''],
      adjacentStreet2: [''],
      adjacentStreet3: [''],
      adjacentStreet4: [''],
      floodplainZone: [''],
      testQuery: ['']
    });

    this.projectForm.get('developmentType')?.valueChanges.subscribe(selectedType => {
      this.projectForm.patchValue({ classType: '' });
      const selectedClass = this.developmentClasses.find(dc => dc.name === selectedType);
      this.selectedClassTypes = selectedClass?.types || [];
    });

    this.projectForm.get('numberOfStreets')?.valueChanges.subscribe(newNumberOfStreets => {
      // Only reset values for removed streets
      for (let i = Number(newNumberOfStreets) + 1; i <= 4; i++) {
        const key = `adjacentStreet${i}`;
        this.projectForm.patchValue({ [key]: '' });
      }
    });
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const formData = this.projectForm.value;
      this.router.navigate(['/report'], { state: { formData } });
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
