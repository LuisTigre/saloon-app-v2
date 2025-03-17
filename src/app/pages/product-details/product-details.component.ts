import { Component, ChangeDetectorRef, SimpleChanges, HostListener,  ElementRef, ViewChild } from '@angular/core';
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
import { EditButtonComponent } from "../../components/svg/edit-button/edit-button.component";
import { CrudserviceService } from '../../services/crudservice.service';

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
    EditButtonComponent
  ],
  providers: [BraidingStylesService, AuthService, CrudserviceService],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent {
  @ViewChild('imgWrapper', { static: false }) imgWrapper?: ElementRef;

  braidStyle: any = null;
  allAttributes: any = null;
  attributeValues: any = null;
  editable: boolean = this.hasRole('admin') ? true : false;
  selectedAttributePricing: any;
  additionalCost: number = 0;
  totalPrice: number = 0;
  serverIp: string = window.location.hostname || 'localhost';
  hairstyleId = new URLSearchParams(window.location.search).get('id');
  def_img: string = "https://images.unsplash.com/photo-1600456899121-68eda5705257?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JheXxlbnwwfHwwfHx8MA%3D%3D";
  
  currentImageIndex: number = 0;
  isDragging: boolean = false; // Add isDragging property
  startX: number = 0; // Add startX property
  
  constructor(
    private braidingStylesService: BraidingStylesService,
    private crudService: CrudserviceService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router, // Inject Router
    private toastService: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchBraidingStyle();
    this.fetchAllAttributes();
    this.updateSelectedAttributePricingValue(); // Calculate total price on page load
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateTotalPrice();
  }

  updateTotalPrice(): void {
    this.totalPrice = this.braidStyle.price;  
    this.braidStyle.stylesAttributes.forEach((item: any) => {
      if (item.values && Array.isArray(item.values) && item.values.length > 0) {
        const [selectedValue] = item.values;
        this.totalPrice += selectedValue.additional_cost;
      }
    });
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
          this.updateSelectedAttributePricingValue(); // Calculate total price after fetching braid style
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

  updateSelectedAttributePricingValue(event?: Event): void {
    const braidOpsElement = document.querySelector('.braid-ops');
    const selectElements = braidOpsElement?.querySelectorAll('select');

    let totalAdditionalCost = 0;

    selectElements?.forEach((selectElement) => {
      const selectedOption = selectElement.selectedOptions[0];
      const additionalCost = parseFloat(selectedOption.getAttribute('data-price') || '0');
      const costType = selectedOption.getAttribute('data-cost-type');

      if (costType === 'fixed') {
        totalAdditionalCost += additionalCost;
      } else if (costType === 'percentage') {
        totalAdditionalCost += (parseFloat(this.braidStyle?.price || '0') * additionalCost) / 100;
      }
    });

    this.additionalCost = totalAdditionalCost;
    this.calculateFinalPrice();
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

  attachAttributesToHairstyle(): void {   
    const hairstyleId = new URLSearchParams(window.location.search).get('id');
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
            text: `Update`,
            value: false,
            action: () => {
              const formGroup = dialogRef.componentInstance.formGroup;
              if (formGroup.valid) {
                dialogRef.close({ ...formGroup.value, update: true });
              }
            },
          },
          {
            text: `Detach Attr`,
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
  
  calculateFinalPrice(): void {
    let finalPrice = parseFloat(this.braidStyle?.price || '0');

    finalPrice += this.additionalCost;

    this.totalPrice = parseFloat(finalPrice.toFixed(2));
  }

  getImageUrl(): string {
    let imgUrl = this.braidStyle.imageUrl == null ? this.def_img : this.braidStyle.imageUrl[0]?.url;
    return `http://${this.serverIp}:8000${imgUrl}`;
  }
  
  moveNextImage(): void {
    if (!this.braidStyle?.imageUrl || this.braidStyle.imageUrl.length <= 1) {
      return; // No images or only one image, nothing to change
    }

    this.currentImageIndex++;

    if (this.currentImageIndex >= this.braidStyle.imageUrl.length) {
      this.currentImageIndex = 0;
    }

    // Update the image source
    this.updateImageSource();
  }

  movePreviousImage(): void {
    if (!this.braidStyle?.imageUrl || this.braidStyle.imageUrl.length <= 1) {
      return; // No images or only one image, nothing to change
    }

    this.currentImageIndex--;

    if (this.currentImageIndex < 0) {
      this.currentImageIndex = this.braidStyle.imageUrl.length - 1;
    }

    // Update the image source
    this.updateImageSource();
  }

  updateImageSource(): void {
    if (this.braidStyle?.imageUrl && this.braidStyle.imageUrl.length > 0) {
      const imgUrl = this.braidStyle.imageUrl[this.currentImageIndex]?.url;
      const img_element = document.querySelector('#braid_image') as HTMLImageElement;
      if (img_element) {
        img_element.src = `http://${this.serverIp}:8000${imgUrl}`;
      }
    }
  }

  is_main_image(): boolean{
    return this.braidStyle?.imageUrl?.is_main_image == 1;
  }


  createHairstyleImage(event: Event): void {
    const element = event.target as HTMLInputElement;
    const form = element.closest('form');
  
    if (!form) {
      console.error('Form not found!');
      return;
    }
  
    const formData = new FormData(form); // Collect all form fields
  
    // Handle checkbox manually
    const checkbox = form.querySelector<HTMLInputElement>('input[name="is_main_image"]');
    if (checkbox) {
      formData.set('is_main_image', checkbox.checked ? '1' : '0');
    }
  
    // Debugging: Log form data correctly
    // for (const pair of formData.entries()) {
    //   console.log(`${pair[0]}:`, pair[1]);
    // }
  
    // Send form data using CrudserviceService
    this.crudService.create<any>('hairstyle-images', formData).subscribe({
      next: (response: any) => {
        console.log('Image uploaded:', response);
        this.toastService.success('Image uploaded successfully');
        this.fetchBraidingStyle();
      },
      error: (error: any) => {
        console.error('Image upload error:', error);
        this.toastService.error('Image upload failed');
      }
    });
  }
  deleteImage(): void {
    let imageId = this.braidStyle.imageUrl[this.currentImageIndex]?.img_id;

    if(imageId){
      if (confirm('Are you sure you want to delete this image?')) {
        this.crudService.delete(`hairstyle-images`, imageId).subscribe({
          next: (response: any) => {
            console.log('Image deleted:', response);
            this.toastService.success('Image deleted successfully');
            this.fetchBraidingStyle(); // Refresh the image list
            this.currentImageIndex = 0;
            this.updateImageSource;
          },
          error: (error: any) => {
            console.error('Image deletion error:', error);
            this.toastService.error('Image deletion failed');
          }
        });
      }
    }

    }

  
  // Mouse events for dragging images
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    if (event.target === this.imgWrapper?.nativeElement) {
      this.isDragging = true;
      this.startX = event.clientX;
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const diff = event.clientX - this.startX;
      if (Math.abs(diff) > 50) { // Adjust threshold as needed
        if (diff > 0) {
          this.movePreviousImage();
        } else {
          this.moveNextImage();
        }
        this.isDragging = false;
      }
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    this.isDragging = false;
  }

  // Touch events for dragging images
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.isDragging = true;
    this.startX = event.touches[0].clientX;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this.isDragging) {
      const diff = event.touches[0].clientX - this.startX;
      if (Math.abs(diff) > 50) { // Adjust threshold as needed
        if (diff > 0) {
          this.movePreviousImage();
        } else {
          this.moveNextImage();
        }
        this.isDragging = false;
      }
    }
  }
  
  
  
  
}
  



