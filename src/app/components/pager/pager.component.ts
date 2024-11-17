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
  menu_button = "menu";

  handleToogleMenu(): void{
    this.open = this.open == false ? true : false;
    if(this.open){
      this.menu_button = "menu_open"
    }else{
      this.menu_button = "menu"
    }
  }
}
