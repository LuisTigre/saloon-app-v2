import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ContentChild, TemplateRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { PagerComponent } from '../../components/pager/pager.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SearchboxComponent } from '../../components/searchbox/searchbox.component';
import { identifierName } from '@angular/compiler';
import { BraidingStylesService } from '../../services/braiding-style.service';
import { AuthService } from '../../services/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { AddButtonComponent } from "../svg/add-button/add-button.component";
import { CrudserviceService } from '../../services/crudservice.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-default-table',
  standalone: true,
  imports: [
    PagerComponent,
    CommonModule,
    MatIcon,
    SearchboxComponent,
    AddButtonComponent,
    HttpClientModule  // Add HttpClientModule here
  ],
  templateUrl: './default-table.component.html',
  styleUrls: ['./default-table.component.scss']
})
export class DefaultTableComponent implements OnInit, OnDestroy, OnChanges {
  selectedItem: any = null;
  @Input() title: string = 'Title';
  @Input() searchable?: boolean;
  @Input() profileIcon?: string; 
  @Input() endpoint: string = 'hairstyle-attributes';
  @Input() entityName: string = 'Attribute'; // Add entityName input
  @Input() optionsList: any[] = [
    { "id": 1, "label": "Delete", "icon": "delete" },
    { "id": 2, "label": "Edit", "icon": "edit" },
  ];
  @Input() creationalFields: any[] = [
    {
      type: 'text',
      label: 'Name',
      name: 'name',
      value: '',
    },
    {
      type: 'text',
      label: 'Category',
      name: 'category',
      value: '',
    },
  ];
  @Input() updatableFields: any[] = [
    {
      type: 'text',
      label: 'Name',
      name: 'name',
      value: this.selectedItem?.name || '',
    },
    {
      type: 'text',
      label: 'Category',
      name: 'category',
      value: this.selectedItem?.category || '',
    },
  ];
  @Output() updateTable = new EventEmitter<any>();
  @Output() selectedItemChange = new EventEmitter<any>(); // Add output for selectedItem
  @Output() createdItemSuccess = new EventEmitter<void>(); // Add output for createdItemSuccess

  braidStyle: any = null;

  @Input() data: any[] = [];
  filteredData: any[] = []; // Add filteredData to hold the filtered results
  
  showdetails: boolean = false;
  inconElement: string = 'expand_more';

  @ContentChild(TemplateRef) detailsTemplate!: TemplateRef<any>;

  private documentClickHandler = this.onDocumentClick.bind(this);

 constructor(
     private braidingStylesService: BraidingStylesService,
     private crudservice: CrudserviceService,
     private authService: AuthService,
     private dialog: MatDialog,
     private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
     private router: Router, // Inject Router
     private toastService: ToastrService // Inject ToastrService
   ) {}

  ngOnInit(): void {
    // Add document click listener to close opened dropdowns
    document.addEventListener('click', this.documentClickHandler);
    this.filteredData = this.data; // Initialize filteredData with the full data set
  }

  ngOnDestroy(): void {
    // Remove the document click listener on destroy
    document.removeEventListener('click', this.documentClickHandler);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.fillTable(this.data); // Fill and sort data whenever it is updated
    }
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
  handleOptionClick(event: Event, option: any, item: any): void {
    // Prevent event propagation so the dropdown does not immediately close before processing
    event.stopPropagation(); 
    
    if (option.route) {
      const route = option.route.includes('?') ? `${option.route}id=${item.id}` : `${option.route}/${item.id}`;
      this.router.navigateByUrl(decodeURIComponent(route));
    } else if (option.id === 1) { // Delete action
      if (confirm(`Are you sure you want to delete ${this.entityName.toLowerCase()} "${item.name}"?`)) {
        this.deleteAttribute(item);
      }
    } else if (option.id === 2) { // Edit action
      console.log(`Editing item "${item.name}".`);
      console.log(item);
      this.updateAttribute(item);
      // TODO: Implement edit functionality (e.g. open an edit modal or navigate to an edit page)
    }
    
    // Optionally, close the options dropdown after handling the action.
    const row = (event.target as HTMLElement).closest('tr');
    if (row) {
      const optionsContainer = row.querySelector('.options');
      optionsContainer?.classList.remove('show');
    }
  }

