import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Output() toggleMenu = new EventEmitter(); 
  @Output() Subscription = new EventEmitter(); 
  @Input() menu_button: string = "menu";
  @Input() subscribe_form: string = "subscribe";

  isLoggedIn$: Observable<boolean>;

  constructor(public authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$; // Subscribe to observable
  }
  

  handleToggleMenu(): void{                  
    this.toggleMenu.emit();
  }

  handleSubscription(): void{                  
    this.Subscription.emit();
  }

}
