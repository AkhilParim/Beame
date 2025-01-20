import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { complianceQuestions, ComplianceQuestion } from '../../data/compliance-questions';

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
  formData: {
    project: any;
    designConstraints: any;
    testQuery?: string;
  };
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
    if (!this.formData) return '';

    const project = this.formData.project;
    const constraints = this.formData.designConstraints;

    const adjacentStreets = [];
    for (let i = 1; i <= Number(project.numberOfStreets); i++) {
      const street = project[`adjacentStreet${i}`];
      if (street) {
        adjacentStreets.push(street.toString());
      }
    }

    let details = `Development Type: ${project.developmentType}\n`;
    details += `Class Type: ${project.classType}\n`;
    details += `Development Status: ${project.developmentStatus}\n`;
    details += `Property Size: ${project.propertySize} sq ft\n`;
    details += `Building Height: ${project.buildingHeight} ft\n\n`;
    details += `Number of Adjacent Streets: ${project.numberOfStreets}\n`;
    details += `Adjacent Streets: ${adjacentStreets.join(', ')}\n\n`;
    details += `Floodplain Zone: ${project.floodplainZone}\n\n`;

    if (constraints) {
      constraints.cityFundedPublicProject ? details += `This project is a City Funded Public Project\n` : '';
      
      if (constraints.street) {
        details += '\nStreet Details:\n';
        Object.entries(constraints.street).forEach(([key, value]) => {
          if (typeof value === 'boolean' && value) {
            details += `- ${key.replace(/([A-Z])/g, ' $1').trim()}\n`;
          } else if (value && typeof value === 'string') {
            details += `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}\n`;
          }
        });
      }

      if (constraints.sidewalk) {
        details += '\nSidewalk Details:\n';
        Object.entries(constraints.sidewalk).forEach(([key, value]) => {
          if (typeof value === 'boolean' && value) {
            details += `- ${key.replace(/([A-Z])/g, ' $1').trim()}\n`;
          } else if (value && typeof value === 'string') {
            details += `- ${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}\n`;
          }
        });
      }

      constraints.abandonedEasement ? details += `\nAbandoned Easement is used\n` : '';
      constraints.protectedTreesPresent ? details += `\nProtected Trees are present` : '';
      if (constraints.protectedTreesPresent && constraints.protectedTreeType) {
        details += `\nProtected Tree Type: ${constraints.protectedTreeType}\n`;
      }

      constraints.siteEnlargement ? details += `\nSite Enlargement is used` : '';
      if (constraints.siteEnlargement && constraints.enlargementArea) {
        details += `\nEnlargement Area: ${constraints.enlargementArea} sq ft\n`;
      }

      constraints.newParkingLot ? details += `\nNew Parking Lot is constructed` : '';
      if (constraints.newParkingLot && constraints.parkingLot) {
        details += '\nNew Parking Lot Details:\n';
        if (constraints.parkingLot.area) details += `- Area: ${constraints.parkingLot.area} sq ft\n`;
        if (constraints.parkingLot.numberOfSpots) details += `- Number of Spots: ${constraints.parkingLot.numberOfSpots}\n`;
        if (constraints.parkingLot.stallWidth) details += `- Stall Width: ${constraints.parkingLot.stallWidth} ft\n`;
        if (constraints.parkingLot.stallLength) details += `- Stall Length: ${constraints.parkingLot.stallLength} ft\n`;
      }

      constraints.hasAdjacentProperties ? details += `\nAdjacent Properties are present` : '';
      if (constraints.hasAdjacentProperties && constraints.adjacentProperties) {
        if (constraints.adjacentProperties.frontPresent) {
          details += `\n- Front Properties: ${constraints.adjacentProperties.frontTypes.join(', ')}`;
        }
        if (constraints.adjacentProperties.sidePresent) {
          details += `\n- Side Properties: ${constraints.adjacentProperties.sideTypes.join(', ')}`;
        }
        if (constraints.adjacentProperties.rearPresent) {
          details += `\n- Rear Properties: ${constraints.adjacentProperties.rearTypes.join(', ')}`;
        }
      }

      if (constraints.imperviousArea) {
        details += '\n\nImpervious Area:\n';
        if (constraints.imperviousArea.area) details += `- Area: ${constraints.imperviousArea.area} sq ft\n`;
        if (constraints.imperviousArea.percentage) details += `- Percentage: ${constraints.imperviousArea.percentage}%\n`;
      }

      if (constraints.perviousArea) {
        details += '\nPervious Area:\n';
        if (constraints.perviousArea.area) details += `- Area: ${constraints.perviousArea.area} sq ft\n`;
        if (constraints.perviousArea.percentage) details += `- Percentage: ${constraints.perviousArea.percentage}%\n`;
      }

      if (constraints.minimumBuildingDistance) {
        details += `\nMinimum Building Distance from property line: ${constraints.minimumBuildingDistance} ft\n`;
      }

      if (constraints.additionalNotes) {
        details += `\nAdditional Notes: ${constraints.additionalNotes}\n`;
      }
    }

    return details;
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
    
    const questions: ComplianceQuestion[] = this.formData.testQuery ? 
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
    console.log(projectDetailsString);
    
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