  // Create a new attribute using the CrudserviceService with the endpoint "hairstyle-attributes"
  createNewAttribute(): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: {
        title: `Add ${this.entityName}`,
        dynamicFields: this.creationalFields,
        buttons: [
          {
            text: 'Create',
            value: false,
            action: () => {
              const formGroup = dialogRef.componentInstance.formGroup;
              if (formGroup.valid) {
                dialogRef.close({ ...formGroup.value, register: true });
              }
            },
          }
        ],
      },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('Dialog result:', result);
      if (!result) {
        console.log('Dialog was closed without submission.');
        return;
      }

      const formData = this.creationalFields.reduce((acc, field) => {
        acc[field.name] = result[field.name];
        return acc;
      }, {});

      console.log('Form data:', formData);

      // Use CrudserviceService to create a new attribute with endpoint "hairstyle-attributes"
      this.crudservice.create(this.endpoint, formData).subscribe({
        next: (response: any) => {
          this.toastService.success(`${this.entityName} created successfully`);
          this.fillTable(this.data); // Fill and sort data after creation
          this.updateTable.emit(this.data); // Notify parent to refresh its data
          this.createdItemSuccess.emit(); // Emit createdItemSuccess event
          this.cdr.detectChanges();
        },
        error: (error: any) =>
          this.toastService.error(`Creation of ${this.entityName.toLowerCase()} failed:`, error),
      });
    });
  }

  // Update an attribute using CrudserviceService with the endpoint "hairstyle-attributes"
  updateAttribute(item: any): void {
    this.crudservice.get(this.endpoint, item.id).subscribe({
      next: (response: any) => {
        this.selectedItem = response;
        this.selectedItemChange.emit(this.selectedItem); // Emit selectedItem to parent

        // Update updatableFields with values from selectedItem
        this.updatableFields = this.updatableFields.map(field => ({
          ...field,
          value: this.selectedItem[field.name] || ''
        }));

        const dialogRef = this.dialog.open(EventDialogComponent, {
          data: {
            title: `Update ${this.entityName}`,
            dynamicFields: this.updatableFields,
            buttons: [
              {
                text: 'Update',
                value: false,
                action: () => {
                  const formGroup = dialogRef.componentInstance.formGroup;
                  if (formGroup.valid) {
                    dialogRef.close({ ...formGroup.value, register: true });
                  }
                },
              },
            ],
          },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          console.log('Dialog result:', result);
          if (!result) {
            console.log('Dialog was closed without submission.');
            return;
          }

          const formData = this.updatableFields.reduce((acc, field) => {
            acc[field.name] = result[field.name];
            return acc;
          }, {});

          // Use CrudserviceService to update the attribute.
          this.crudservice.update(this.endpoint, this.selectedItem.id, formData).subscribe({
            next: (response: any) => {
              this.toastService.success(`${this.entityName} updated successfully`);
              const index = this.data.findIndex(d => d.id === this.selectedItem.id);
              if (index !== -1) {                
                this.data[index] = response;
              }
              this.fillTable(this.data); // Fill and sort data after update
              this.updateTable.emit(this.data); // Notify parent to refresh its data
              this.cdr.detectChanges();
            },
            error: (error: any) =>
              this.toastService.error(`Update of ${this.entityName.toLowerCase()} failed:`, error),
          });
        });
      },
      error: (error: any) => {
        this.toastService.error(`${this.entityName} not found:`, error);
        console.log(error);
      }
    });
  }

  // Delete an attribute using CrudserviceService with the endpoint "hairstyle-attributes"
  deleteAttribute(item: any): void {
    this.crudservice.delete(this.endpoint, item.id).subscribe({
      next: (response: any) => {
        this.toastService.success(`${this.entityName} deleted successfully`);
        this.data = this.data.filter(c => c.id !== item.id); // Remove the deleted item from the local data
        this.fillTable(this.data); // Fill and sort data after deletion
        this.updateTable.emit(this.data); // Notify parent to refresh its data
        this.cdr.detectChanges();
      },
      error: (error: any) =>
        this.toastService.error(`Deletion of ${this.entityName.toLowerCase()} failed:`, error),
    });
  }

  // Fill and sort data alphabetically by name
  fillTable(data: any[]): void {
    this.data = data;
    this.data = data.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });    
    this.filteredData = this.data; // Update filteredData with the sorted data
    this.cdr.detectChanges(); // Ensure change detection is triggered
  }

  // Filter data based on search input
  filterData(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredData = this.data; // If no search term, show all data
    } else {
      this.filteredData = this.data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.cdr.detectChanges(); // Ensure change detection is triggered
  }
}
