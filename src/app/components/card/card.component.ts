import { CommonModule } from '@angular/common';
import { Component, Input, Type } from '@angular/core';
import { SearchboxComponent } from "../searchbox/searchbox.component";

export interface Card {
  img: string;
  title: string;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, SearchboxComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  
  @Input() data: Card[] = [];
  

}
