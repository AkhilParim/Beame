import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { complianceQuestions, ComplianceQuestion } from '../../data/compliance-questions';
import { Project } from '../../app.interface';
import { ReportSection } from '../../app.interface';
import { ProjectStorageService } from '../../services/project-storage.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-compliance-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance-report.component.html',
  styleUrl: './compliance-report.component.scss'
})
export class ComplianceReportComponent implements OnInit {
  formData: Project;
  reportSections: ReportSection[] = [];
  isGenerating = false;
  reportDate = new Date().toLocaleDateString();
  isTestMode: any;
  isNewReport: boolean;
  private completedApiCalls = 0;
  private totalApiCalls = 0;

  constructor(
    private router: Router,
    private appService: AppService,
    private projectStorage: ProjectStorageService,
    private toastService: ToastService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.formData = navigation?.extras?.state?.['formData'];
    this.isTestMode = navigation?.extras?.state?.['isTestMode'];
    this.isNewReport = navigation?.extras?.state?.['isNewReport'] ?? true;

    if (!this.formData || (!this.isTestMode && !this.formData.id)) {
      this.toastService.showToast('Project data not found', 'error');
      this.router.navigate(['/projects']);
      return;
    }
  }

  ngOnInit() {
    // If it's not a new report and not test mode, try to load from storage first
    if (!this.isNewReport && !this.isTestMode) {
      const storedReport = this.projectStorage.getProjectReport(this.formData.id!);
      if (storedReport) {
        // Convert stored report back to ReportSection format
        this.reportSections = storedReport.map(item => ({
          title: item.title,
          response: item.output ? {
            content: '',
            thought: '',
            action: '',
            observation: '',
            output: item.output
          } : null,
          isLoading: false,
          error: null
        }));
        return;
      }
    }

    // If we're here, either it's a new report or we couldn't find a stored report
    this.generateReport();
  }

  formatProjectDetails(): string {  // TODO: could move to a service
    if (!this.formData) return '';

    const project = this.formData.project;
    const constraints = this.formData.designConstraints;

    const adjacentStreets = [];
    for (let i = 1; i <= Number(project.numberOfStreets); i++) {
      const street = project[`adjacentStreet${i}` as keyof typeof project];
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
      if (constraints.newParkingLot && (constraints.parkingLot.area || constraints.parkingLot.numberOfSpots || constraints.parkingLot.stallWidth || constraints.parkingLot.stallLength)) {
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

      if (constraints.imperviousArea.area || constraints.imperviousArea.percentage) {
        details += '\n\nImpervious Area:\n';
        if (constraints.imperviousArea.area) details += `- Area: ${constraints.imperviousArea.area} sq ft\n`;
        if (constraints.imperviousArea.percentage) details += `- Percentage: ${constraints.imperviousArea.percentage}%\n`;
      }

      if (constraints.perviousArea.area || constraints.perviousArea.percentage) {
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
      // If we are here and are in test mode, we don't need to save the report
      if (!this.isTestMode) {
        this.projectStorage.saveProjectReport(this.formData.id!, this.reportSections);
      }
    }
  }

  generateReport() {
    this.isGenerating = true;
    this.completedApiCalls = 0;
    
    const questions: ComplianceQuestion[] = this.formData.project.testQuery ? 
      [{title: 'Test Query', question: this.formData.project.testQuery}] : // Use test query if available
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
    if(this.isTestMode) { this.router.navigate(['/admin/test-api']); }
    else { this.router.navigate(['/projects']); }
  }
} 