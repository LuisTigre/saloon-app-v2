import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export type Hairstyle = {
  id: number;
  title: string;
  description: string;
  imageUrl: string[];
  stylesAtributes: StyleAttribute[];
  duration: number;
  price: string;
};



@Injectable({
  providedIn: 'root',
})
export class BraidingStylesService {
  private apiUrl: string = `http://${
    window.location.hostname || 'localhost'
  }:8000/api`;

  constructor(private httpClient: HttpClient) {}

  // Fetch all braiding styles
  getBraidingStyles(): Observable<BraidingStyleResponse[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}/hairstyles`);
  }

  // Fetch braiding style details
  getBraidingStyleDetail(id: string): Observable<Hairstyle> {
    return this.httpClient.get<Hairstyle>(`${this.apiUrl}/hairstyles/${id}/showDetails`);
  }
   // Fetch braiding style details
   getAllAttributes(): Observable<Hairstyle> {
    return this.httpClient.get<Hairstyle>(`${this.apiUrl}/hairstyle-attributes`);
  }
   // Fetch braiding style details
   getAttributeValuesByHairstyleId(id: Number): Observable<Hairstyle> {
    return this.httpClient.get<any>(`${this.apiUrl}/hairstyles-attributes/${id}/values`);
  }

  createBraindingsStyle(
    name: string,
    description: string,
    duration: string,
    price: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`,
    });
    return this.httpClient.post<any>(
      `${this.apiUrl}/hairstyles`,
      { name, description, duration, price },
      { headers }
    );
  } 

  updateBraindingsStyle(
    name: string,
    description: string,
    duration: string,
    price: string
  ): Observable<any> {
    const urlParams = new URLSearchParams(window.location.search);
    const braid_id = urlParams.get('brast');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`,
    });
    return this.httpClient.put<any>(
      `${this.apiUrl}/hairstyles/${braid_id}`,
      { name, description, duration, price },
      { headers }
    );
  }
  
  createBraindingsAttribute(
    attribute_name: string,
    attribute_value: string,
  ): Observable<any> {
    const urlParams = new URLSearchParams(window.location.search);
    const braid_id = urlParams.get('brast');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`,
    });
    return this.httpClient.post<any>(
      `${this.apiUrl}/${braid_id}/attributes`,
      { attribute_name, attribute_value },
      { headers }
    );
  }

  attachHairAttribute(
    hairstyle_id: number,
    hairstyle_attribute_value_id: number,
    additional_cost: number,
    cost_type: string
  ): Observable<any> {
    const urlParams = new URLSearchParams(window.location.search);
    const braid_id = urlParams.get('brast');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`,
    });
    return this.httpClient.post<any>(
      `${this.apiUrl}/hairstyle-attribute-pricing`,
      { hairstyle_id, hairstyle_attribute_value_id, additional_cost, cost_type },
      { headers }
    ); 
  }
  
  updateAttachedHairAttribute(
    att_price_id: number,    
    additional_cost: number,
    cost_type: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`,
    });
    return this.httpClient.put<any>(
      `${this.apiUrl}/hairstyle-attribute-pricing/${att_price_id}`,
      { additional_cost, cost_type },
      { headers }
    );
  }

  deleteAttachedHairAttribute(
    att_price_id: number
  ): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`,
    });
    return this.httpClient.delete<any>(
      `${this.apiUrl}/hairstyle-attribute-pricing/${att_price_id}`,
      { headers }
    );
  }
  
}

