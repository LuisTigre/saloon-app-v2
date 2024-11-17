import { Component } from '@angular/core';
import { PagerComponent } from '../../components/pager/pager.component';

@Component({
  selector: 'app-menu-service',
  standalone: true,
  imports: [PagerComponent],
  templateUrl: './menu-service.component.html',
  styleUrl: './menu-service.component.scss'
})
export class MenuServiceComponent {

}
