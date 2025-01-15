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

interface ReportSection {
  question: string;
  response: QueryResponse | null;
  isLoading: boolean;
  error: string | null;
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
  reportSections: ReportSection[] = [];
  isGenerating = false;
  reportDate = new Date().toLocaleDateString();
  private completedApiCalls = 0;
  private totalApiCalls = 0;

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

  private checkAllApisCompleted() {
    this.completedApiCalls++;
    if (this.completedApiCalls === this.totalApiCalls) {
      this.isGenerating = false;
    }
  }

  generateReport() {
    this.isGenerating = true;
    this.completedApiCalls = 0;
    
    const questions = [
      'What are the Landscape Buffer yard requirements?',
      'What are the Buffer yard dimensions?',
      'What are the Building height requirements?',
      'What are the Type of building requirements?',
      'What are the Planting requirements within the buffer yard?',
      'What are the Screening requirements within the buffer yard?',
      'What are the Building restrictions within the setback?',
      'What are the grading/elevations restrictions?'
    ];

    this.totalApiCalls = questions.length;

    // Initialize report sections
    this.reportSections = questions.map(question => ({
      question,
      response: null,
      isLoading: true,
      error: null
    }));

    const projectDetails = this.formatProjectDetails();
    
    // Make individual API calls for each question
    questions.forEach((question, index) => {
      this.appService.queryDocuments(question, projectDetails)
        .pipe(
          catchError(error => {
            console.error(`Error fetching response for question: ${question}`, error);
            return of(null);
          }),
          finalize(() => {
            this.reportSections[index].isLoading = false;
            this.checkAllApisCompleted();
          })
        )
        .subscribe(response => {
          if (response) {
            this.reportSections[index].response = response;
          } else {
            this.reportSections[index].error = 'Failed to load this section';
          }
        });
    });
  }

  printReport() {
    window.print();
  }

  backToProjects() {
    this.router.navigate(['/new-project']);
  }
} 