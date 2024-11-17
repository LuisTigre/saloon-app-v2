import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private scheduleData = {
    "adminId": "12345",
    "weeklySchedule": [ 
      {
        period: { start:"2024-12-01", end:"2024-12-31"}, 
        active: true,
        default: false,
        data:[
          {
            "available": false,
            "timeSlots": [],
            "weekname": "Sunday"
          },
          {
            "available": true,
            "timeSlots": [
              {
                "startTime": "09:00",
                "endTime": "17:00"
              }
            ],
            "weekname": "Monday"
          },
          {
            "available": true,
            "timeSlots": [
              {
                "startTime": "10:00",
                "endTime": "18:00"
              }
            ],
            "weekname": "Tuesday"
          },
          {
            "available": true,
            "timeSlots": [
              {
                "startTime": "09:00",
                "endTime": "17:00"
              }
            ],
            "weekname": "Wednesday"
          },
          {
            "available": true,
            "timeSlots": [],
            "weekname": "Thursday"
          },
          {
            "available": true,
            "timeSlots": [
              {
                "startTime": "09:00",
                "endTime": "17:00"
              }
            ],
            "weekname": "Friday"
          },
          {
            "available": false,
            "timeSlots": [],
            "weekname": "Saturday"
          }
        ]
      },{
        period: null, 
        active: true,
        default: true,
        data:[
          {
            "available": false,
            "timeSlots": [],
            "weekname": "Sunday"
          },
          {
            "available": true,
            "timeSlots": [
              {
                "startTime": "09:00",
                "endTime": "17:00"
              }
            ],
            "weekname": "Monday"
          },
          {
            "available": true,
            "timeSlots": [
              {
                "startTime": "10:00",
                "endTime": "18:00"
              }
            ],
            "weekname": "Tuesday"
          },
          {
            "available": true,
            "timeSlots": [
              {
                "startTime": "09:00",
                "endTime": "17:00"
              }
            ],
            "weekname": "Wednesday"
          },
          {
            "available": true,
            "timeSlots": [],
            "weekname": "Thursday"
          },
          {
            "available": true,
            "timeSlots": [
              {
                "startTime": "09:00",
                "endTime": "17:00"
              }
            ],
            "weekname": "Friday"
          },
          {
            "available": false,
            "timeSlots": [],
            "weekname": "Saturday"
          }
        ]
      },
    ],
    "exceptions": {
      "unavailableDays": [
        {
          "date": "2024-09-25",
          "available": false,
          "note": "Holiday - Closed"
        }
      ],
      "specialEvents": [
        {
          "date": "2024-09-26",
          "available": true,
          "timeSlots": [
            {
              "startTime": "11:00",
              "endTime": "15:00"
            }
          ],
          "note": "Special Event"
        }
      ]
    },
    "events":[
      {
        title: '',
        start: '2024-10-10',
        allDay: true, // This marks the event as a full-day event.
        rendering: 'background', // This makes it appear as a background event.
        color: '#d3d3d3', // Customize the color to gray to indicate unavailability.
        classNames: ['fc-day-unavailable']
      },
      {
        title: '',
        start: '2024-10-08',
        allDay: true, // This marks the event as a full-day event.
        rendering: 'background', // This makes it appear as a background event.
        color: '#d3d3d3', // Customize the color to gray to indicate unavailability.
        classNames: ['fc-day-unavailable']
      },
      {
        title: '',
        start: '2024-10-23',
        allDay: true, // This marks the event as a full-day event.
        rendering: 'background', // This makes it appear as a background event.
        color: '#d3d3d3', // Customize the color to gray to indicate unavailability.
        classNames: ['fc-day-unavailable']
      },
      {
        title: 'Meeting',
        start: '2024-10-05T10:00:00',
        end: '2024-10-05T14:00:00'
      },
      {
        title: 'Conference',
        start: '2024-10-11T13:00:00',
        end: '2024-10-11T15:00:00'
      },
      {
        title: 'Lunch',
        start: '2024-10-07T12:00:00',
        end: '2024-10-07T13:00:00'
      }
    ],

    "unavailableDays" : [new Date(2024, 10, 10), new Date(2024, 10, 15)]
  }

  constructor() { }

  getScheduleData() {
    return this.scheduleData;
  }
}
