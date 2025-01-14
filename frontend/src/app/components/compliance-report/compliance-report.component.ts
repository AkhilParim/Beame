import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface QueryResponse {
  content: string;
  thought: string;
  action: string;
  observation: string;
  output: string;
}

interface ProjectDetails {
  projectName?: string;
  projectDescription?: string;
  developmentType: string;
  classType: string;
  developmentStatus: string;
  propertySize: string;
  buildingHeight: string;
  numberOfStreets: number;
  adjacentStreets: string[];
  floodplainZone: string;
}

@Component({
  selector: 'app-compliance-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance-report.component.html',
  styleUrl: './compliance-report.component.scss'
})
export class ComplianceReportComponent implements OnInit {
  formData: any;
  reportOutput: string | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  reportDate = new Date().toLocaleDateString();

  constructor(
    private router: Router,
    private appService: AppService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.formData = navigation?.extras?.state?.['formData'];
    
    if (!this.formData) {
      this.router.navigate(['/new-project']);
    }
  }

  ngOnInit() {
    this.generateReport();
  }

  formatProjectDetails(): ProjectDetails {
    const adjacentStreets = [];
    for (let i = 1; i <= Number(this.formData.numberOfStreets); i++) {
      const street = this.formData[`adjacentStreet${i}`];
      if (street) {
        adjacentStreets.push(street.toString());
      }
    }

    return {
      developmentType: this.formData.developmentType.toString(),
      classType: this.formData.classType.toString(),
      developmentStatus: this.formData.developmentStatus.toString(),
      propertySize: this.formData.propertySize.toString(),
      buildingHeight: this.formData.buildingHeight.toString(),
      numberOfStreets: this.formData.numberOfStreets.toString(),
      adjacentStreets: adjacentStreets,
      floodplainZone: this.formData.floodplainZone.toString()
    };
  }

  generateReport() {
    // Reset states before making the API call
    this.isLoading = true;
    this.errorMessage = null;
    this.reportOutput = null;

    const question = `Landscape Buffer yard required or not.
                        Buffer yard dimensions.
                        Building height requirements.
                        Type of building requirements.
                        Planting requirements within the buffer yard.
                        Screening requirements within the buffer yard.
                        Building restrictions within the setback.
                        grading/elevations restrictions.
                      `;
    const projectDetails = this.formatProjectDetails();

    this.appService.queryDocuments(question, projectDetails).pipe(
        catchError(error => {
        console.error('API Error:', error);
        this.errorMessage = 'Failed to generate report. Please try again.';
        return of(null);
        }),
        finalize(() => {
        this.isLoading = false;
        })
    ).subscribe((response: QueryResponse | null) => {
        if (response) {
        console.log("API Response:", response);
        this.reportOutput = response.output;
        }
    });
}

    printReport() {
        window.print();
    }

    backToProjects() {
        this.router.navigate(['/new-project']);
    }
} 