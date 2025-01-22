import { Routes } from '@angular/router';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ComplianceReportComponent } from './components/compliance-report/compliance-report.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectLimitGuard } from './guards/project-limit.guard';

export const routes: Routes = [
  { path: 'projects', component: ProjectsComponent },
  { path: 'new-project', component: NewProjectComponent, canActivate: [ProjectLimitGuard] },
  { path: 'admin/test-api', component: NewProjectComponent, data: { isTestMode: true } },
  { path: 'report', component: ComplianceReportComponent },
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: '**', redirectTo: '/projects' }
];
