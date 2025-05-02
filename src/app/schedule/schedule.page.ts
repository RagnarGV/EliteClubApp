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
  finalSchedule: any[] = [];
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
  }

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
      this.schedule = data.filter((schedule: any) => schedule.is_live == true);
      console.log(this.schedule);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  }

  async getTocSchedule() {
    try {
      const data = await this.scheduleService.getTocSettings();
      this.tocSchedule = data.filter(
        (schedule: any) => schedule.is_live == true
      );
      console.log(this.tocSchedule);
      this.loading = false;
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  }
}
