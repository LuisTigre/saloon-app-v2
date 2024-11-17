import { ChangeDetectionStrategy, inject, Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { EventDialogComponent } from '../event-dialog/event-dialog.component';
import { MenuOptionDialogComponent } from '../menu-option-dialog/menu-option-dialog.component';
import { MatDialog } from '@angular/material/dialog'; 
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable, DropArg } from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fcalendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    EventDialogComponent,
    MenuOptionDialogComponent,
    CommonModule,
    MatMenuModule,
    MatMenuTrigger,
    ReactiveFormsModule    
  ],
  templateUrl: './fcalendar.component.html',
  styleUrls: ['./fcalendar.component.scss']
})
export class FcalendarComponent implements OnInit {

  constructor(private dialog: MatDialog) {}

  clickCount: number = 0;
  clickTimeout: any;

  formGroup!: FormGroup; // Declare formGroup

  @ViewChild(MenuOptionDialogComponent) menuTrigger!: MenuOptionDialogComponent;

  events = [
    { title: 'Active', id: '1' },
  ];

  // This will store the events
  allEvents: EventInput[] = [];
  showDeleteModal = false;
  idToDelete: string | null = null;
  isWeekView: boolean = false;

  calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: [] as EventInput[], // Initially empty
    nowIndicator: true,
    editable: true,
    droppable: true,
    selectable: true,
    dateClick: this.handleEventCreation.bind(this),
    drop: this.addEvent.bind(this),
    eventClick: this.handleEventDoubleClick.bind(this),
    viewDidMount: this.updateView.bind(this),
    datesSet: this.updateView.bind(this)
    
  };

  ngOnInit(): void {

    const calendarElement = document.querySelector('.fc');
  
    if (calendarElement) {
      calendarElement.addEventListener('click', (event) => this.handleEventDoubleClick(event as any));
      calendarElement.addEventListener('touchstart', (event) => this.handleEventDoubleClick(event as any));
    }

    const draggableEl = document.getElementById('draggable-el');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.fc-event',
        eventData: (eventEl: HTMLElement) => {
          const title = eventEl.getAttribute('title');
          const id = eventEl.getAttribute('data');
          const start = eventEl.getAttribute('start');
          return { title, id, start };
        }
      });
    }
  }

  updateView(info: any): void {
    this.isWeekView = info.view.type === 'timeGridWeek';
  }

  // Getter to bind events dynamically
  get calendarEvents() {
    return this.allEvents;
  }

  handleDateClick(): void {
    this.menuTrigger.triggerMenu();
  }

   handleEventDoubleClick(data: { event: { id: string } }) {
    this.clickCount += 1;
  
    // Check if on mobile (using a basic user-agent check)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    console.log(isMobile)
  
    if (this.clickCount === 1) {
      this.clickTimeout = setTimeout(() => {
        this.clickCount = 0;
        this.showFrequencyOptions();
      }, 300); 
    } else if (this.clickCount === 2) {
      this.openDeleteDialog(data);
      clearTimeout(this.clickTimeout);
      this.clickCount = 0;
      this.idToDelete = data.event.id;
    }
  }

  showFrequencyOptions(): void {
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: {
        title: 'Frenquency',
        primary_action: 'Cancel',
        secondary_action: 'Apply',
        dynamicFields: [
          {
            type: 'radio',
            label: '',
            name: 'frequency',
            placeholder: '', // Not applicable for radio
            options: [          
              { value: 'once', label: 'Once' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
              { value: 'allDay', label: 'All Day' },
            ]
          }
        ]
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result (e.g., save event data)
        this.allEvents = [
          ...this.allEvents,
          {
            ...result,
            title: result.title || 'New Event', // Ensure a title is set
            id: new Date().getTime().toString(),
            allDay: result.allDay || false,
          }
        ];
  
        this.calendarOptions.events = this.allEvents; // Rebind events to the calendar
      }
    });

  }

  // fcalendar.component.ts
handleEventSave(arg: { date: Date, allDay: boolean }): void {
  const startDate = new Date(arg.date);
  const endDate = new Date(arg.date);
  endDate.setHours(startDate.getHours() + 1); // Add 1 hour

  // Open the dialog with dynamic input configurations
  const dialogRef = this.dialog.open(EventDialogComponent, {
    data: {
      title: 'New Event',
      primary_action: 'Cancel',
      secondary_action: 'Save',
      dynamicFields: [
        // {
        //   type: 'text',
        //   label: 'Event Title',
        //   name: 'title',
        //   placeholder: 'Enter the event title',
        //   value: 'Active', // Default value
        //   validators: [Validators.required]  // Example validation
        // },        
        {
          type: 'radio',
          label: 'Frequency',
          name: 'frequency',
          placeholder: '', // Not applicable for radio
          options: [          
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'allDay', label: 'All Day' },
            { value: 'none', label: 'One Time' },
          ]
        }
      ]
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Handle the result (e.g., save event data)
      this.allEvents = [
        ...this.allEvents,
        {
          ...result,
          title: result.title || 'New Event', // Ensure a title is set
          id: new Date().getTime().toString(),
          allDay: result.allDay || false,
        }
      ];

      this.calendarOptions.events = this.allEvents; // Rebind events to the calendar
    }
  });
}

  
openDeleteDialog(data: { event: { id: string } }): void {
  this.showDeleteModal = true;
    this.idToDelete = data.event.id;
  // Open the dialog with dynamic input configurations
  const dialogRef = this.dialog.open(EventDialogComponent, {
    data: {
      title: 'Delete  Event ?',
      primary_action: 'No',
      secondary_action: 'Yes',
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
     this.handleDelete();
    }
  });

}

  addEvent(data: DropArg): void {
    const event = {
      title: data.draggedEl.innerText,
      id: new Date().getTime().toString(),
      start: data.date.toISOString(),
      allDay: data.allDay
    };
    this.allEvents = [...this.allEvents, event];
    // Update the calendar options with the new events
    this.calendarOptions.events = this.calendarEvents; // Rebind events
  }

  
  handleEventCreation(arg: { date: Date, allDay: boolean }): void {
 
    const startDate = new Date(arg.date);
    const endDate = new Date(arg.date);
    endDate.setHours(startDate.getHours() + 1); // Add 1 hour
  
    // Open the dialog with dynamic input configurations
    const dialogRef = this.dialog.open(EventDialogComponent, {
      data: {
        title: 'Add  Event ?',
        primary_action: 'No',
        secondary_action: 'Yes',
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const event = {
          title: "Active",
          id: new Date().getTime().toString(),
          start: startDate,
          endDate: endDate,
          allDay: false,
        };
        this.allEvents = [...this.allEvents, event];
        // Update the calendar options with the new events
        this.calendarOptions.events = this.calendarEvents; // Rebind events
      }
    });

  }

  handleDelete(): void {
    this.allEvents = this.allEvents.filter(event => event.id !== this.idToDelete);
    this.showDeleteModal = false;
    this.idToDelete = null;
    // Update the calendar options with the new events
    this.calendarOptions.events = this.calendarEvents; // Rebind events
  }

  handleCloseModal(): void {
    this.showDeleteModal = false;
    this.idToDelete = null;
  }
}
