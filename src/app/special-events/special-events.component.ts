import { Component, OnInit } from '@angular/core';
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
})
export class SpecialEventsComponent implements OnInit {
  specialEvents: any[] = [];
  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getSpecialEvents().then((events) => {
      this.specialEvents = events;
    });
  }
  handleRefresh(event: any) {
    this.apiService.getSpecialEvents().then((events) => {
      this.specialEvents = events;
      event.target.complete();
    });
  }

  async openUrl(url: string) {
    await Browser.open({ url });
  }
}
