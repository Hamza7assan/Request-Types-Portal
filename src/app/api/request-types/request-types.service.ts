import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestType } from './request-types-dto';
import { RequestState } from './request-types-enums';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RequestTypesService {

  private readonly http = inject(HttpClient);
  
  private readonly API_URL = `${environment.apiUrl}/requestTypes`;

  getAllRequestTypes(): Observable<RequestType[]> {
    return this.http.get<RequestType[]>(this.API_URL);
  }

  
  getRequestTypeById(id: string): Observable<RequestType> {
    return this.http.get<RequestType>(`${this.API_URL}/${id}`);
  }

  // updates only the state (active/inactive)
  toggleRequestState(id: string, newState: RequestState): Observable<RequestType> {
    return this.http.patch<RequestType>(`${this.API_URL}/${id}`, { state: newState });
  }

  
  deleteRequestType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  
  createRequestType(data: Partial<RequestType>): Observable<RequestType> {
    return this.http.post<RequestType>(this.API_URL, data);
  }

  updateRequestType(id: string, data: Partial<RequestType>): Observable<RequestType> {
    return this.http.put<RequestType>(`${this.API_URL}/${id}`, data);
  }
}