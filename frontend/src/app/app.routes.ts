import { Routes } from '@angular/router';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ComplianceReportComponent } from './components/compliance-report/compliance-report.component';

export const routes: Routes = [
  { path: 'new-project', component: NewProjectComponent },
  { path: 'admin/test-api', component: NewProjectComponent, data: { isTestMode: true } },
  { path: 'report', component: ComplianceReportComponent },
  { path: '', redirectTo: '/new-project', pathMatch: 'full' },
  { path: '**', redirectTo: '/new-project' }
];
