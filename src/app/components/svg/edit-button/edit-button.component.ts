import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-edit-button',
  standalone: true,
  imports: [],
  templateUrl: './edit-button.component.html',
  styleUrl: './edit-button.component.scss'
})
export class EditButtonComponent {
   @Input() width: number = 24;
   @Input() height: number = 24;
}
