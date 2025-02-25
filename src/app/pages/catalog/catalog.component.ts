import { Component, OnInit } from '@angular/core';
import { PagerComponent } from "../../components/pager/pager.component";
import { SearchboxComponent } from '../../components/searchbox/searchbox.component';
import { CardComponent } from "../../components/card/card.component";
import { Card } from "../../components/card/card.component";
import { BraidingStylesService } from '../../services/braiding-style.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [PagerComponent, SearchboxComponent, CardComponent],
  providers: [BraidingStylesService],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent implements OnInit {
  
  def_img: string = "https://media.istockphoto.com/id/2186821055/pl/zdj%C4%99cie/kobieta-postawi%C5%82a-nowoczesne-akcesoria-do-w%C5%82os%C3%B3w.jpg?s=612x612&w=0&k=20&c=0K96UKxNQ3xQmTps3bPddDFT_Eji-LgC9VZSJeoOKuo=";
  cards: Card[] = [];

  constructor(private braidingStylesService: BraidingStylesService) {}

  ngOnInit(): void {
    this.braidingStylesService.getBraidingStyles().subscribe({
      next: (response: any[]) => {
        console.log('Braiding styles fetched:', response);
        this.cards = response.map((style: any) => ({
          id: style.id,
          img: style.images && style.images.length > 0 ? style.images[0].image_url : this.def_img,
          title: style.style_name
        }));
      },
      error: (error: any) => console.error('Failed to fetch braiding styles:', error),
    });
  }
}

