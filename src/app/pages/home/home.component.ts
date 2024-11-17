import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagerComponent } from '../../components/pager/pager.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PagerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @Input() open!: boolean;

  @Output() toogleMenu = new EventEmitter(); 
  

  handleToogleMenu(): void{
    this.toogleMenu.emit(open);
  }

}
