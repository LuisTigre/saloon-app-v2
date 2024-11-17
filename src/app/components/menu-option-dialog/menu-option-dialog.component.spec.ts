import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOptionDialogComponent } from './menu-option-dialog.component';

describe('MenuOptionDialogComponent', () => {
  let component: MenuOptionDialogComponent;
  let fixture: ComponentFixture<MenuOptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuOptionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuOptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
