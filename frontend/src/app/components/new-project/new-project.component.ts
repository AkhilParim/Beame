import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../../services/app.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { 
  DevelopmentClass, 
  developmentClasses, 
  developmentStatuses, 
  streetTypes, 
  floodplainZones 
} from '../../data/form-data';

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-project.component.html',
  styleUrl: './new-project.component.scss'
})
export class NewProjectComponent {
  projectForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  developmentClasses: DevelopmentClass[] = developmentClasses;
  developmentStatuses = developmentStatuses;
  streetTypes = streetTypes;
  floodplainZones = floodplainZones;
  selectedClassTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private appService: AppService
  ) {
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
      floodplainZone: ['']
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
      console.log('Form Data:', formData);

      // Reset state
      this.isLoading = true;
      this.errorMessage = null;

      // Example query based on form data
      const question = `What are the requirements for a ${formData.classType} development with building height ${formData.buildingHeight} feet?`;

      this.appService.queryDocuments(question)
        .pipe(
          catchError(error => {
            console.error('API Error:', error);
            this.errorMessage = 'Failed to fetch requirements. Please try again.';
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(response => {
          if (response) {
            console.log('API Response:', response);
            // Handle the response - you might want to store it in a property
            // or emit it to a parent component
          }
        });
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
