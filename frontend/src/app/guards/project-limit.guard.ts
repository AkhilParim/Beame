import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectStorageService } from '../services/project-storage.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectLimitGuard implements CanActivate {
  private static readonly MAX_DEMO_PROJECTS = 6;

  constructor(
    private projectStorage: ProjectStorageService,
    private toastService: ToastService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isTestMode = route.data['isTestMode'] || false;

    if (!isTestMode && this.projectStorage.getProjects().length >= ProjectLimitGuard.MAX_DEMO_PROJECTS) {
      this.toastService.showToast(
        `Max ${ProjectLimitGuard.MAX_DEMO_PROJECTS} projects allowed in Demo. Delete a project to add a new one.`,
        'error'
      );
      this.router.navigate(['/projects']);
      return false;
    }
    return true;
  }
} 