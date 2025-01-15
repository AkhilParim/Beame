import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { catchError, finalize } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

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
    this.isLoading = true;
    this.errorMessage = null;
    this.reportOutput = null;

    const questions = [
      'What are the Landscape Buffer yard requirements?',
      // 'What are the Buffer yard dimensions?',
      // 'What are the Building height requirements?',
      // 'What are the Type of building requirements?',
      'What are the Planting requirements within the buffer yard?',
      // 'What are the Screening requirements within the buffer yard?',
      // 'What are the Building restrictions within the setback?',
      // 'What are the grading/elevations restrictions?'
    ];

    const projectDetails = this.formatProjectDetails();
    
    // Create an array of API calls
    const apiCalls = questions.map(question => 
      this.appService.queryDocuments(question, projectDetails).pipe(
        catchError(error => {
          console.error('API Error:', error);
          return of(null);
        })
      )
    );

    // Execute all API calls in parallel
    forkJoin(apiCalls).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (responses) => {
        // Check if any response is null (indicating an error)
        if (responses.some(response => response === null)) {
          this.errorMessage = 'Failed to generate some parts of the report. Please try again.';
          return;
        }

        // Combine all responses into a single formatted output
        const combinedOutput = responses.map((response) => {
          return `${(response as QueryResponse).output}`;
        }).join('\n\n');

        this.reportOutput = combinedOutput;
      },
      error: (error) => {
        console.error('ForkJoin Error:', error);
        this.errorMessage = 'Failed to generate report. Please try again.';
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