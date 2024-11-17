import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';


@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
  ],
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss'
})
export class PagerComponent {
  open!: boolean; 

  handleToogleMenu(): void{
    this.open = this.open == false ? true : false;
  }
}
