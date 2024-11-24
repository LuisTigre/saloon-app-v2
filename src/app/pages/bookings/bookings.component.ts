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
    'In Progress',
    'Awaiting Confirmation',
    'No Show',
    'Rescheduled',
    'Expired',
    'Completed',
    'Refunded',
  ];

  bookings = [
    {
      date: "February 14",
      time: "13:15",
      service: {
        name: "Butter-fly locs",
        length: "long",
        color: "brown",
        style: "curly"
      },
      status: "Please pay the booking fee",
      amount: "PLN 700.00"
    },
    {
      date: "February 15",
      time: "10:30",
      service: {
        name: "Box braids",
        length: "medium",
        color: "black",
        style: "straight"
      },
      status: "All Confirmed, see you soon",
      amount: "PLN 500.00"
    },
    {
      date: "February 16",
      time: "09:00",
      service: {
        name: "Cornrows",
        length: "short",
        color: "blonde",
        style: "wavy"
      },
      status: "Please complete the payment",
      amount: "PLN 350.00"
    },
    {
      date: "February 17",
      time: "11:45",
      service: {
        name: "Twists",
        length: "long",
        color: "red",
        style: "curly"
      },
      status: "Please rate the service",
      amount: "PLN 600.00"
    },
    {
      date: "February 18",
      time: "14:00",
      service: {
        name: "Loc extensions",
        length: "extra long",
        color: "black",
        style: "straight"
      },
      status: "Thank you, come back soon",
      amount: "PLN 800.00"
    },
    {
      date: "February 19",
      time: "15:30",
      service: {
        name: "Knotless braids",
        length: "medium",
        color: "brown",
        style: "wavy"
      },
      status: "Please complete the payment",
      amount: "PLN 550.00"
    },
    {
      date: "February 20",
      time: "12:00",
      service: {
        name: "Faux locs",
        length: "long",
        color: "auburn",
        style: "curly"
      },
      status: "All Confirmed, see you soon",
      amount: "PLN 750.00"
    },
    {
      date: "February 21",
      time: "16:45",
      service: {
        name: "Passion twists",
        length: "short",
        color: "dark brown",
        style: "straight"
      },
      status: "Thank you, come back soon",
      amount: "PLN 450.00"
    },
    {
      date: "February 22",
      time: "10:15",
      service: {
        name: "Crochet braids",
        length: "medium",
        color: "blonde",
        style: "wavy"
      },
      status: "Please rate the service",
      amount: "PLN 600.00"
    },
    {
      date: "February 23",
      time: "13:30",
      service: {
        name: "Feed-in braids",
        length: "long",
        color: "black",
        style: "straight"
      },
      status: "Please pay the booking fee",
      amount: "PLN 500.00"
    }
  ];
  
}
