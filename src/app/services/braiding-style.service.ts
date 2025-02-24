import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type BraidingStyleResponse = {
  id: number; 
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

type BraidStyleDetailsResponse = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  stylesAtribues: BraidsAtributes[];  // Available styles
  duration: number;  // Duration in hours/minutes
  date: string;
  time: string;
  price: string;
  editable: boolean;
}

type BraidsAtributes = {
  id: number; 
  name: string;
  value: string;
  
}


@Injectable({
  providedIn: 'root',
})
export class BraidingStylesService {
  private apiUrl: string = `http://${window.location.hostname || 'localhost'}:8000/api/braiding-styles`;
  constructor(private httpClient: HttpClient) {}

  // Fetch all braiding styles
  getBraidingStyles(): Observable<BraidingStyleResponse[]> {
    return this.httpClient.get<BraidingStyleResponse[]>(this.apiUrl).pipe(
      map((styles: any[]) => styles.map((style: any) => ({
        id: style.id,
        name: style.style_name,
        description: style.description,
        price: parseFloat(style.price),
        duration: parseFloat(style.duration),
        image: style.images.find((img: any) => img.is_main_image)?.image_url || ''
      })))
    );
  }

  // Fetch braiding style Details
  getBraidingStyleDetail(id: string): Observable<BraidStyleDetailsResponse> {
    return this.httpClient.get<any>(`${this.apiUrl}/${id}/showDetails`).pipe(
      map((style: any) => ({
        id: style.id,
        title: style.title,
        description: style.description,
        imageUrl: style.imageUrls && style.imageUrls.length > 0 ? style.imageUrls[0] : '',
        stylesAtribues: style.attributes 
          ? style.attributes.map((attr: any, index: number) => ({
              id: index, // Assigning a unique ID based on index
              name: attr.name,
              value: attr.values.join(', ') // Joining values into a single string
            }))
          : [],
        duration: style.duration,
        date: style.date,
        time: style.time,
        price: style.price.toString(), // Converting price to string
        editable: style.editable ?? false // Defaulting editable to false if not present
      }))
    );
  }
  
  
  
}

  
