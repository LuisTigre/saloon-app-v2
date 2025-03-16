import { Component, OnInit } from '@angular/core';
import { PagerComponent } from '../../components/pager/pager.component';
import { SearchboxComponent } from '../../components/searchbox/searchbox.component';
import { CardComponent } from '../../components/card/card.component';
import { Card } from '../../components/card/card.component';
import { BraidingStylesService } from '../../services/braiding-style.service';
import { AddButtonComponent } from '../../components/svg/add-button/add-button.component';
import { EventDialogComponent } from '../../components/event-dialog/event-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    PagerComponent,
    SearchboxComponent,
    CardComponent,
    AddButtonComponent,
    EventDialogComponent,
  ],
  providers: [BraidingStylesService],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  def_img: string =
    "https://images.unsplash.com/photo-1600456899121-68eda5705257?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JheXxlbnwwfHwwfHx8MA%3D%3D";
  cards: Card[] = [];
  serverIp: string = window.location.hostname || 'localhost';

  constructor(
    private braidingStylesService: BraidingStylesService,
    private dialog: MatDialog,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.updateServiceList();
  }

  updateServiceList(): void {
    this.braidingStylesService.getBraidingStyles().subscribe({
      next: (response: any[]) => {
        console.log('Braiding styles fetched:', response);
        this.cards = response.map((style: any) => ({
          id: style.id,
          img:
            style.images && style.images[0]?.image_url
              ? `http://${this.serverIp}:8000${style.images[0].image_url}`
              : this.def_img,
          title: style.name,
        }));
      },
      error: (error: any) =>
        console.error('Failed to fetch braiding styles:', error),
    });
  }

  openModal(): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: {
        title: 'Create Hairstyle',
        dynamicFields: [
          {
            type: 'text',
            label: 'Name',
            name: 'name',
            placeholder: 'Enter the name',
            value: '',
            // validators: [Validators.required]
          },
          {
            type: 'textarea',
            label: 'Description',
            name: 'description',
            placeholder: 'Describe the hairstyle',
            value: '',
            // validators: [Validators.required]
          },
          {
            type: 'text',
            label: 'Duration',
            name: 'duration',
            placeholder: 'Set the avg time it takes',
            value: '',
            // validators: [Validators.required]
          },
          {
            type: 'text',
            label: 'Price',
            name: 'price',
            placeholder: 'How much it will cost',
            value: '',
            // validators: [Validators.required]
          },
        ],

        buttons: [
          {
            text: 'Create',
            value: false,
            action: () => {
              dialogRef.close();
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

      const { name, description, duration, price } = result;
      this.braidingStylesService
        .createBraindingsStyle(name, description, duration, price)
        .subscribe({
          next: (response: any) => {
            this.toastService.success('Hairstyle created:', response);
            this.updateServiceList();
          },
          error: (response: any) =>
            this.toastService.error('Creation failed:', response),
        });
    });
  }
}
