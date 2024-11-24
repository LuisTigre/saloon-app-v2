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
      "src": "https://plus.unsplash.com/photo-1?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Liam Thompson",
      "country": "USA",
      "src": "https://plus.unsplash.com/photo-2?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Sophia Smith",
      "country": "USA",
      "src": "https://plus.unsplash.com/photo-3?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Oliver Johnson",
      "country": "USA",
      "src": "https://plus.unsplash.com/photo-4?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Krzysztof Kowalski",
      "country": "Poland",
      "src": "https://plus.unsplash.com/photo-5?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Anna Nowak",
      "country": "Poland",
      "src": "https://plus.unsplash.com/photo-6?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Jean Nkurunziza",
      "country": "Rwanda",
      "src": "https://plus.unsplash.com/photo-7?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Aline Uwase",
      "country": "Rwanda",
      "src": "https://plus.unsplash.com/photo-8?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Eric Mugisha",
      "country": "Rwanda",
      "src": "https://plus.unsplash.com/photo-9?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Chidera Okafor",
      "country": "Nigeria",
      "src": "https://plus.unsplash.com/photo-10?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Fatima Ahmed",
      "country": "Sudan",
      "src": "https://plus.unsplash.com/photo-11?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Diana Njoroge",
      "country": "Kenya",
      "src": "https://plus.unsplash.com/photo-12?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Lucas Bakari",
      "country": "Tanzania",
      "src": "https://plus.unsplash.com/photo-13?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Abdulaye Diallo",
      "country": "Senegal",
      "src": "https://plus.unsplash.com/photo-14?q=80&w=1470&auto=format&fit=crop"
    },
    {
      "name": "Marie-Louise Mbemba",
      "country": "Congo",
      "src": "https://plus.unsplash.com/photo-15?q=80&w=1470&auto=format&fit=crop"
    }
  ]
  
  
}
