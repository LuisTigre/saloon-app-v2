import { Component } from '@angular/core';
import { PagerComponent } from '../../components/pager/pager.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service.service';


@Component({
  selector: 'app-menu-service',
  standalone: true,
  imports: [PagerComponent, CommonModule],
  providers: [AuthService],
  templateUrl: './menu-service.component.html',
  styleUrl: './menu-service.component.scss'
})
export class MenuServiceComponent {

hasRole(role: string): boolean {
  return sessionStorage.getItem("user-role") == role;
}

}
