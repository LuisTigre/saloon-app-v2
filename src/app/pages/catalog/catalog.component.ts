import { Component } from '@angular/core';
import { PagerComponent } from "../../components/pager/pager.component";
import { SearchboxComponent } from '../../components/searchbox/searchbox.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [PagerComponent, SearchboxComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss'
})
export class CatalogComponent {

}
