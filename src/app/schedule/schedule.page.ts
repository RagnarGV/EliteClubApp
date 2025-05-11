// schedule.page.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { addIcons } from 'ionicons';
import {
  IonContent,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { calendar } from 'ionicons/icons';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonRefresher,
    IonRefresherContent,
    TimelineModule,
    ButtonModule,
    CardModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SchedulePage implements OnInit {
  schedule: any[] = [];
  currentDay: string;
  tocSchedule: any[] = [];

  loading: boolean = true;
  isConnected: boolean = true;
  constructor(private scheduleService: ApiService) {
    this.currentDay = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
    });
    addIcons({ calendar });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.getSchedule();
    this.getTocSchedule();
    console.log(this.schedule);
  }
  private weekdayOrder: { [key: string]: number } = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  async handleRefresh(event: any) {
    try {
      await this.getSchedule();
      await this.getTocSchedule();
    } finally {
      event.target.complete();
    }
  }

  async getSchedule() {
    try {
      const data = await this.scheduleService.getSchedule();
      this.schedule = data
        .filter((item: any) => item.is_live == true)
        .sort(
          (a: any, b: any) =>
            this.weekdayOrder[a.day] - this.weekdayOrder[b.day]
        );
      console.log('Sorted Schedule:', this.schedule);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  }

  async getTocSchedule() {
    try {
      const data = await this.scheduleService.getTocSettings();
      this.tocSchedule = data
        .filter((item: any) => item.is_live == true)
        .sort(
          (a: any, b: any) =>
            this.weekdayOrder[a.day_date] - this.weekdayOrder[b.day_date]
        );
      console.log('Sorted TOC Schedule:', this.tocSchedule);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching TOC schedule:', error);
    }
  }
}
