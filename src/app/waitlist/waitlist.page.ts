// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import {
//   AlertController,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonList,
//   IonCard,
//   IonCardHeader,
//   IonCardTitle,
//   IonLabel,
//   IonInput,
//   IonButton,
//   IonCardContent,
//   IonItem,
// } from '@ionic/angular/standalone';
// import { AngularFireModule } from '@angular/fire/compat';
// import {
//   AngularFireAuth,
//   AngularFireAuthModule,
// } from '@angular/fire/compat/auth';
// import { Auth, PhoneAuthProvider } from '@angular/fire/auth';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth'; // Import auth module
// import { ApiService } from '../services/api.service';

// @Component({
//   selector: 'app-waitlist',
//   templateUrl: './waitlist.page.html',
//   styleUrls: ['./waitlist.page.scss'],
//   standalone: true,
//   imports: [
//     IonHeader,
//     IonTitle,
//     IonToolbar,
//     IonContent,
//     IonList,
//     IonCard,
//     IonCardHeader,
//     IonCardTitle,
//     IonLabel,
//     IonInput,
//     IonButton,
//     IonCardContent,
//     IonItem,
//     CommonModule,
//     FormsModule,
//     AngularFireModule,
//     AngularFireAuthModule,
//   ],
// })
// export class WaitlistPage implements OnInit {
//   waitlist: any[] = [];
//   phoneNumber: string = '';
//   otpCode: string = '';
//   verificationId: any;
//   authMessage: string = '';
//   recaptchaVerifier: any;
//   error: string = '';
//   verificationSent: any;
//   constructor(
//     private afAuth: AngularFireAuth,
//     private auth: Auth,
//     private apiService: ApiService,
//     private alertCtrl: AlertController
//   ) {}

//   ngOnInit() {
//     this.loadWaitlist();
//   }

//   async loadWaitlist() {
//     try {
//       const response = await this.apiService.getWaitlist();
//       this.waitlist = response.data;
//     } catch (error) {
//       console.error('Error fetching waitlist', error);
//     }
//   }
//   async ionViewDidEnter() {
//     this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//       'recaptcha-container',
//       {
//         size: 'invisible',
//         callback: (response: any) => {
//           console.log('reCAPTCHA solved:', response);
//         },
//         'expired-callback': () => {},
//       }
//     );
//   }
//   ionViewDidLoad() {
//     this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//       'recaptcha-container',
//       {
//         size: 'invisible',
//         callback: (response: any) => {
//           console.log('reCAPTCHA solved:', response);
//         },
//         'expired-callback': () => {},
//       }
//     );
//   }
//   async sendOTP() {
//     if (!this.phoneNumber.startsWith('+')) {
//       this.authMessage =
//         'Enter phone number with country code (e.g., +15551234567)';
//       return;
//     }
//     this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//       'recaptcha-container',
//       {
//         size: 'invisible', // Set to 'normal' instead of 'invisible' for testing
//         callback: (response: any) => {
//           console.log('reCAPTCHA solved:', response);
//         },
//       }
//     );

//     firebase
//       .auth()
//       .signInWithPhoneNumber(this.phoneNumber, this.recaptchaVerifier)
//       .then((confirmationResult) => {
//         this.verificationId = confirmationResult;
//         console.log(confirmationResult);
//         this.verificationSent = true;
//         this.authMessage = 'OTP sent successfully!';
//       })
//       .catch((error) => {
//         this.authMessage = `Error: ${error}`;
//       });
//   }

//   async verifyOTP(): Promise<boolean> {
//     if (!this.verificationId) {
//       console.error('No verification ID found');
//       return false;
//     }

//     try {
//       const credential = firebase.auth.PhoneAuthProvider.credential(
//         this.verificationId,
//         this.otpCode
//       );
//       await firebase.auth().signInWithCredential(credential);
//       console.log('User signed in successfully!');
//       await this.joinWaitlist(this.phoneNumber);
//       return true;
//     } catch (error) {
//       console.error('Error verifying OTP:', error);
//       return false;
//     }
//   }

//   async joinWaitlist(phone: string) {
//     try {
//       const newUser = { name: phone };
//       await this.apiService.joinWaitlist(newUser);
//       this.loadWaitlist();
//       this.showAlert('Success', 'You have joined the waitlist!');
//     } catch (error) {
//       console.error('Error joining waitlist', error);
//       this.showAlert('Error', 'Could not join the waitlist.');
//     }
//   }

//   async showAlert(header: string, message: string) {
//     const alert = await this.alertCtrl.create({
//       header,
//       message,
//       buttons: ['OK'],
//     });
//     await alert.present();
//   }
// }
// waitlist.page.ts
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
  AlertController,
  ModalController,
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
} from '@ionic/angular/standalone';
import { ApiService } from '../services/api.service';
import { AngularFireModule } from '@angular/fire/compat';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import {
  Auth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from '@angular/fire/auth';
import firebase from 'firebase/compat/app';

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
    AngularFireModule,
    AngularFireAuthModule,
    IonRefresher, // Add this
    IonRefresherContent, // Add this
    IonRadioGroup,
  ],
  providers: [ApiService, AngularFireAuth],
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
  recaptchaVerifier: any;
  todayGames: any[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private auth: Auth,
    private fb: FormBuilder,
    private waitlistService: ApiService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
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

  ngOnInit(): void {
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
    } finally {
      event.target.complete();
    }
  }
  async getTodayGames() {
    this.waitlistService.getSchedule().then((response) => {
      response.forEach((day: { day: string; games: any[] }) => {
        day.games.forEach((game: { date: string }) => {
          if (
            day.day ===
            new Date().toLocaleDateString('en-US', { weekday: 'long' })
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
    // this.recaptchaVerifier = new RecaptchaVerifier(
    //   this.auth,
    //   'recaptcha-container'
    // );

    // signInWithPhoneNumber(this.auth, this.phoneNumber, this.recaptchaVerifier)
    //   .then((confirmationResult) => {
    //     this.verificationId = confirmationResult;
    //     console.log(confirmationResult);
    //     this.verificationSent = true;
    //     this.authMessage = 'OTP sent successfully!';
    //   })
    //   .catch((error) => {
    //     this.authMessage = `Error: ${error}`;
    //   });
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

    // const credential = PhoneAuthProvider.credential(
    //   this.verificationId.verificationId,
    //   this.otpCode
    // );

    // firebase
    //   .auth()
    //   .signInWithCredential(credential)
    //   .then(async (userCredential) => {
    //     await this.waitlistService.saveUser(formData);
    //     await this.waitlistService.addToWaitlist(formData);
    //     this.authMessage = 'OTP verified! User authenticated.';
    //     this.firstUserModal = false;
    //     this.waitlistForm.reset();
    //     this.getWaitlist();
    //   })
    //   .catch((error) => {
    //     this.authMessage = `Verification failed: ${error.message}`;
    //   });
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
