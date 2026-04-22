import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.api}profile/`);
  }

  updateProfile(data: Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(`${this.api}profile/`, data);
  }
}