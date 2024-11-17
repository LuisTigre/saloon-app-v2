import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../services/schedule.service';
import { FcalendarComponent } from '../../components/fcalendar/fcalendar.component';
import { TimeslotComponent } from '../../components/timeslot/timeslot.component';
import { PagerComponent } from '../../components/pager/pager.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    PagerComponent,    
    FcalendarComponent,
    TimeslotComponent
  ],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  selectedDate: Date | null = null;
  modalOpen: boolean = false;
  schedule: any;

  constructor(private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.schedule = this.scheduleService.getScheduleData();
  }

  onDateChange(newDate: Date) {
    this.selectedDate = newDate;
  }

  handleModalOpen(): void {
    this.modalOpen = true;
  }

  handleModalClose(): void {
    this.modalOpen = false;
  }

}
