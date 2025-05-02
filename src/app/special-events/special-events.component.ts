import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
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
  IonImg,
} from '@ionic/angular/standalone';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-special-events',
  templateUrl: './special-events.component.html',
  styleUrls: ['./special-events.component.scss'],
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
    IonImg,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SpecialEventsComponent implements OnInit {
  specialEvents: any[] = [];
  loading: boolean = true;
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loading = true;
    this.getSpecialEvents();
  }
  handleRefresh(event: any) {
    this.loading = true;
    this.apiService.getSpecialEvents().then((events) => {
      this.specialEvents = events.filter((event: any) => event.is_live == true);
      this.loading = false;
      event.target.complete();
    });
  }

  getSpecialEvents() {
    this.apiService.getSpecialEvents().then((events) => {
      this.specialEvents = events.filter((event: any) => event.is_live == true);
      this.loading = false;
    });
  }

  async openUrl(url: string) {
    await Browser.open({ url });
  }
}
