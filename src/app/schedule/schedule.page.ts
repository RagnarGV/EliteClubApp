// schedule.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
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
} from '@ionic/angular/standalone';
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
  ],
})
export class SchedulePage implements OnInit {
  schedule: any[] = [];
  currentDay: string;

  constructor(private scheduleService: ApiService) {
    this.currentDay = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
    });
  }

  ngOnInit(): void {
    this.getSchedule();
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
      const data = await this.scheduleService.getSchedule();
      this.schedule = data.filter((schedule: any) => schedule.is_live == true);

      // Wait for view to be initialized
      setTimeout(() => {
        const currentDayIndex = this.schedule.findIndex(
          (day) => day.day.toLowerCase() === this.currentDay.toLowerCase()
        );

        if (currentDayIndex !== -1) {
          const accordionGroup = document.querySelector(
            'ion-accordion-group'
          ) as HTMLIonAccordionGroupElement;
          if (accordionGroup) {
            accordionGroup.value = `day${currentDayIndex}`;
          }
        }
      });
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  }
  toggleAccordion(event: any, index: number) {
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach((item, i) => {
      if (i !== index) {
        item.classList.remove('active');
      }
    });

    event.currentTarget.parentNode.classList.toggle('active');
  }
}
