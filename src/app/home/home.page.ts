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
import { LoadingController } from '@ionic/angular';
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
  schedule: any[] = [];
  toc_is_live: boolean = false;
  toc: any;
  toc_count: number = 0;
  loading: boolean = true;
  constructor(private scheduleService: ApiService, private route: Router) {}

  async ngOnInit() {
    this.loading = true;
    this.getSchedule();
    this.getTocSettings();
  }
  getTocSettings() {
    this.scheduleService.getTocSettings().then((toc) => {
      this.toc = toc;
      toc.forEach((element: any) => {
        if (element.is_live == true) {
          this.toc_count++;
        }
      });

      this.toc_is_live = toc?.[0]?.is_live == 1;
      console.log(this.toc_count);
    });
  }
  getSchedule() {
    this.scheduleService.getSchedule().then(async (schedule) => {
      this.schedule = schedule;
      this.loading = false;
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
  goToToc(id: any) {
    console.log(id);
    this.route.navigate(['/tabs/toc', id]);
  }
}
