import { Component, OnInit, OnDestroy } from '@angular/core';
import { PagerComponent } from '../../components/pager/pager.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SearchboxComponent } from '../../components/searchbox/searchbox.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [PagerComponent, CommonModule, MatIcon, SearchboxComponent],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'] // Corrected: styleUrls instead of styleUrl
})
export class ClientsComponent implements OnInit, OnDestroy {
  menu: string[] = [
    'In Progress',
    'Awaiting Confirmation',
    'No Show',
    'Rescheduled',
    'Expired',
    'Completed',
    'Refunded'
  ];

  optionsList: any[] = [
    { "id": 1, "label": "Delete", "icon": "delete" },
    { "id": 2, "label": "Edit", "icon": "edit" }
]

  clientes = [
    {
      "id": 1,
      "name": "Zanda Zakwisha",
      "country": "USA",
      "src": "https://plus.unsplash.com/premium_photo-1690579805273-fd0c7b08035d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      "id": 2,
      "name": "Liam Thompson",
      "country": "USA",
      "src": ""
    },
    {
      "id": 3,
      "name": "Sophia Smith",
      "country": "USA",
      "src": ""
    },
    {
      "id": 4,
      "name": "Oliver Johnson",
      "country": "USA",
      "src": ""
    },
    {
      "id": 5,
      "name": "Krzysztof Kowalski",
      "country": "Poland",
      "src": ""
    },
    {
      "id": 6,
      "name": "Anna Nowak",
      "country": "Poland",
      "src": ""
    },
    {
      "id": 7,
      "name": "Jean Nkurunziza",
      "country": "Rwanda",
      "src": ""
    },
    {
      "id": 8,
      "name": "Aline Uwase",
      "country": "Rwanda",
      "src": ""
    },
    {
      "id": 9,
      "name": "Eric Mugisha",
      "country": "Rwanda",
      "src": ""
    },
    {
      "id": 10,
      "name": "Chidera Okafor",
      "country": "Nigeria",
      "src": ""
    },
    {
      "id": 11,
      "name": "Fatima Ahmed",
      "country": "Sudan",
      "src": ""
    },
    {
      "id": 12,
      "name": "Diana Njoroge",
      "country": "Kenya",
      "src": ""
    },
    {
      "id": 13,
      "name": "Lucas Bakari",
      "country": "Tanzania",
      "src": ""
    },
    {
      "id": 14,
      "name": "Abdulaye Diallo",
      "country": "Senegal",
      "src": ""
    },
    {
      "id": 15,
      "name": "Marie-Louise Mbemba",
      "country": "Congo",
      "src": ""
    }
  ];

  showdetails: boolean = false;
  inconElement: string = 'expand_more';

  private documentClickHandler = this.onDocumentClick.bind(this);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load options list from JSON file (e.g., assets/options.json)
    this.http.get<any[]>('assets/options.json').subscribe((data) => {
      this.optionsList = data;
    });

    // Add document click listener to close opened dropdowns
    document.addEventListener('click', this.documentClickHandler);
  }

  ngOnDestroy(): void {
    // Remove the document click listener on destroy
    document.removeEventListener('click', this.documentClickHandler);
  }

  onDocumentClick(event: Event): void {
    // Close any open options dropdowns when clicking outside
    const openDropdowns = document.querySelectorAll('.options.show');
    openDropdowns.forEach((dropdown) => dropdown.classList.remove('show'));
  }

  toggleRowOptions(event: Event): void {
    event.stopPropagation(); // prevent event propagation
    const targetElement = event.target as HTMLElement;
    const row = targetElement.closest('tr');
    if (row) {
      const optionsContainer = row.querySelector('.options');
      if (optionsContainer) {
        optionsContainer.classList.toggle('show');
      }
    }
  }

  getSelectedElement(event: Event): void {
    const detailsBtn = event.target as HTMLElement;
    const selectedRow = detailsBtn.closest('tr');
    const details = selectedRow?.querySelector('.more-details');
    const iconDiv = selectedRow?.querySelector('.view-details mat-icon');

    details?.classList.toggle('show');

    // Update the icon text depending on details visibility
    if (details?.classList.contains('show')) {
      iconDiv && ((iconDiv as HTMLElement).innerText = 'expand_less');
    } else {
      iconDiv && ((iconDiv as HTMLElement).innerText = 'expand_more');
    }
  }

  // New event handler for processing option actions (e.g., Delete/Edit)
  handleOptionClick(event: Event, option: any, client: any): void {
    // Prevent event propagation so the dropdown does not immediately close before processing
    event.stopPropagation(); 
    
    if (option.id === 1) { // Delete action
      if (confirm(`Are you sure you want to delete client "${client.name}"?`)) {
        this.clientes = this.clientes.filter(c => c.id !== client.id);
        console.log(`Client "${client.name}" deleted.`);
      }
    } else if (option.id === 2) { // Edit action
      console.log(`Editing client "${client.name}".`);
      // TODO: Implement edit functionality (e.g. open an edit modal or navigate to an edit page)
    }
    
    // Optionally, close the options dropdown after handling the action.
    const row = (event.target as HTMLElement).closest('tr');
    if (row) {
      const optionsContainer = row.querySelector('.options');
      optionsContainer?.classList.remove('show');
    }
  }
}
