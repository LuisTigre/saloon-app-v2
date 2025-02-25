import { Component } from '@angular/core';
import { PagerComponent } from "../../components/pager/pager.component";
import { MatIconModule } from '@angular/material/icon';
import { BraidingStylesService } from '../../services/braiding-style.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, PagerComponent, MatIconModule], // Add CommonModule here
  providers: [BraidingStylesService],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'] // Corrected styleUrl to styleUrls
})
export class ProductDetailsComponent {
  braidStyle: any = null;

  constructor(private braidingStylesService: BraidingStylesService) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('brast');
  
    if (id) {
      this.braidingStylesService.getBraidingStyleDetail(id).subscribe({
        next: (response: any) => {
          console.log('Braiding style fetched:', response);
          this.braidStyle = response; // Store the fetched data
        },
        error: (error: any) => console.error('Failed to fetch braiding style:', error),
      });
    } else {
      console.error('No braiding style ID found in URL');
    }
  }
  
}
