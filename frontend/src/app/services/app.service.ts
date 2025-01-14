import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

interface QueryRequest {
  question: string;
  project_details: any;
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {}

  queryDocuments(question: string, projectDetails: any): Observable<any> {
    const request: QueryRequest = {
      question,
      project_details: projectDetails
    };

    return this.http.post(`${environment.apiUrl}/query`, request);
  }
} 