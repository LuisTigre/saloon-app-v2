import { Component } from '@angular/core';
import { PagerComponent } from "../../components/pager/pager.component";
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SearchboxComponent } from "../../components/searchbox/searchbox.component";
@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [PagerComponent, CommonModule, MatIcon, SearchboxComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  menu: string[] = [
    'In Progress',
    'Awaiting Confirmation',
    'No Show',
    'Rescheduled',
    'Expired',
    'Completed',
    'Refunded',
  ];

  clientes = [
    {
      "name": "Zanda Zakwisha",
      "country": "USA",
      "src": "https://plus.unsplash.com/premium_photo-1690579805273-fd0c7b08035d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "name": "Liam Thompson",
      "country": "USA",
      "src": ""
    },
    {
      "name": "Sophia Smith",
      "country": "USA",
      "src": ""
    },
    {
      "name": "Oliver Johnson",
      "country": "USA",
      "src": ""
    },
    {
      "name": "Krzysztof Kowalski",
      "country": "Poland",
      "src": ""
    },
    {
      "name": "Anna Nowak",
      "country": "Poland",
      "src": ""
    },
    {
      "name": "Jean Nkurunziza",
      "country": "Rwanda",
      "src": ""
    },
    {
      "name": "Aline Uwase",
      "country": "Rwanda",
      "src": ""
    },
    {
      "name": "Eric Mugisha",
      "country": "Rwanda",
      "src": ""
    },
    {
      "name": "Chidera Okafor",
      "country": "Nigeria",
      "src": ""
    },
    {
      "name": "Fatima Ahmed",
      "country": "Sudan",
      "src": ""
    },
    {
      "name": "Diana Njoroge",
      "country": "Kenya",
      "src": ""
    },
    {
      "name": "Lucas Bakari",
      "country": "Tanzania",
      "src": ""
    },
    {
      "name": "Abdulaye Diallo",
      "country": "Senegal",
      "src": ""
    },
    {
      "name": "Marie-Louise Mbemba",
      "country": "Congo",
      "src": ""
    }
  ]
  
  
}
