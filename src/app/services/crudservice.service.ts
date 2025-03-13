import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudserviceService {
  private apiUrl: string = `http://${window.location.hostname || 'localhost'}:8000/api`;

  constructor(private httpClient: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('auth-token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getAll<T>(endpoint: string): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${endpoint}`, { headers: this.getHeaders() });
  }

  create<T>(endpoint: string, item: T): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}/${endpoint}`, item, { headers: this.getHeaders() });
  }

  get<T>(endpoint: string, id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${endpoint}/${id}`, { headers: this.getHeaders() });
  }

  update<T>(endpoint: string, id: number, item: T): Observable<T> {
    return this.httpClient.put<T>(`${this.apiUrl}/${endpoint}/${id}`, item, { headers: this.getHeaders() });
  }

  delete<T>(endpoint: string, id: number): Observable<T> {
    return this.httpClient.delete<T>(`${this.apiUrl}/${endpoint}/${id}`, { headers: this.getHeaders() });
  }
}
