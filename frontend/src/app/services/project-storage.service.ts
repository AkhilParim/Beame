import { Injectable } from '@angular/core';
import { Project, ReportSection } from '../interfaces/app.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectStorageService {
    private readonly PROJECTS_STORAGE_KEY = 'projects';
  private readonly REPORTS_STORAGE_KEY = 'project_reports';

  constructor() {
    this.initializeProjects();
    this.initializeReports();
  }

  private initializeProjects(): void {
    if (!localStorage.getItem(this.PROJECTS_STORAGE_KEY)) {
      localStorage.setItem(this.PROJECTS_STORAGE_KEY, JSON.stringify([]));
    }
  }

  private initializeReports(): void {
    if (!localStorage.getItem(this.REPORTS_STORAGE_KEY)) {
      localStorage.setItem(this.REPORTS_STORAGE_KEY, JSON.stringify({}));
    }
  }

  getProjects(): Project[] {
    return JSON.parse(localStorage.getItem(this.PROJECTS_STORAGE_KEY) || '[]');
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
      return false;
    }

    const reports = this.getProjectReports();
    delete reports[id];
    
    this.saveProjects(filteredProjects);
    this.saveProjectReports(reports);
    return true;
  }

  private saveProjects(projects: Project[]): void {
    localStorage.setItem(this.PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }

  saveProjectReport(projectId: number, reportSections: ReportSection[]): void {
    const reports = this.getProjectReports();
    reports[projectId] = reportSections.map(section => ({
      title: section.title,
      output: section.response?.output || null
    }));
    this.saveProjectReports(reports);
  }

  private saveProjectReports(reports: { [key: number]: { title: string; output: string | null; }[] }): void {
    localStorage.setItem(this.REPORTS_STORAGE_KEY, JSON.stringify(reports));
  }

  getProjectReport(projectId: number): { title: string; output: string | null; }[] | null {
    const reports = this.getProjectReports();
    return reports[projectId] || null;
  }

  private getProjectReports(): { [key: number]: { title: string; output: string | null; }[] } {
    return JSON.parse(localStorage.getItem(this.REPORTS_STORAGE_KEY) || '{}');
  }
} 