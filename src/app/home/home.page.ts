// home.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  IonButton,
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
    IonButton,
  ],
})
export class HomePage implements OnInit {
  schedule: Schedule[] = [];
  toc_is_live: boolean = false;
  toc: any;

  constructor(private scheduleService: ApiService, private route: Router) {}

  ngOnInit() {
    this.getSchedule();
    this.getTocSettings();
  }
  getTocSettings() {
    this.scheduleService.getTocSettings().then((toc) => {
      this.toc = toc;
      this.toc_is_live = toc?.[0]?.is_live == 1;
      console.log(this.toc);
    });
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
  goToToc() {
    this.route.navigate(['/toc']);
  }
}
