import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuServiceComponent } from './menu-service.component';

describe('MenuServiceComponent', () => {
  let component: MenuServiceComponent;
  let fixture: ComponentFixture<MenuServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
