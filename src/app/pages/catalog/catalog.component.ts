import { Component } from '@angular/core';
import { PagerComponent } from "../../components/pager/pager.component";
import { SearchboxComponent } from '../../components/searchbox/searchbox.component';
import { CardComponent } from "../../components/card/card.component";
import { Card } from "../../components/card/card.component";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [PagerComponent, SearchboxComponent, CardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {
  
  cards: Card[] = [
    {
      img: "../../../assets/img/gallery/braid1.PNG",
      title: "Buttlefly Locks"
    },
    {
      img: "../../../assets/img/gallery/braid2.PNG",
      title: "Buttlefly Locks"
    },
    {
      img: "../../../assets/img/gallery/braid3.PNG",
      title: "Buttlefly Locks"
    },
    {
      img: "../../../assets/img/gallery/braid4.PNG",
      title: "Buttlefly Locks"
    },
    {
      img: "../../../assets/img/gallery/braid5.PNG",
      title: "Buttlefly Locks"
    },
    {
      img: "../../../assets/img/gallery/braid6.PNG",
      title: "Buttlefly Locks"
    }
  ];

}
