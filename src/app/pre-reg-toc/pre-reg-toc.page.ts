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
  IonInput,
  IonButton,
  IonCheckbox,
  IonItem,
  IonRadio,
  IonRefresher,
  IonRefresherContent,
  IonRadioGroup,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ApiService } from '../services/api.service';
import { checkmark } from 'ionicons/icons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pre-reg-toc',
  templateUrl: './pre-reg-toc.page.html',
  styleUrls: ['./pre-reg-toc.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonTitle,
    IonToolbar,
    IonContent,
    IonList,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonItem,
    IonRadio,
    IonCheckbox,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonRefresher, // Add this
    IonRefresherContent, // Add this
    IonRadioGroup,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonIcon,
  ],
  providers: [ApiService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PreRegTOCPage implements OnInit {
  waitlistForm: FormGroup;
  waitlist: any[] = [];
  errorMessage: string = '';
  firstUserModal: boolean = false;
  phoneNumber: string = '';
  otpCode: string = '';
  verificationId: any;
  verificationSent: boolean = false;
  authMessage: string = '';
  todayGames: any[] = [];
  tocSettings: any;
  tocGame: any;
  tocSettingsId: any;
  isCLubOpen: boolean = false;
  loading: boolean = true;
  isWaitlistOpen: boolean = false;
  startTime: any;
  // phoneNumberPrefix: string = '+1';

  constructor(
    private fb: FormBuilder,
    private waitlistService: ApiService,
    private navCtrl: NavController
  ) {
    addIcons({ arrowBackOutline });
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
      game: ['toc', Validators.required],
      toc_day: [''],
      gameType: ['', Validators.required], // Radio buttons update this field
      smsUpdates: [false],
    });
    addIcons({ checkmark });
  }

  ngOnInit(): void {
    this.loading = true;
    this.getTodayGames();

    const today = new Date();
    const currentTime = today.getTime(); // in ms

    this.waitlistService.getTocSettings().then((response) => {
      response.forEach((day: any) => {
        const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

        if (day.day_date === dayName && day.is_live == true) {
          const clubStartTimeStr = day.time;
          // e.g., "7:00 pm"
          this.isCLubOpen = true;
          // Parse time string to Date
          const clubStartDateTime = new Date();
          const preRegEndTime = new Date();
          const [time, modifier] = clubStartTimeStr.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
          if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
          clubStartDateTime.setHours(hours - 2, minutes, 0, 0); // 2 hours before
          preRegEndTime.setHours(hours + 2, minutes, 0, 0); // 2 hours after

          this.startTime = this.getStartTime(clubStartTimeStr);

          // Compare

          if (
            currentTime >= clubStartDateTime.getTime() &&
            currentTime <= preRegEndTime.getTime()
          ) {
            this.isWaitlistOpen = true;
          } else if (currentTime > preRegEndTime.getTime()) {
            this.startTime = undefined;
          }
        }
        this.loading = false;
      });
    });

    this.getTocDays();
  }

  getStartTime(schedule: string) {
    let [timePart, modifier] = schedule.split(/(am|pm)/i);
    let [hours, minutes] = timePart.split(':');
    console.log(hours);
    return Number(hours) - 2 + ':' + minutes + ' ' + modifier;
  }

  goBack() {
    this.navCtrl.back();
  }

  async handleRefresh(event: any) {
    try {
      this.waitlistForm.reset({
        phone: '+1',
      });

      this.errorMessage = '';
      this.firstUserModal = false;
      this.verificationId = '';
      this.verificationSent = false;
      this.authMessage = '';
      this.todayGames = [];
      this.waitlist = [];
      this.isCLubOpen = false;
      this.isWaitlistOpen = false;
      this.startTime = '';
      this.ngOnInit();
    } finally {
      event.target.complete();
    }
  }
  async getTodayGames() {
    this.waitlistService.getTocSettings().then((response) => {
      response.forEach((day: any) => {
        if (
          day.day_date ===
            new Date().toLocaleDateString('en-US', { weekday: 'long' }) &&
          day.is_live == true
        ) {
          this.tocSettingsId = day.id;
          this.todayGames.push(day);
          this.getTocWaitlist(this.tocSettingsId);
        }
      });
    });
  }

  async getTocDays() {
    this.waitlistService.getTocSettings().then((response) => {
      this.tocSettings = response.filter((x: any) => x.is_live == true);
      console.log(this.tocSettings);
    });
  }
  async getTocWaitlist(id: any) {
    this.waitlistService.getTOC(id).then((response) => {
      console.log(response);
      this.waitlist = response;
    });
  }

  async onSubmit() {
    if (this.waitlistForm.valid) {
      const formData = this.waitlistForm.value;

      console.log(formData);
      try {
        const isVerified = await this.waitlistService.checkVerification(
          formData.phone
        );
        if (isVerified) {
          await this.waitlistService.addToTOCWaitlist(
            this.tocSettingsId,
            formData
          );
          this.waitlistForm.reset();
          this.waitlistForm.controls['phone'].setValue('+1');
          this.getTocWaitlist(this.tocSettingsId);
        } else {
          this.phoneNumber = this.waitlistForm.controls['phone'].value;
          this.firstUserModal = true;
        }
      } catch (error) {
        console.error('Error:', error);
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    } else {
      console.log('Form is invalid');
    }
  }

  phoneNumberChanged() {
    this.firstUserModal = false;
  }

  async sendOTP() {
    if (!this.phoneNumber.startsWith('+')) {
      this.authMessage =
        'Enter phone number with country code (e.g., +15551234567)';
      return;
    }

    console.log(this.phoneNumber);
    const isSent = await this.waitlistService.sendOtp(this.phoneNumber);
    if (isSent) {
      this.verificationSent = true;
      this.authMessage = 'OTP sent successfully!';
    }
  }

  async verifyOTP() {
    const formData = this.waitlistForm.value;
    if (!this.otpCode) {
      this.authMessage = 'Please enter the OTP.';
      return;
    }

    const isVerified = await this.waitlistService.verifyOtp(
      this.phoneNumber,
      this.otpCode
    );
    if (isVerified) {
      await this.waitlistService.saveUser(formData);
      await this.waitlistService.addToTOCWaitlist(this.tocSettingsId, formData);
      this.authMessage = 'OTP verified! User authenticated.';
      this.firstUserModal = false;
      this.waitlistForm.reset();
      this.waitlistForm.controls['phone'].setValue('+1');
    } else {
      this.authMessage = 'Invalid OTP. Please try again.';
    }
  }
}
