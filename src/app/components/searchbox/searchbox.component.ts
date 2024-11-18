import { Component } from '@angular/core';
import { PagerComponent } from '../pager/pager.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchbox',
  standalone: true,
  imports: [PagerComponent, MatIconModule],
  templateUrl: './searchbox.component.html',
  styleUrl: './searchbox.component.scss'
})
export class SearchboxComponent {

}
