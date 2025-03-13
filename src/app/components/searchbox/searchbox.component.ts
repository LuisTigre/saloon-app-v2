import { Component, Output, EventEmitter } from '@angular/core';
import { PagerComponent } from '../pager/pager.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-searchbox',
  standalone: true,
  imports: [PagerComponent, MatIconModule],
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent {
  @Output() search = new EventEmitter<string>();

  onSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.search.emit(inputElement.value);
  }
}
