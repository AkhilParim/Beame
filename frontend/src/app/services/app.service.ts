import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  formatted_answer: string;
  relevant_documents?: string[];
  references?: string[];
  additional_context?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = `${environment.apiUrl}/query`;

  constructor(private http: HttpClient) {}

  queryDocuments(question: string): Observable<QueryResponse> {
    const request: QueryRequest = { question };
    return this.http.post<QueryResponse>(this.apiUrl, request);
  }
} 