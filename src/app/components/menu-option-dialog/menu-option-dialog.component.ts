import { Component, ViewChild } from '@angular/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';  // Import MatMenuModule for standalone component

@Component({
  selector: 'app-menu-option-dialog',
  standalone: true,
  imports: [MatMenuModule],
  templateUrl: './menu-option-dialog.component.html',
  styleUrl: './menu-option-dialog.component.scss'
})
export class MenuOptionDialogComponent {
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  triggerMenu() {
    this.menuTrigger.openMenu();  // Open the menu programmatically
  }

  
}
