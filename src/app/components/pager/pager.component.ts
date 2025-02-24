import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { AuthService } from '../../services/auth-service.service';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';
import { LoginResponse } from '../../types/login-response.type';
import { ToastrService } from 'ngx-toastr';


interface LoginForm {
  email: FormControl,
  password: FormControl
}

@Component({
  selector: 'app-pager',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
  ],
  templateUrl: './pager.component.html',
  styleUrl: './pager.component.scss'
})
export class PagerComponent {

  constructor(
    private dialog: MatDialog, 
    private authService: AuthService,    
    private toastService: ToastrService
  ) {}
  
  open!: boolean; 
  menu_button = "menu";
  register: boolean = false;
  errorMessage: string = '';
  account_button_click_count: number = 0;

  handleToggleMenu(): void{
    this.open = this.open == false ? true : false;
    if(this.open){
      this.menu_button = "menu_open"
    }else{
      this.menu_button = "menu"
    }
  }

openSubscriptionDialog(): void {
  
  const dialogRef = this.dialog.open(EventDialogComponent, {
    
    data: {
      title: this.register == true? 'New Account':'Login',
      buttons: [
        { 
          text: this.register == true ? 'Create':'Login',
          value: true,
          action: () => {
            
            const formGroup = dialogRef.componentInstance.formGroup;
            if (formGroup.valid) {
              dialogRef.close({ ...formGroup.value, register: false });
            }
          }
        },
        { 
          text: this.register == true  ? 'Back to Login' : 'Create Account', 
          value: false,
          action: () => {
            
              this.register == false ? this.register = true : this.register = false;               
           
            dialogRef.close();
            this.openSubscriptionDialog();            
            const formGroup = dialogRef.componentInstance.formGroup;
            if (formGroup.valid) {
              dialogRef.close({ ...formGroup.value, register: true });
            }
          }
        },
      ],
      dynamicFields: this.getDynamicFields()
    }
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    console.log('Dialog result:', result);
    if (!result) {
      console.log('Dialog was closed without submission.');
      return;
    }

    const { email, name, password, password_confirmation } = result;
    if (this.register) {
      this.authService.signup(name, email, password, password_confirmation, 'client').subscribe({
        next: (response: any) => this.toastService.success('User registered:', response),
        error: (response: any) => this.toastService.error('Signup failed:', response),
      });
    } else {
      this.authService.login(email, password).subscribe({
        next: () => this.toastService.success('User logged in:'),
        error: () => this.toastService.error('Login failed:')
      });
    }
  });
}


getDynamicFields(): any {  

  if (this.register) { 
    return [      
      { 
        type: 'text',
        label: 'Name',
        name: 'name',
        placeholder: 'Enter your name',
        value: '',
        validators: [Validators.required]
      },
      {
        type: 'email',
        label: 'Email',
        name: 'email',
        placeholder: 'Enter your email',
        value: '',
        validators: [Validators.required]
      },
      {
        type: 'password',
        label: 'Password',
        name: 'password',
        placeholder: 'Enter your password',
        value: '',
        validators: [Validators.required]
      },
      {
        type: 'password',
        label: 'Password Confirmation',
        name: 'password_confirmation',
        placeholder: 'Repeate your password',
        value: '',
        validators: [Validators.required]
      },
    ];
  }
    return [
      {
        type: 'email',
        label: 'Email',
        name: 'email',
        placeholder: 'Enter your email',
        value: '',
        validators: [Validators.required]
      },
      {
        type: 'password',
        label: 'Password',
        name: 'password',
        placeholder: 'Enter your password',
        value: '',
        validators: [Validators.required]
      },
      
    ];
}


}


