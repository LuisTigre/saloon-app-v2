import { Component, EventEmitter, Inject, Output, Input, forwardRef  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input'; // Import MatInputModule
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms'; // Import FormsModule for ngModel
import { PrimaryInputComponent } from '../primary-input/primary-input.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Import CommonModule
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    PrimaryInputComponent,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ],
    // Include the necessary modules
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'] // Corrected the property name from styleUrl to styleUrls
})
export class EventDialogComponent {
  formGroup!: FormGroup; // Declare formGroup here
  dynamicFields: any[] = [];
  @Input() header = ""
  @Output() saveAction = new EventEmitter();  
  @Input() primary_action: string = ""
  @Input() secondary_action: string = ""  

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EventDialogComponent>
  ) {
    this.dynamicFields = data.dynamicFields || [];
  }

  ngOnInit(): void {
    this.createForm();
  }
  
  createForm() {
    const group: any = {};
    this.dynamicFields.forEach(field => {
      group[field.name] = [field.value || '', field.validators || []]; // Use FormBuilder to set default value and validators
    });
    this.formGroup = this.fb.group(group);
  }

  closeDialog(): void {
    this.dialogRef.close(); 
  }

  executeEvent(): void {
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    } else {
      // Handle form validation errors if needed
    }
  }

 
}
