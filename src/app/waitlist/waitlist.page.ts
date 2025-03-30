import { Component, OnInit } from '@angular/core';
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
    IonSelect,
    IonSelectOption,
    IonIcon,
  ],
  providers: [ApiService],
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
  // phoneNumberPrefix: string = '+1';

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
    this.getWaitlist();
    this.getTodayGames();
    this.waitlistService.getSchedule().then((response) => {
      response.forEach((day: any) => {
        day.games.forEach(() => {
          if (
            day.day ===
              new Date().toLocaleDateString('en-US', { weekday: 'long' }) &&
            day.is_live == true
          ) {
            this.isCLubOpen = true;
          }
        });
      });
    });
  }

  onChangeGame() {
    this.todayGames = [];
    this.waitlist = [];
    if (this.waitlistForm.controls['game'].value === 'toc') {
      console.log(this.waitlistForm.controls['game'].value);
      this.getTocDays();
    } else if (this.waitlistForm.controls['game'].value === 'cash') {
      this.tocSettings = '';
      this.waitlistForm.controls['toc_day'].reset;
      this.getWaitlist();
      this.getTodayGames();
    }
  }

  onTocDaySelect() {
    this.todayGames = [];
    this.waitlist = [];
    console.log(this.waitlistForm.controls['game'].value);
    this.waitlistService
      .getTocSettingsById(this.waitlistForm.controls['toc_day'].value)
      .then((data: any) => {
        this.todayGames.push(data);
      });
    this.getTocWaitlist(this.waitlistForm.controls['toc_day'].value);
  }

  async handleRefresh(event: any) {
    try {
      this.waitlistForm.reset({
        phone: '+1',
        game: 'cash',
      });
      // this.waitlistForm.controls['phone'].setValue('+1');
      this.todayGames = [];
      this.errorMessage = '';
      this.firstUserModal = false;
      this.verificationId = '';
      this.verificationSent = false;
      this.authMessage = '';
      this.todayGames = [];
      this.waitlist = [];
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
  async getWaitlist() {
    this.waitlistService.getWaitlist().then((response) => {
      console.log(response);
      this.waitlist = response;
    });
  }

  async onSubmit() {
    this.tocSettingsId = this.waitlistForm.controls['toc_day'].value;
    if (this.waitlistForm.controls['game'].value == 'cash') {
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
    } else {
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
