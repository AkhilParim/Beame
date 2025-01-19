import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { complianceQuestions } from '../../data/compliance-questions';

interface QueryResponse {
  content: string;
  thought: string;
  action: string;
  observation: string;
  output: string;
}

interface ReportSection {
  title: string;
  response: QueryResponse | null;
  isLoading: boolean;
  error: string | null;
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

  formatProjectDetails(): string {
    const adjacentStreets = [];
    for (let i = 1; i <= Number(this.formData.numberOfStreets); i++) {
      const street = this.formData[`adjacentStreet${i}`];
      if (street) {
        adjacentStreets.push(street.toString());
      }
    }

    const details = {
      developmentType: this.formData.developmentType.toString(),
      classType: this.formData.classType.toString(),
      developmentStatus: this.formData.developmentStatus.toString(),
      propertySize: this.formData.propertySize.toString() + ' acres',
      buildingHeight: this.formData.buildingHeight.toString() + ' feet',
      numberOfAdjacentStreets: this.formData.numberOfStreets.toString(),
      adjacentStreets: adjacentStreets,
      floodplainZone: this.formData.floodplainZone.toString()
    };

    // Create the details string
    const detailsEntries = Object.entries(details).filter(([key]) => key !== 'adjacentStreets');
    const detailsString = [
      ...detailsEntries.map(([k, v]) => `${k}: ${v}`),
      `adjacentStreets: ${details.adjacentStreets.join(', ')}`
    ].join(', ');

    return detailsString
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
    
    const questions = this.formData.testQuery ? 
      [{title: 'Test Query', question: this.formData.testQuery}] : // Use test query if available
      complianceQuestions;

    this.totalApiCalls = questions.length;

    // Initialize report sections
    this.reportSections = questions.map(({title}) => ({
      title: title,
      response: null,
      isLoading: true,
      error: null
    }));

    const projectDetailsString = this.formatProjectDetails();
    
    // Make individual API calls for each question
    questions.forEach(({question}, index) => {
      this.appService.queryDocuments(question, projectDetailsString)
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
    if(this.formData.testQuery) { this.router.navigate(['/admin/test-api']); }
    else { this.router.navigate(['/new-project']); }
  }
} 