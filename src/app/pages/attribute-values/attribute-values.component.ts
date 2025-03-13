import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DefaultTableComponent } from '../../components/default-table/default-table.component';
import { PagerComponent } from "../../components/pager/pager.component";
import { SearchboxComponent } from "../../components/searchbox/searchbox.component";
import { BraidingStylesService } from '../../services/braiding-style.service';
import { AuthService } from '../../services/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CrudserviceService } from '../../services/crudservice.service';

@Component({
  selector: 'app-attribute-values',
  standalone: true,
  imports: [DefaultTableComponent, PagerComponent, SearchboxComponent],
  providers: [BraidingStylesService, AuthService, CrudserviceService],
  templateUrl: './attribute-values.component.html',
  styleUrls: ['./attribute-values.component.scss']
})
export class AttributeValuesComponent implements OnInit {    
  title: string = 'Attribute Values';
  searchable: boolean = true;
  profileIcon: string = "person";  
  allAttributeValue: any = null;
  optionsList: any[] = [
    { "id": 1, "label": "Delete", "icon": "delete" },
    { "id": 2, "label": "Edit", "icon": "edit" },

  ];   
  data: any[] = [];
  attribute_id: string = this.route.snapshot.paramMap.get('id') || '';
  selectedItem: any = null;
  creationalFields: any[] = [
    { type: 'hidden', name: 'hairstyle_attribute_id', value: this.attribute_id},
    { type: 'text', label: 'Name', name: 'value', value: '' }
  ];
  updatableFields: any[] = [
    { type: 'hidden', name: 'hairstyle_attribute_id', value: this.selectedItem?.id || '' },
    { type: 'text', label: 'Name', name: 'value', value: this.selectedItem?.value || '' }
  ];

  constructor(
    private braidingStylesService: BraidingStylesService,
    private crudserviceService: CrudserviceService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router, // Inject Router
    private route: ActivatedRoute, // Inject ActivatedRoute
    private toastService: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchAllAttributes();
  }
  
  fetchAllAttributes(): void {        
    const attributeId = this.route.snapshot.paramMap.get('id');
    const att_id_numb = parseInt(attributeId || '0', 10);
    this.crudserviceService.getAll('hairstyles-attributes/' + att_id_numb + '/values').subscribe({
      next: (response: any) => {
        console.log('Attribute values fetched:', response);
        this.allAttributeValue = response;
        this.cdr.detectChanges(); // Ensure UI updates
        this.data = this.transformData(); // Call transformData after allAttributes is assigned
        console.log(this.data); // Call transformData after allAttributes is assigned
      },
      error: (error: any) =>
        console.error('Failed to fetch attribute values:', error),
    });
  }

  // Default table data transformation
  transformData(): any[] {
    if (!this.allAttributeValue || this.allAttributeValue.length === 0) {
      return [];
    }
    
    return this.allAttributeValue.map((item: any) => ({
      id: item?.id,
      name: item?.value,
      description: '', // Extract values array and join with comma and space
      details: ``, // Extract values array and join with comma and space
    }));
  } 

  onSelectedItemChange(item: any): void {
    this.selectedItem = item;
    this.updatableFields = [
      { type: 'hidden', name: 'hairstyle_attribute_id', value: this.selectedItem?.id || '' },
      { type: 'text', label: 'Name', name: 'value', value: this.selectedItem?.value || '' }
    ];
  }

  onRefreshAttributeValues(): void {
    console.log('onRefreshTableData called...');
    this.fetchAllAttributes(); // Fetch updated data after creating a new attribute value
  }
}
