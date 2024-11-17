import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() toogleMenu = new EventEmitter(); 
  @Input() menu_button: string = "menu";
  

  handleToogleMenu(): void{                  
    this.toogleMenu.emit();
  }

}
