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
  IonButtons,
  IonIcon,
  IonCard,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { arrowBackOutline } from 'ionicons/icons';
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
    IonButtons,
    IonIcon,
    IonCard,
  ],
  providers: [ApiService],
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
  id: any;

  constructor(
    private navCtrl: NavController,
    private _route: ActivatedRoute,
    private fb: FormBuilder,
    private waitlistService: ApiService
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
      gameType: ['', Validators.required], // Radio buttons update this field
      smsUpdates: [false],
    });
  }
  goBack() {
    this.navCtrl.back();
  }
  ngOnInit(): void {
    this._route.params.subscribe((params: any) => (this.id = params['id']));
    // this.id = +!this._route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.getWaitlist();
    this.getTodayGames();
  }

  async handleRefresh(event: any) {
    try {
      await this.getWaitlist();
      await this.getTodayGames();
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
  async getTodayGames() {
    this.waitlistService.getTocSettingsById(this.id).then((response) => {
      console.log(response.gameType);
      this.todayGames.push(response);
    });
  }
  async getWaitlist() {
    this.waitlistService.getTOC(this.id).then((response) => {
      console.log(response);
      this.waitlist = response;
    });
  }
  phoneNumberChanged() {
    this.firstUserModal = false;
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
          await this.waitlistService.addToTOCWaitlist(this.id, formData);
          this.waitlistForm.reset();
          this.waitlistForm.controls['phone'].setValue('+1');
          this.getWaitlist();
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
      await this.waitlistService.addToTOCWaitlist(this.id, formData);
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
