import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-fandq',
  templateUrl: './fandq.page.html',
  styleUrls: ['./fandq.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonAccordion,
    IonAccordionGroup,
    IonItem,
    IonLabel,
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FANDQPage implements OnInit {
  loading: boolean = true;
  constructor() {}

  ngOnInit() {
    this.loading = false;
  }
}
