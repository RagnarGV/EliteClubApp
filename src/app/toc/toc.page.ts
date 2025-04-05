import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonLabel,
  IonButton,
  IonItem,
  IonRefresher,
  IonRefresherContent,
  IonButtons,
  IonIcon,
  IonLoading,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { arrowBackOutline } from 'ionicons/icons';
import { checkmark } from 'ionicons/icons';
@Component({
  selector: 'app-toc',
  templateUrl: './toc.page.html',
  styleUrls: ['./toc.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonList,
    IonLabel,
    IonButton,
    IonItem,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonRefresher,
    IonRefresherContent,
    IonButtons,
    IonIcon,
    IonLoading,
  ],
  providers: [ApiService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TocPage implements OnInit {
  waitlistForm: FormGroup;
  waitlist: any[] = [];
  errorMessage: string = '';
  firstUserModal: boolean = false;
  phoneNumber: string = '';
  otpCode: string = '';
  verificationId: any;
  verificationSent: boolean = false;
  authMessage: string = '';
  recaptchaVerifier: any;
  todayGames: any[] = [];
  allTocDays: any;
  loading: boolean = true;
  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private waitlistService: ApiService
  ) {
    addIcons({ arrowBackOutline, checkmark });
    this.waitlistForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastInitial: ['', [Validators.required, Validators.maxLength(1)]],
      phone: [
        { value: '+1', disabled: false },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\+1[0-9]{10}$/),
        ]),
      ],
      gameType: ['', Validators.required], // Radio buttons update this field
      smsUpdates: [false],
    });
  }
  goBack() {
    this.navCtrl.back();
  }
  ngOnInit(): void {
    this.loading = true;
    this.getWaitlist();
    this.getAllTocDays();
    // this.getTodayGames();
  }

  async handleRefresh(event: any) {
    try {
      await this.getWaitlist();
      await this.getAllTocDays();
      this.waitlistForm.reset();
      this.waitlistForm.controls['phone'].setValue('+1');
      this.todayGames = [];
      this.errorMessage = '';
      this.firstUserModal = false;
      this.verificationId = '';
      this.verificationSent = false;
      this.authMessage = '';
    } finally {
      event.target.complete();
    }
  }
  // async getTodayGames() {
  //   this.waitlistService.getTocSettingsById(this.id).then((response) => {
  //     console.log(response.gameType);
  //     this.todayGames.push(response);
  //   });
  // }
  async getWaitlist() {
    this.waitlistService.getAllTOC().then((response) => {
      console.log(response);
      this.waitlist = response;
    });
  }

  async getAllTocDays() {
    this.waitlistService.getTocSettings().then((response) => {
      console.log(response);
      this.allTocDays = response.filter((days: any) => days.is_live == true);
      this.loading = false;
    });
  }
}
