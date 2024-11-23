import { Component } from '@angular/core';
import { PagerComponent } from "../../components/pager/pager.component";
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [PagerComponent, CommonModule, MatIcon],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent {
  menu: string[] = [
    'All',
    'Pending',
    'To Pay',
    'Canceled',
    'To be Rated',
  ];

  bookings = [
    {
      date: "February 14",
      time: "13:15",
      service: {
        name: "Butter-fly locs",
        length: "long",
        color: "brow",
        style: "curly"
      },
      status: "Please pay the booking fee",
      amount: "PLN 700.00"
    },
    {
      date: "February 14",
      time: "13:15",
      service: {
        name: "Butter-fly locs",
        length: "long",
        color: "brow",
        style: "curly"
      },
      status: "All Confirmed, see you soon",
      amount: "PLN 700.00"
    },
    {
      date: "February 14",
      time: "13:15",
      service: {
        name: "Butter-fly locs",
        length: "long",
        color: "brow",
        style: "curly"
      },
      status: "Please complete the payment",
      amount: "PLN 700.00"
    },
    {
      date: "February 14",
      time: "13:15",
      service: {
        name: "Butter-fly locs",
        length: "long",
        color: "brow",
        style: "curly"
      },
      status: "Please rate the service",
      amount: "PLN 700.00"
    },
    {
      date: "February 14",
      time: "13:15",
      service: {
        name: "Butter-fly locs",
        length: "long",
        color: "brow",
        style: "curly"
      },
      status: "Thank you, come back soon",
      amount: "PLN 700.00"
    }
  ];
}
