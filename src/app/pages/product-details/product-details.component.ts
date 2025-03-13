import { Component, ChangeDetectorRef } from '@angular/core';
import { PagerComponent } from '../../components/pager/pager.component';
import { MatIconModule } from '@angular/material/icon';
import { BraidingStylesService } from '../../services/braiding-style.service';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { EventDialogComponent } from '../../components/event-dialog/event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddButtonComponent } from '../../components/svg/add-button/add-button.component';

// Define an interface for attribute values (optional but recommended)
interface AttributeValue {
  id: string;
  name: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    PagerComponent,
    MatIconModule,
    EventDialogComponent,
    AddButtonComponent,
  ],
  providers: [BraidingStylesService, AuthService],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  braidStyle: any = null;
  allAttributes: any = null;
  attributeValues: any = null;
  editable: boolean = this.hasRole('admin') ? true : false;
  selectedAttributePricing: any;

  constructor(
    private braidingStylesService: BraidingStylesService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router, // Inject Router
    private toastService: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchBraidingStyle();
    this.fetchAllAttributes();
  }

  fetchBraidingStyle(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const braid_id = urlParams.get('id');

    if (braid_id) {
      this.braidingStylesService.getBraidingStyleDetail(braid_id).subscribe({
        next: (response: any) => {
          console.log('Braiding style fetched:', response);
          this.braidStyle = response;
          this.cdr.detectChanges(); // Ensure UI updates
        },
        error: (error: any) =>
          console.error('Failed to fetch braiding style:', error),
      });
    } else {
      console.error('No braiding style ID found in URL');
    }
  }
  
  fetchAllAttributes(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const braid_id = urlParams.get('id');

    if (braid_id) {
      this.braidingStylesService.getAllAttributes().subscribe({
        next: (response: any) => {
          console.log('Attribute fetched:', response);
          this.allAttributes = response;
          this.cdr.detectChanges(); // Ensure UI updates
        },
        error: (error: any) =>
          console.error('Failed to fetch Attribute:', error),
      });
    } else {
      console.error('No Attribute ID found in URL');
    }
  }

  hasRole(role: string): boolean {
    return sessionStorage.getItem('user-role') === role;
  }

  hasEditPermission(): boolean {
    return this.hasRole('admin') && this.editable;
  }

  setEditableToggle(): void {
    this.editable = !this.editable;
  }

  updateSelectedAttributePricingId(event: Event): void {
    const targetElement = event.target as HTMLElement;  
    const closestSpanElement = targetElement.closest('span');
    if (closestSpanElement) {
      const closestSelectElement = closestSpanElement.nextElementSibling as HTMLSelectElement;
      if (closestSelectElement && closestSelectElement.tagName === 'SELECT') {
      console.log('Closest select element value:', closestSelectElement.value);
      this.selectedAttributePricing = this.getFilteredAttributeValues(parseInt(closestSelectElement.value));
      } else {
      console.log('No closest select element found.');
      }
    } else {
      console.log('No closest span element found.');
    }
  }

  getFilteredAttributeValues(id: number): any {
    const result = [];  

    for (const item of this.braidStyle.stylesAttributes) {
      if (item.values && Array.isArray(item.values)) {
        const filteredValues = item.values.filter((value: any) => value.id === id);
        if (filteredValues.length > 0) {
          result.push({
            ...item,
            values: filteredValues
          });
        }
      }
  }
  
  console.log(result);

  return result;
}

  editHairstyleDetails(): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      // width: '80vw',  // Adjust width (e.g., 80% of viewport width)
      // height: '80vh', // Adjust height (e.g., 80% of viewport height)
      data: {
        title: 'Hairstyle Update',
        dynamicFields: [
          {
            type: 'text',
            label: 'Name',
            name: 'style_name',
            placeholder: 'Enter the name',
            value: this.braidStyle?.name,
          },
          {
            type: 'textarea',
            label: 'Description',
            name: 'description',
            placeholder: 'Describe the hairstyle',
            value: this.braidStyle?.description,
          },
          {
            type: 'text',
            label: 'Duration',
            name: 'duration',
            placeholder: 'Set the avg time it takes',
            value: this.braidStyle?.duration,
          },
          {
            type: 'text',
            label: 'Price',
            name: 'price',
            placeholder: 'How much it will cost',
            value: this.braidStyle?.price,
          },
        ],
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

      const { style_name, description, duration, price } = result;
      this.braidingStylesService
        .updateBraindingsStyle(style_name, description, duration, price)
        .subscribe({
          next: (response: any) => {
            this.toastService.success('Hairstyle updated successfully');
            this.braidStyle = {
              ...this.braidStyle,
              name: style_name,
              description,
              duration,
              price,
            };
            this.cdr.detectChanges(); // Manually trigger change detection
          },
          error: (error: any) =>
            this.toastService.error('Update failed:', error),
        });
    });
  }

  createNewAttribute(): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      // width: '80vw',  // Adjust width (e.g., 80% of viewport width)
      // height: '80vh', // Adjust height (e.g., 80% of viewport height)
      data: {
        title: 'Add Attributes',
        dynamicFields: [
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
        ],
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
          },
          {
            text: 'Manage all attributes',
            value: false,
            action: () => {             
                dialogRef.close(); // Close the current dialog without submitting
                this.dialog.closeAll(); // Close the current dialog
                this.router.navigate(['/attributes']); // Navigate to the attributes route
              
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

      const { name, category } = result;
      this.braidingStylesService
        .createBraindingsAttribute(name, category)
        .subscribe({
          next: (response: any) => {
            this.toastService.success('Hairstyle attribute created successfully');
            this.braidStyle = {
              ...this.braidStyle,
              name,
              category,
            };
            this.cdr.detectChanges(); // Manually trigger change detection
          },
          error: (error: any) =>
            this.toastService.error('Creation failed:', error),
        });
    });
  }

  
  createNewAttributeValue(): void {   
    const hairstyleId = new URLSearchParams(window.location.search).get(
      'brast'
    );
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: {
        title: 'Add value to Attributes',
        dynamicFields: [
          {
            type: 'select',
            label: 'Attribute name',
            name: 'hairstyle_attribute_id',
            options: this.allAttributes.map(
              (el: { id: number; name: string; category: string }) => ({
                value: el.id,
                label: el.name,
              })
            ),
          },
          {
            type: 'text',
            label: 'Attribute Value',
            name: 'value',
            value: '',
          },          
        ],
        buttons: [          
          {
            text: 'Create',
            value: false,
            action: () => {
              const formGroup = dialogRef.componentInstance.formGroup;
              if (formGroup.valid) {
                dialogRef.close({ ...formGroup.value });
              }
            },
          },
          {
            text: 'Manage all attributes',
            value: false,
            action: () => {
              dialogRef.close(); // Close the current dialog without submitting
                this.dialog.closeAll(); // Close the current dialog
                this.router.navigate(['/attributes']); // Navigate to the attributes route
            },
          },
          
        ],
      },
    });

    dialogRef.afterOpened().subscribe(() => {
      const formGroup = dialogRef.componentInstance.formGroup;

      // Handle attribute_id changes
      const attributeIdControl = formGroup.get('attribute_id');
      
      if (attributeIdControl) {
        attributeIdControl.valueChanges.subscribe((selectedId: number) => {
          console.log('Selected attribute_id:', selectedId);
          this.loadAttributeValues(
            selectedId,
            dialogRef.componentInstance.data.dynamicFields
          );
        });
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        console.log('Dialog was closed without submission.');
        return;
      }

      console.log('Dialog result:', result);

      const {
        hairstyle_attribute_id,
        value,
      } = result;

      console.log('Dialog After extration:', result); //log the object that will be sent to the backend.

      if (hairstyle_attribute_id) {
       
        this.braidingStylesService
          .createBraindingsAttributeValue(
            hairstyle_attribute_id,
            value
          )
          .subscribe({
            next: (response: any) => {
              this.toastService.success(
                'Hairstyle attribute added successfully'
              );
              this.fetchBraidingStyle();              
            },
            error: (error: any) =>{
              this.toastService.error('Addition failed:', error),
              console.log('Error:', error)
            }
          });
      } else {
        this.toastService.error('Hairstyle ID is missing from the URL.');
      }
    });
  }


  attachAttributesToHairstyle(): void {   
    const hairstyleId = new URLSearchParams(window.location.search).get(
      'brast'
    );
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: {
      title: 'Add Attributes',
      dynamicFields: [
        {
        type: 'select',
        label: 'Attribute name',
        name: 'attribute_id',
        options: this.allAttributes.map(
          (el: { id: number; name: string; category: string }) => ({
          value: el.id,
          label: el.name,
          })
        ),
        },
        {
        type: 'select',
        label: 'Attribute Value',
        name: 'hairstyle_attribute_value_id',
        options: [], // Initially empty
        },
        {
        type: 'select',
        label: 'Charge in (percentage or fix cost)',
        name: 'cost_type',
        options: [
          { value: 'percentage', label: 'Percentage' },
          { value: 'fixed', label: 'Fix Cost' },
        ],
        },
        {
        type: 'text',
        label: 'Aditional Cost',
        name: 'additional_cost',
        placeholder: 'How much it will add to base cost',
        value: '',
        },
      ],
      buttons: [
        {
        text: 'Add',
        value: false,
        action: () => {
          const formGroup = dialogRef.componentInstance.formGroup;
          formGroup.removeControl('attribute_id');
          if (formGroup.valid) {
          dialogRef.close({ ...formGroup.value });
          }
        },
        },
        {
        text: 'Create new attrib. value',
        value: false,
        action: () => {
          dialogRef.close(); // Close the current dialog without submitting
          this.createNewAttributeValue(); // Open the new modal
        },
        },
      ],
      },
    });

    dialogRef.afterOpened().subscribe(() => {
      const formGroup = dialogRef.componentInstance.formGroup;

      // Add the hidden field for hairstyle_id
      formGroup.addControl('hairstyle_id', new FormControl(hairstyleId));
      // Remove the attribute_id field if it exists

      // Handle attribute_id changes
      const attributeIdControl = formGroup.get('attribute_id');
      
      if (attributeIdControl) {
        attributeIdControl.valueChanges.subscribe((selectedId: number) => {
          console.log('Selected attribute_id:', selectedId);
          this.loadAttributeValues(
            selectedId,
            dialogRef.componentInstance.data.dynamicFields
          );
        });
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        console.log('Dialog was closed without submission.');
        return;
      }

      console.log('Dialog result:', result);

      const {
        hairstyle_id,
        hairstyle_attribute_value_id,
        cost_type,
        additional_cost,
      } = result;

      console.log('Dialog After extration:', result); //log the object that will be sent to the backend.

      if (hairstyle_id) {
        const hairstyle_id_numb = parseInt(hairstyle_id);
        const hairstyle_attribute_value_id_numb = parseInt(
          hairstyle_attribute_value_id
        );
        const additional_cost_numb = parseFloat(additional_cost);

        this.braidingStylesService
          .attachHairAttribute(
            hairstyle_id_numb,
            hairstyle_attribute_value_id_numb,
            additional_cost_numb,
            cost_type
          )
          .subscribe({
            next: (response: any) => {
              this.toastService.success(
                'Hairstyle attribute added successfully'
              );
              this.fetchBraidingStyle();              
            },
            error: (error: any) =>
              this.toastService.error('Addition failed:', error),
          });
      } else {
        this.toastService.error('Hairstyle ID is missing from the URL.');
      }
    });
  }

  loadAttributeValues(hairstyle_id: number, dynamicFields: any[]) {
    this.braidingStylesService
      .getAttributeValuesByHairstyleId(hairstyle_id)
      .subscribe(
        (response: any) => {
          const filteredValues = response.map(
            (el: { id: number; value: string }) => ({
              value: el.id,
              label: el.value,
            })
          );

          const attributeValueField = dynamicFields.find(
            (field) => field.name === 'hairstyle_attribute_value_id'
          );
          if (attributeValueField) {
            if(filteredValues.length === 0){
              filteredValues.push({ value: '', label: 'No values found' });
            }
            // console.log("empty values: ",filteredValues);
            attributeValueField.options = filteredValues;
          }

          console.log('Loaded attribute values:', filteredValues);
        },
        (error) => {
          this.toastService.error('Failed to load attribute values');
        }
      );
  }

  editAttachedAttributeDetails(event: Event): void {

    this.updateSelectedAttributePricingId(event);

    const [ { attr_id, name, values: [ { id: valueId, name: valueName, additional_cost, cost_type } ] } ] = this.selectedAttributePricing;
  
  
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: {
      title: `Edit ${name}` ,
      dynamicFields: [          
        {
        type: 'select',
        label: 'Charge in (percentage or fix cost)',
        name: 'cost_type',
        value: cost_type,
        options: [
          { value: 'percentage', label: 'Percentage' },
          { value: 'fixed', label: 'Fix Cost' },
        ],
        },
        {
        type: 'text',
        label: 'Additional Cost',
        name: 'additional_cost',
        placeholder: 'How much it will add to base cost',
        value: additional_cost,
        },
      ],
      buttons: [
        {
        text: `Update ${valueName}`,
        value: false,
        action: () => {
          const formGroup = dialogRef.componentInstance.formGroup;
          if (formGroup.valid) {
          dialogRef.close({ ...formGroup.value, update: true });
          }
        },
        },
        {
        text: `Delete`,
        value: false,
        action: () => {
          if (confirm(`Are you sure you would like to delete ${name} : ${valueName}`)) {
          dialogRef.close({ delete: true });
          }
        },
        },
      ],
      },
    });    

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
      console.log('Dialog was closed without submission.');
      return;
      }

      if (result.update) {
      const { cost_type, additional_cost } = result;
      const att_price_id = parseInt(valueId);
      const additionalCostNum = parseFloat(additional_cost);

      this.braidingStylesService
        .updateAttachedHairAttribute(
        att_price_id,
        additionalCostNum,
        cost_type
        )
        .subscribe({
        next: (response: any) => {
          this.toastService.success(
          'Hairstyle attribute updated successfully'
          );                
          this.fetchBraidingStyle();
        },
        error: (error: any) =>
          this.toastService.error('Update failed:', error),
        });
      } else if (result.delete) {
      const att_price_id = parseInt(valueId);

      this.braidingStylesService
        .deleteAttachedHairAttribute(att_price_id)
        .subscribe({
        next: (response: any) => {
          this.toastService.success(
          'Hairstyle attribute deleted successfully'
          );                
          this.fetchBraidingStyle();
        },
        error: (error: any) =>
          this.toastService.error('Deletion failed:', error),
        });
      }
    });
  }
  
}
