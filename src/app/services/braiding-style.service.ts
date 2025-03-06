import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

type Image = {
  id: number;
  style_id: number;
  image_url: string;
  is_main_image: number;
  created_at: string;
  updated_at: string;
};

export type BraidingStyleResponse = {
  id: number; 
  title: string;
  description: string;
  price: number;
  duration: number;
  images: Image[];
};

type StyleAttributeValue = {
  id: number;
  name: string;
};

type StyleAttribute = {
  id: number;
  name: string;
  values: StyleAttributeValue[];
};

type Hairstyle = {
  id: number;
  title: string;
  description: string;
  imageUrl: string[];
  stylesAtributes: StyleAttribute[];
  duration: number;
  price: string;
  editable: boolean;
};


@Injectable({
  providedIn: 'root',
})
export class BraidingStylesService {
  private apiUrl: string = `http://${window.location.hostname || 'localhost'}:8000/api/braiding-styles`;

  constructor(private httpClient: HttpClient) {}

  // Fetch all braiding styles
  getBraidingStyles(): Observable<BraidingStyleResponse[]> {
    return this.httpClient.get<any[]>(this.apiUrl);      
  }

  // Fetch braiding style details
  getBraidingStyleDetail(id: string): Observable<Hairstyle> {
    return this.httpClient.get<Hairstyle>(`${this.apiUrl}/${id}/showDetails`);
  }

  
  
  
  
}
