import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project } from '../app.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectStorageService {
  private projectsSubject = new BehaviorSubject<Project[]>([]); // TODO: Might need to remove this

  constructor() {
    this.initializeProjects();
  }

  private initializeProjects(): void {
    if (!localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify([]));
    }
    const projects = this.getProjects();
    this.projectsSubject.next(projects);
  }

  getProjects(): Project[] {
    return JSON.parse(localStorage.getItem('projects') || '[]');
  }

  addProject(projectData: Omit<Project, 'id' | 'createdAt'>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...projectData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  updateProject(id: number, projectData: Partial<Project>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    const updatedProject = {
      ...projects[index],
      ...projectData,
      id, // Ensure ID remains unchanged
      createdAt: projects[index].createdAt // Ensure creation date remains unchanged
    };
    
    projects[index] = updatedProject;
    this.saveProjects(projects);
    return updatedProject;
  }

  deleteProject(id: number): boolean {
    const projects = this.getProjects();
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) {
      return false; // Project not found
    }
    
    this.saveProjects(filteredProjects);
    return true;
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem('projects', JSON.stringify(projects));
    this.projectsSubject.next(projects);
  }
} 