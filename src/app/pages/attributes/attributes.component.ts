import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DefaultTableComponent } from '../../components/default-table/default-table.component';
import { PagerComponent } from "../../components/pager/pager.component";
import { SearchboxComponent } from "../../components/searchbox/searchbox.component";
import { BraidingStylesService } from '../../services/braiding-style.service';
import { AuthService } from '../../services/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrudserviceService } from '../../services/crudservice.service';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [DefaultTableComponent, PagerComponent, SearchboxComponent],
  providers: [BraidingStylesService, AuthService, CrudserviceService],
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit {    
  title: string = 'Attributes';
  searchable: boolean = true;
  profileIcon: string = "person";  
  allAttributes: any = null;
  optionsList: any[] = [
    { "id": 1, "label": "Delete", "icon": "delete" },
    { "id": 2, "label": "Edit", "icon": "edit" },
    { "id": 3, "label": "Details", "icon": "subdirectory_arrow_right", "route": "/attributes" },
  ];   
  data: any[] = [];
  selectedItem: any = null;
  creationalFields: any[] = [
    { type: 'text', label: 'Name', name: 'name', value: '' },
    { type: 'text', label: 'Category', name: 'category', value: '' }
  ];
  updatableFields: any[] = [
    { type: 'text', label: 'Name', name: 'name', value: this.selectedItem?.name || '' },
    { type: 'text', label: 'Category', name: 'category', value: this.selectedItem?.category || '' }
  ];

  constructor(
    private braidingStylesService: BraidingStylesService,
    private crudserviceService: CrudserviceService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router, // Inject Router
    private toastService: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchAllAttributes();
  }
  
  fetchAllAttributes(): void {        
    this.braidingStylesService.getAllAttributes().subscribe({
      next: (response: any) => {
        console.log('Attribute fetched:', response);
        this.allAttributes = response;
        this.cdr.detectChanges(); // Ensure UI updates
        this.data = this.transformData(); // Call transformData after allAttributes is assigned
        console.log('Attribute tranformed:',this.data); // Call transformData after allAttributes is assigned
      },
      error: (error: any) =>
        console.error('Failed to fetch Attribute:', error),
    });
  }

  transformData(): any[] {
    if (!this.allAttributes || this.allAttributes.length === 0) {
      return [];
    }
    
    return this.allAttributes.map((item: any) => ({
      id: item?.id,
      name: item?.name,
      description: item?.values.map((value: any) => value?.value).join(',  '), // Extract values array and join with comma and space
      details: item?.values.map((value: any) => value?.value).join(',  '), // Extract values array and join with comma and space
    }));
  }

  onSelectedItemChange(item: any): void {
    this.selectedItem = item;
    this.updatableFields = [
      { type: 'text', label: 'Name', name: 'name', value: this.selectedItem?.name || '' },
      { type: 'text', label: 'Category', name: 'category', value: this.selectedItem?.category || '' }
    ];
  }

  onRefreshAtributes(): void {
    console.log('onCreateAttributeSuccess');
    this.fetchAllAttributes(); // Fetch updated data after creating a new attribute
  }
}
