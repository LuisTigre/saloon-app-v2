import { Component } from '@angular/core';
import { PagerComponent } from "../../components/pager/pager.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-bookings',

  standalone: true,
  imports: [PagerComponent, CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent {
  menu: string[] = [
    'All',
    'Pending',
    'To Pay',
    'Canceled',
    'To be Rated',
  ];
}
