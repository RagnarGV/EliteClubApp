// home.page.ts
import { Component, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { ApiService, Schedule } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class HomePage implements OnInit {
  schedule: Schedule[] = [];

  constructor(private scheduleService: ApiService) {}

  ngOnInit() {
    this.getSchedule();
  }

  getSchedule() {
    this.scheduleService.getSchedule().then((schedule) => {
      this.schedule = schedule;
    });
  }

  async handleRefresh(event: any) {
    try {
      this.getSchedule();
    } finally {
      event.target.complete();
    }
  }

  getCurrentDay(): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date();
    return days[today.getDay()];
  }
}
