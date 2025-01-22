import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QueryRequest, QueryResponse } from '../interfaces/app.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService { // TODO: change the name to HttpService

  constructor(private http: HttpClient) {}

  queryDocuments(question: string, projectDetails: any): Observable<QueryResponse> {
    const request: QueryRequest = {
      question,
      project_details: projectDetails
    };

    return this.http.post<QueryResponse>(`${environment.apiUrl}/query`, request);
  }
} 