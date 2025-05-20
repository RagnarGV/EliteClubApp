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
  faqs = [
    {
      id: '1',
      question: 'When does the club open?',
      answer: 'Check the club schedule for this week’s timings.',
    },
    {
      id: '2',
      question: 'When does the cash waitlist open?',
      answer: 'The cash waitlist usually opens 1 hour before the club opens.',
    },
    {
      id: '3',
      question: 'When does the pre-registration list for tournaments open?',
      answer:
        'The pre-registration for tournament waitlist usually opens 2 hours before the club’s scheduled opening time.',
    },
    {
      id: '4',
      question: 'How much time do I have before I’m removed from the waitlist?',
      answer:
        'You have 1 hour to check in at the club before you are removed from the waitlist.',
    },
  ];

  ngOnInit() {
    this.loading = false;
  }
}
