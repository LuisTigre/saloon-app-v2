import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'  
})
export class SidebarComponent {
  @Input() open!: boolean;
  isLoggedIn$: Observable<boolean>;

  constructor(public authService: AuthService, private toastService: ToastrService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$; // Subscribe to observable
  }

  handleLogout(): void {
    this.authService.logout();
    this.toastService.info('User logged out successfully'); 
  }
}