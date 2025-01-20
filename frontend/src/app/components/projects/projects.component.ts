import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DesignConstraintsComponent } from '../design-constraints/design-constraints.component';

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DesignConstraintsComponent]
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      id: '1',
      name: 'Test',
      description: 'Test',
      tags: ['class1', 'Office']
    },
    {
      id: '2',
      name: 'Another Test Project',
      description: 'Description',
      tags: ['class1', 'Office']
    }
  ];

  selectedProject: Project | null = null;
  showDesignConstraints = false;

  selectProject(project: Project): void {
    if (this.selectedProject?.id === project.id) {
      this.selectedProject = null;
    } else {
      this.selectedProject = project;
    }
  }

  generateReport(): void {
    if (!this.selectedProject) return;
    // TODO: Implement report generation
  }

  addDesignConstraints(): void {
    if (!this.selectedProject) return;
    this.showDesignConstraints = true;
  }

  onDesignConstraintsClose(): void {
    this.showDesignConstraints = false;
  }
} 