import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DesignConstraintsComponent } from '../design-constraints/design-constraints.component';
import { ProjectStorageService } from '../../services/project-storage.service';
import { Project } from '../../app.interface';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DesignConstraintsComponent]
})
export class ProjectsComponent {
  constructor(private router: Router, private projectStorage: ProjectStorageService) {
    this.projects = this.projectStorage.getProjects();
  }

  projects: Project[] = [];
  selectedProject: Project | null = null;
  showDesignConstraints = false;

  selectProject(project: Project): void {
    if (this.selectedProject?.id === project.id) {
      this.selectedProject = null;
    } else {
      this.selectedProject = project;
    }
  }

  viewReport(): void {
    if (!this.selectedProject) return;
    
    // Navigate to report page to view existing report
    this.router.navigate(['/report'], { 
      state: { 
        formData: this.selectedProject,
        isNewReport: false
      } 
    });
  }

  createProject() {
    this.router.navigate(['/new-project']);
  }

  addDesignConstraints(): void {
    if (!this.selectedProject) return;
    this.showDesignConstraints = true;
  }

  onDesignConstraintsClose(): void {
    this.showDesignConstraints = false;
  }

  onDesignConstraintsSave(data: any): void {
    if (!this.selectedProject) return;
    
    const updatedProject = {
      ...this.selectedProject,
      designConstraints: data
    };
    
    const savedProject = this.projectStorage.updateProject(this.selectedProject.id!, updatedProject);
    this.projects = this.projectStorage.getProjects();
    this.showDesignConstraints = false;

    // Navigate to report page with the updated project
    this.router.navigate(['/report'], { state: { formData: savedProject } });
  }
} 