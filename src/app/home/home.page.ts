// home.page.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
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
  IonImg,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { checkmark } from 'ionicons/icons';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { TabsPage } from '../tabs/tabs.page';

import Swiper from 'swiper';

register();
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
    IonImg,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  schedule: any[] = [];
  toc_is_live: boolean = false;
  toc: any;
  toc_count: number = 0;
  loading: boolean = true;
  todayGames: any[] = [];
  waitlist: any;
  gallery: any;
  swiperInstance: Swiper | null = null;
  isClubOpen: boolean = false;
  isConnected: boolean = true;
  constructor(
    private scheduleService: ApiService,
    private route: Router,
    private Tabs: TabsPage
  ) {
    addIcons({ checkmark });
  }

  async ngOnInit() {
    this.getSchedule();
    this.getTocSettings();
    this.getTodayGames();
    this.getWaitlist();
    this.getGallery();
  }

  async handleRefresh(event: any) {
    try {
      this.getSchedule();
    } finally {
      event.target.complete();
    }
  }
  disableTabSwipe() {
    console.log('trigger disable');
    this.Tabs.disableTabSwipe();
  }
  enableTabSwipe() {
    this.Tabs.enableTabSwipe();
  }
  async getTodayGames() {
    this.scheduleService.getSchedule().then((response) => {
      response.forEach(
        (day: { day: string; is_live: boolean; games: any[] }) => {
          if (day.is_live == true) {
            day.games.forEach((game: { date: string }) => {
              if (
                day.day ===
                new Date().toLocaleDateString('en-US', { weekday: 'long' })
              ) {
                this.todayGames.push(game);
                this.isClubOpen = true;
              }
            });
          }
        }
      );
    });
  }

  async getWaitlist() {
    this.scheduleService.getWaitlist().then((response) => {
      console.log(response);
      this.waitlist = response;
    });
  }

  async getGallery() {
    this.scheduleService.getGalleryItems().then((response) => {
      console.log(response);
      this.gallery = response;
    });
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
      this.schedule = schedule.filter(
        (schdeule: any) => schdeule.day === this.getCurrentDay()
      );

      this.loading = false;
    });
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
