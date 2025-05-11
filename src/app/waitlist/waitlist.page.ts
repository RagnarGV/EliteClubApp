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
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ApiService } from '../services/api.service';
import { checkmark } from 'ionicons/icons';

@Component({
  selector: 'app-waitlist',
  templateUrl: './waitlist.page.html',
  styleUrls: ['./waitlist.page.scss'],
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
export class WaitlistPage implements OnInit {
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
  todaySchedule: any;
  startTime: any;

  constructor(private fb: FormBuilder, private waitlistService: ApiService) {
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
      game: ['cash', Validators.required],
      toc_day: [''],
      gameType: ['', Validators.required], // Radio buttons update this field
      smsUpdates: [false],
    });
    addIcons({ checkmark });
  }

  ngOnInit(): void {
    this.loading = true;
    this.getWaitlist();
    this.getTodayGames();

    this.waitlistService.getSchedule().then((response) => {
      response.forEach((day: any) => {
        if (
          day.is_live == true &&
          day.day ===
            new Date().toLocaleDateString('en-US', { weekday: 'long' })
        ) {
          this.todaySchedule = day;
          console.log(this.todaySchedule);
          this.startTime = this.getStartTime(this.todaySchedule.time);
          this.isCLubOpen = true;
          if (this.isClubLiveToday(day.day, day.time)) {
            this.isWaitlistOpen = true;
          }
        }
      });
      this.loading = false;
    });
  }

  getStartTime(schedule: string) {
    const [startStr, endStr] = schedule.split('-').map((s) => s.trim());
    let [timePart, modifier] = startStr.split(/(am|pm)/i);
    let [hours, minutes] = timePart.split(':');
    console.log(minutes);
    return Number(hours) - 1 + ':' + minutes + ' ' + modifier;
  }

  isClubLiveToday(dayName: string, timeRange: string): boolean {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    const dayIndexMap: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const todayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ...
    const currentDay = dayIndexMap[dayName];

    // Time range parsing
    const [startStr, endStr] = timeRange.split('-').map((s) => s.trim());

    const to24Hour = (time: string): Date => {
      const date = new Date(now);
      let [timePart, modifier] = time.split(/(am|pm)/i);
      let [hours, minutes] = timePart.trim().split(':').map(Number);

      if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
      if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;

      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    let startTime = to24Hour(startStr);
    let endTime = to24Hour(endStr);

    // If end time is earlier, it means it goes to next day (e.g., 7:00 PM - 4:00 AM)
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    // Adjust start and end dates to match the intended weekday
    const dayDiff = currentDay - startTime.getDay();
    startTime.setDate(startTime.getDate() + dayDiff);
    endTime.setDate(endTime.getDate() + dayDiff);

    return oneHourLater >= startTime && oneHourLater <= endTime;
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
    this.waitlistService.getSchedule().then((response) => {
      response.forEach((day: any) => {
        day.games.forEach((game: { date: string }) => {
          if (
            day.day ===
              new Date().toLocaleDateString('en-US', { weekday: 'long' }) &&
            day.is_live == true
          ) {
            console.log(game);
            this.todayGames.push(game);
          }
        });
      });
    });
  }

  async getWaitlist() {
    this.waitlistService.getWaitlist().then((response) => {
      console.log(response);
      this.waitlist = response;
    });
  }

  async onSubmit() {
    this.tocSettingsId = this.waitlistForm.controls['toc_day'].value;

    if (this.waitlistForm.valid) {
      const formData = this.waitlistForm.value;
      console.log(formData);
      try {
        const isVerified = await this.waitlistService.checkVerification(
          formData.phone
        );
        if (isVerified) {
          await this.waitlistService.addToWaitlist(formData);
          this.waitlistForm.reset();
          this.waitlistForm.controls['phone'].setValue('+1');
          this.getWaitlist();
        } else {
          this.phoneNumber = this.waitlistForm.controls['phone'].value;
          this.firstUserModal = true;
          console.log(this.firstUserModal);
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
      await this.waitlistService.addToWaitlist(formData);
      this.authMessage = 'OTP verified! User authenticated.';
      this.firstUserModal = false;
      this.waitlistForm.reset();
      this.waitlistForm.controls['phone'].setValue('+1');
      this.getWaitlist();
    } else {
      this.authMessage = 'Invalid OTP. Please try again.';
    }
  }
}
