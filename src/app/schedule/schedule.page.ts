// schedule.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { addIcons } from 'ionicons';
import {
  IonAccordion,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonItem,
  IonLabel,
  IonContent,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonAccordionGroup,
  IonRefresher,
  IonRefresherContent,
  IonIcon,
} from '@ionic/angular/standalone';
import { calendar } from 'ionicons/icons';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonAccordion,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonItem,
    IonLabel,
    IonContent,
    IonToolbar,
    IonAccordionGroup,
    IonHeader,
    IonTitle,
    IonRefresher,
    IonRefresherContent,
    TimelineModule,
    ButtonModule,
    CardModule,
    IonIcon,
  ],
})
export class SchedulePage implements OnInit {
  schedule: any[] = [];
  currentDay: string;
  tocSchedule: any[] = [];
  finalSchedule: any[] = [];

  constructor(private scheduleService: ApiService) {
    this.currentDay = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
    });
    addIcons({ calendar });
  }

  ngOnInit(): void {
    this.getSchedule();
    // this.getTocSchedule();
  }

  async handleRefresh(event: any) {
    try {
      await this.getSchedule();
    } finally {
      event.target.complete();
    }
  }
  async getSchedule() {
    try {
      const scheduleData = await this.scheduleService.getSchedule();
      const tocData = await this.scheduleService.getTocSettings();

      this.schedule = scheduleData.filter((s: any) => s.is_live == true);
      this.tocSchedule = tocData.filter((t: any) => t.is_live == true);

      this.finalSchedule = this.schedule.map((sched: any) => {
        const matchingToc = this.tocSchedule.filter(
          (toc: any) => toc.day_date === sched.day
        );

        // Merge games from tocSchedule
        const mergedGames = [...sched.games];

        matchingToc.forEach((toc: any) => {
          mergedGames.push({
            gameType: toc.gameType,
            limit: toc.buy_in,
            description: toc.description,
            seats: toc.seats,
          });
        });

        return {
          ...sched,
          games: mergedGames,
        };
      });

      console.log(this.finalSchedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  }

  // async getSchedule() {
  //   try {
  //     const data = await this.scheduleService.getSchedule();
  //     this.schedule = data.filter((schedule: any) => schedule.is_live == true);
  //     console.log(this.schedule);
  //   } catch (error) {
  //     console.error('Error fetching schedule:', error);
  //   }
  // }

  // async getTocSchedule() {
  //   try {
  //     const data = await this.scheduleService.getTocSettings();
  //     this.tocSchedule = data.filter(
  //       (schedule: any) => schedule.is_live == true
  //     );
  //     console.log(this.tocSchedule);
  //   } catch (error) {
  //     console.error('Error fetching schedule:', error);
  //   }
  // }
}
