// import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormsModule,
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import {
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonList,
//   IonLabel,
//   IonInput,
//   IonButton,
//   IonCheckbox,
//   IonItem,
//   IonRadio,
//   IonRefresher,
//   IonRefresherContent,
//   IonRadioGroup,
//   IonCard,
//   IonCardTitle,
//   IonCardContent,
//   IonIcon,
// } from '@ionic/angular/standalone';
// import { addIcons } from 'ionicons';
// import { ApiService } from '../services/api.service';
// import { checkmark } from 'ionicons/icons';

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
//     IonLabel,
//     IonInput,
//     IonButton,
//     IonItem,
//     IonRadio,
//     IonCheckbox,
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     IonRefresher, // Add this
//     IonRefresherContent, // Add this
//     IonRadioGroup,
//     IonCard,
//     IonCardTitle,
//     IonCardContent,
//     IonIcon,
//   ],
//   providers: [ApiService],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
// })
// export class WaitlistPage implements OnInit {
//   waitlistForm: FormGroup;
//   waitlist: any[] = [];
//   errorMessage: string = '';
//   firstUserModal: boolean = false;
//   phoneNumber: string = '';
//   otpCode: string = '';
//   verificationId: any;
//   verificationSent: boolean = false;
//   authMessage: string = '';
//   todayGames: any[] = [];
//   tocSettings: any;
//   tocGame: any;
//   tocSettingsId: any;
//   isCLubOpen: boolean = false;
//   loading: boolean = true;
//   isWaitlistOpen: boolean = false;
//   todaySchedule: any;
//   startTime: any;

//   constructor(private fb: FormBuilder, private waitlistService: ApiService) {
//     this.waitlistForm = this.fb.group({
//       firstName: ['', [Validators.required]],
//       lastInitial: ['', [Validators.required, Validators.maxLength(1)]],
//       phone: [
//         { value: '+1', disabled: false },
//         Validators.compose([
//           Validators.required,
//           Validators.pattern(/^\+1[0-9]{10}$/),
//         ]),
//       ],
//       game: ['cash', Validators.required],
//       toc_day: [''],
//       gameType: ['', Validators.required], // Radio buttons update this field
//       smsUpdates: [false],
//     });
//     addIcons({ checkmark });
//   }

//   ngOnInit(): void {
//     this.loading = true;
//     this.getWaitlist();
//     this.getTodayGames();

//     this.waitlistService.getSchedule().then((response) => {
//       response.forEach((day: any) => {
//         if (
//           day.is_live == true &&
//           day.day ===
//             new Date().toLocaleDateString('en-US', { weekday: 'long' })
//         ) {
//           this.todaySchedule = day;
//           console.log(this.todaySchedule);
//           this.startTime = this.getStartTime(this.todaySchedule.time);
//           this.isCLubOpen = true;
//           if (this.isClubLiveToday(day.day, day.time)) {
//             this.isWaitlistOpen = true;
//           }
//         }
//       });
//       this.loading = false;
//     });
//   }

//   getStartTime(schedule: string) {
//     const [startStr, endStr] = schedule.split('-').map((s) => s.trim());
//     let [timePart, modifier] = startStr.split(/(am|pm)/i);
//     let [hours, minutes] = timePart.split(':');
//     console.log(minutes);
//     return Number(hours) - 1 + ':' + minutes + ' ' + modifier;
//   }

//   isClubLiveToday(dayName: string, timeRange: string): boolean {
//     const now = new Date();
//     const currentTime = new Date(now.getTime());

//     const dayIndexMap: { [key: string]: number } = {
//       Sunday: 0,
//       Monday: 1,
//       Tuesday: 2,
//       Wednesday: 3,
//       Thursday: 4,
//       Friday: 5,
//       Saturday: 6,
//     };

//     const todayIndex = now.getDay(); // 0 = Sunday, 1 = Monday, ...
//     const currentDay = dayIndexMap[dayName];

//     // Time range parsing
//     const [startStr, endStr] = timeRange.split('-').map((s) => s.trim());

//     const to24Hour = (time: string, timeDiff: number): Date => {
//       const date = new Date(now);
//       let [timePart, modifier] = time.split(/(am|pm)/i);
//       let [hours, minutes] = timePart.trim().split(':').map(Number);

//       if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12;
//       if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;

//       date.setHours(hours - timeDiff, minutes, 0, 0);
//       return date;
//     };

//     let startTime = to24Hour(startStr, 1);
//     let endTime = to24Hour(endStr, 2);

//     // If end time is earlier, it means it goes to next day (e.g., 7:00 PM - 4:00 AM)
//     if (endTime <= startTime) {
//       endTime.setDate(endTime.getDate() + 1);
//     }

//     // Adjust start and end dates to match the intended weekday
//     const dayDiff = currentDay - startTime.getDay();
//     startTime.setDate(startTime.getDate() + dayDiff);
//     endTime.setDate(endTime.getDate() + dayDiff);

//     if (currentTime > endTime) {
//       this.startTime = undefined;

//       return false;
//     }

//     return currentTime >= startTime && currentTime <= endTime;
//   }

//   async handleRefresh(event: any) {
//     try {
//       this.waitlistForm.reset({
//         phone: '+1',
//       });
//       this.errorMessage = '';
//       this.firstUserModal = false;
//       this.verificationId = '';
//       this.verificationSent = false;
//       this.authMessage = '';
//       this.todayGames = [];
//       this.waitlist = [];
//       this.isCLubOpen = false;
//       this.isWaitlistOpen = false;
//       this.startTime = '';
//       this.ngOnInit();
//     } finally {
//       event.target.complete();
//     }
//   }
//   async getTodayGames() {
//     this.waitlistService.getSchedule().then((response) => {
//       response.forEach((day: any) => {
//         day.games.forEach((game: { date: string }) => {
//           if (
//             day.day ===
//               new Date().toLocaleDateString('en-US', { weekday: 'long' }) &&
//             day.is_live == true
//           ) {
//             console.log(game);
//             this.todayGames.push(game);
//           }
//         });
//       });
//     });
//   }

//   async getWaitlist() {
//     this.waitlistService.getWaitlist().then((response) => {
//       console.log(response);
//       this.waitlist = response;
//     });
//   }

//   async onSubmit() {
//     this.tocSettingsId = this.waitlistForm.controls['toc_day'].value;

//     if (this.waitlistForm.valid) {
//       const formData = this.waitlistForm.value;
//       console.log(formData);
//       try {
//         const isVerified = await this.waitlistService.checkVerification(
//           formData.phone
//         );
//         if (isVerified) {
//           await this.waitlistService.addToWaitlist(formData);
//           this.waitlistForm.reset();
//           this.waitlistForm.controls['phone'].setValue('+1');
//           this.getWaitlist();
//         } else {
//           this.phoneNumber = this.waitlistForm.controls['phone'].value;
//           this.firstUserModal = true;
//           console.log(this.firstUserModal);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         this.errorMessage = 'An error occurred. Please try again later.';
//       }
//     } else {
//       console.log('Form is invalid');
//     }
//   }

//   phoneNumberChanged() {
//     this.firstUserModal = false;
//   }

//   async sendOTP() {
//     if (!this.phoneNumber.startsWith('+')) {
//       this.authMessage =
//         'Enter phone number with country code (e.g., +15551234567)';
//       return;
//     }

//     console.log(this.phoneNumber);
//     const isSent = await this.waitlistService.sendOtp(this.phoneNumber);
//     if (isSent) {
//       this.verificationSent = true;
//       this.authMessage = 'OTP sent successfully!';
//     }
//   }

//   async verifyOTP() {
//     const formData = this.waitlistForm.value;
//     if (!this.otpCode) {
//       this.authMessage = 'Please enter the OTP.';
//       return;
//     }

//     const isVerified = await this.waitlistService.verifyOtp(
//       this.phoneNumber,
//       this.otpCode
//     );
//     if (isVerified) {
//       await this.waitlistService.saveUser(formData);
//       await this.waitlistService.addToWaitlist(formData);
//       this.authMessage = 'OTP verified! User authenticated.';
//       this.firstUserModal = false;
//       this.waitlistForm.reset();
//       this.waitlistForm.controls['phone'].setValue('+1');
//       this.getWaitlist();
//     } else {
//       this.authMessage = 'Invalid OTP. Please try again.';
//     }
//   }
// }
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
import { ApiService } from '../services/api.service'; // Assuming ApiService is correctly set up
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
    IonRefresher,
    IonRefresherContent,
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
  phoneNumber: string = ''; // For OTP modal
  otpCode: string = '';
  verificationSent: boolean = false;
  authMessage: string = '';

  todayGames: any[] = [];
  // tocSettingsId: any; // Declared but not used beyond logging in original, reassess if needed

  isClubActuallyOpen: boolean = false; // Reflects if club is within its exact operating hours
  loading: boolean = true;
  isWaitlistAcceptingEntries: boolean = false; // Specifically for the waitlist window
  activeOperationalSchedule: any = null; // Stores the schedule entry that is currently "active"
  waitlistDisplayOpenTime: string = ''; // Formatted time for when waitlist (or club) effectively opens for users

  constructor(private fb: FormBuilder, private waitlistService: ApiService) {
    this.waitlistForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastInitial: ['', [Validators.required, Validators.maxLength(1)]],
      phone: [
        '+1', // Default value
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\+1[0-9]{10}$/), // North American E.164 format
        ]),
      ],
      game: ['cash', Validators.required],
      toc_day: [''], // This might need to be linked to available games/tournaments
      gameType: ['', Validators.required],
      smsUpdates: [false],
    });
    addIcons({ checkmark });
  }

  ngOnInit(): void {
    this.loadData();
  }
  getWaitlistForGame(gameType: string): any[] {
    if (!this.waitlist || this.waitlist.length === 0) {
      return [];
    }
    return this.waitlist.filter((entry) => entry.gameType === gameType);
  }
  async loadData(): Promise<void> {
    this.loading = true;
    try {
      await this.getWaitlist();
      const schedules = await this.waitlistService.getSchedule(); // Fetch all schedule data
      this.processClubScheduleAndStatus(schedules);
      if (this.activeOperationalSchedule) {
        // Assuming games are part of the schedule object or fetched based on it
        this.todayGames = this.activeOperationalSchedule.games || [];
      } else {
        this.todayGames = [];
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      this.errorMessage = 'Failed to load data. Please try refreshing.';
    } finally {
      this.loading = false;
    }
  }

  /**
   * Parses a time string (e.g., "7:00 PM") relative to a base calendar date.
   * @param timeStr The time string (e.g., "7:00 PM", "4:00 AM").
   * @param baseDate The calendar Date object for which this time is being set.
   * @param isEndTime Potential next day: If true and parsed hours suggest next day (e.g. open 7pm, end 4am), advances date.
   * @param openingHourForContext If isEndTime is true, this is the 24-hr format opening hour of the schedule period.
   */
  private parseTimeOnDate(
    timeStr: string,
    baseDate: Date,
    isEndTime: boolean = false,
    openingHourForContext?: number
  ): Date {
    const newDate = new Date(baseDate); // Clone to avoid modifying the original baseDate
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);

    if (!match) {
      console.error(`Invalid time string format: ${timeStr}`);
      // Return a clearly invalid date or throw error, depending on desired handling
      return new Date('invalid');
    }

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const modifier = match[3].toUpperCase();

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      // Midnight case (12 AM is 00 hours)
      hours = 0;
    }

    newDate.setHours(hours, minutes, 0, 0);

    // If this is an end time and it's numerically earlier than the start time's hour,
    // it implies the schedule crosses midnight.
    if (
      isEndTime &&
      typeof openingHourForContext === 'number' &&
      hours < openingHourForContext
    ) {
      newDate.setDate(newDate.getDate() + 1);
    }
    return newDate;
  }

  processClubScheduleAndStatus(schedules: any[]): void {
    const now = new Date();
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDayIndex = now.getDay();
    const yesterdayDayIndex = (currentDayIndex - 1 + 7) % 7; // Correctly handles Sunday -> Saturday

    const todayDayName = dayNames[currentDayIndex];
    const yesterdayDayName = dayNames[yesterdayDayIndex];

    let foundActiveSchedule = null;
    let clubOpenDateTime: Date | null = null;
    let clubCloseDateTime: Date | null = null;

    // Rule 4: Check if yesterday's schedule is still active (overnight)
    const yesterdayScheduleData = schedules.find(
      (s) => s.day === yesterdayDayName && s.is_live == true
    );
    if (yesterdayScheduleData) {
      const [startStr, endStr] = yesterdayScheduleData.time
        .split('-')
        .map((s: string) => s.trim());
      const baseDateYesterday = new Date(now);
      baseDateYesterday.setDate(now.getDate() - 1); // Set calendar to yesterday

      const openingHourYesterday =
        parseInt(startStr.split(':')[0], 10) +
        (startStr.toLowerCase().includes('pm') && !startStr.startsWith('12')
          ? 12
          : 0);

      const openTimeYesterday = this.parseTimeOnDate(
        startStr,
        baseDateYesterday
      );
      const closeTimeYesterday = this.parseTimeOnDate(
        endStr,
        baseDateYesterday,
        true,
        openingHourYesterday
      );

      if (now >= openTimeYesterday && now < closeTimeYesterday) {
        foundActiveSchedule = yesterdayScheduleData;
        clubOpenDateTime = openTimeYesterday;
        clubCloseDateTime = closeTimeYesterday;
      }
    }

    // If not active from yesterday, check today's schedule
    if (!foundActiveSchedule) {
      const todayScheduleData = schedules.find(
        (s) => s.day === todayDayName && s.is_live == true
      );

      if (todayScheduleData) {
        const [startStr, endStr] = todayScheduleData.time
          .split('-')
          .map((s: string) => s.trim());
        const baseDateToday = new Date(now); // Calendar is today

        const openingHourToday =
          parseInt(startStr.split(':')[0], 10) +
          (startStr.toLowerCase().includes('pm') && !startStr.startsWith('12')
            ? 12
            : 0);

        const openTimeToday = this.parseTimeOnDate(startStr, baseDateToday);
        const closeTimeToday = this.parseTimeOnDate(
          endStr,
          baseDateToday,
          true,
          openingHourToday
        );

        // Check if 'now' is within today's potential operating window or before it for waitlist purposes
        // We consider this schedule if it's live, even if club isn't open yet, for waitlist calc.
        if (now < closeTimeToday) {
          // Relevant if current time is before it closes today
          foundActiveSchedule = todayScheduleData;
          clubOpenDateTime = openTimeToday;
          clubCloseDateTime = closeTimeToday;
        }
      }
    }

    this.activeOperationalSchedule = foundActiveSchedule;

    if (
      this.activeOperationalSchedule &&
      clubOpenDateTime &&
      clubCloseDateTime
    ) {
      // Rule 3 (is_live) is inherently handled by filtering schedules above.

      this.isClubActuallyOpen =
        now >= clubOpenDateTime && now < clubCloseDateTime;

      // Rule 1: Waitlist opens 1 hour before club open and closes 2 hours before club close.
      const waitlistOpenTime = new Date(
        clubOpenDateTime.getTime() - 1 * 60 * 60 * 1000
      );
      const waitlistCloseTime = new Date(
        clubCloseDateTime.getTime() - 2 * 60 * 60 * 1000
      );

      if (now > waitlistCloseTime) {
        this.isClubActuallyOpen = false;
        this.isWaitlistAcceptingEntries = false;
        this.waitlistDisplayOpenTime = '';
        this.todayGames = []; // Ensure games are cleared if no active schedule
        console.log('No active or upcoming club schedule for today.');
        return;
      }

      this.isWaitlistAcceptingEntries =
        now >= waitlistOpenTime &&
        now < waitlistCloseTime &&
        now < clubCloseDateTime;

      // Display the time the waitlist opens, or club opens if waitlist is already past/not applicable
      this.waitlistDisplayOpenTime = waitlistOpenTime.toLocaleTimeString(
        'en-US',
        {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }
      );

      console.log(
        `Active Schedule: ${this.activeOperationalSchedule.day} ${this.activeOperationalSchedule.time}`
      );
      console.log(
        `Club Actual Open DateTime: ${clubOpenDateTime.toLocaleString()}`
      );
      console.log(
        `Club Actual Close DateTime: ${clubCloseDateTime.toLocaleString()}`
      );
      console.log(
        `Waitlist Window: ${waitlistOpenTime.toLocaleString()} - ${waitlistCloseTime.toLocaleString()}`
      );
      console.log(`Is Club Actually Open Now: ${this.isClubActuallyOpen}`);
      console.log(
        `Is Waitlist Accepting Entries: ${this.isWaitlistAcceptingEntries}`
      );
      console.log(
        `Waitlist/Club Effective Open Display: ${this.waitlistDisplayOpenTime}`
      );
    } else {
      this.isClubActuallyOpen = false;
      this.isWaitlistAcceptingEntries = false;
      this.waitlistDisplayOpenTime = '';
      this.todayGames = []; // Ensure games are cleared if no active schedule
      console.log('No active or upcoming club schedule for today.');
    }
  }

  async getWaitlist() {
    try {
      this.waitlist = await this.waitlistService.getWaitlist();
    } catch (error) {
      console.error('Error fetching waitlist:', error);
      this.errorMessage = 'Could not retrieve waitlist.';
    }
  }

  async handleRefresh(event: any) {
    this.resetComponentState();
    await this.loadData();
    if (event && event.target && event.target.complete) {
      event.target.complete();
    }
  }

  resetComponentState() {
    this.waitlistForm.reset({
      firstName: '',
      lastInitial: '',
      phone: '+1',
      game: 'cash',
      toc_day: '',
      gameType: '',
      smsUpdates: false,
    });
    this.errorMessage = '';
    this.firstUserModal = false;
    this.phoneNumber = '';
    this.otpCode = '';
    this.verificationSent = false;
    this.authMessage = '';
    this.todayGames = [];
    this.waitlist = []; // Keep existing waitlist or clear? User expectation might be to clear.
    this.isClubActuallyOpen = false;
    this.isWaitlistAcceptingEntries = false;
    this.activeOperationalSchedule = null;
    this.waitlistDisplayOpenTime = '';
    this.loading = true; // Will be set to false after loadData completes
  }

  async onSubmit() {
    // this.tocSettingsId = this.waitlistForm.controls['toc_day'].value; // Re-evaluate if tocSettingsId is needed

    if (!this.isWaitlistAcceptingEntries) {
      this.errorMessage =
        'The waitlist is currently closed. Please check opening times.';
      return;
    }

    if (this.waitlistForm.valid) {
      const formData = this.waitlistForm.value;
      console.log('Submitting waitlist form:', formData);
      try {
        const isVerified = await this.waitlistService.checkVerification(
          formData.phone
        );
        if (isVerified) {
          // Consider passing relevant parts of activeOperationalSchedule if needed by backend
          await this.waitlistService.addToWaitlist(formData);
          this.waitlistForm.reset({
            phone: '+1',
            game: 'cash',
            smsUpdates: false,
          }); // Reset with defaults
          this.getWaitlist(); // Refresh displayed waitlist
          this.errorMessage = ''; // Clear any previous error
        } else {
          this.phoneNumber = formData.phone; // Store for OTP modal
          this.firstUserModal = true;
          this.authMessage = ''; // Clear any previous OTP messages
          this.verificationSent = false;
          this.otpCode = '';
        }
      } catch (error) {
        console.error('Error during waitlist submission:', error);
        this.errorMessage =
          'An error occurred while submitting. Please try again.';
      }
    } else {
      this.errorMessage = 'Please correct the errors in the form.';
      this.waitlistForm.markAllAsTouched(); // To show validation messages
      console.log('Form is invalid:', this.waitlistForm.errors);
    }
  }

  phoneNumberChangedInForm() {
    // If user changes phone number in the main form while OTP modal is for a *previous* number
    if (this.firstUserModal) {
      const currentFormPhone = this.waitlistForm.controls['phone'].value;
      if (this.phoneNumber !== currentFormPhone) {
        // Phone number in form is different from the one OTP modal is targeting,
        // implies user is correcting/changing. Reset OTP state.
        this.firstUserModal = false;
        this.authMessage = '';
        this.verificationSent = false;
        this.otpCode = '';
      }
    }
  }

  async sendOTP() {
    // this.phoneNumber is set when firstUserModal becomes true
    if (!this.phoneNumber || !/^\+1[0-9]{10}$/.test(this.phoneNumber)) {
      this.authMessage =
        'Invalid phone number. Use +1 and 10 digits (e.g., +15551234567).';
      return;
    }

    this.authMessage = 'Sending OTP...';
    try {
      const isSent = await this.waitlistService.sendOtp(this.phoneNumber);
      if (isSent) {
        this.verificationSent = true;
        this.authMessage = 'OTP sent successfully!';
      } else {
        this.authMessage = 'Failed to send OTP. Please try again.';
        this.verificationSent = false;
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      this.authMessage =
        'Error sending OTP. Please check connection or try again later.';
      this.verificationSent = false;
    }
  }

  async verifyOTP() {
    // Use this.phoneNumber (from when OTP was requested) and this.otpCode (from modal input)
    // The original formData is needed to add to waitlist after verification
    const originalFormData = {
      ...this.waitlistForm.value,
      phone: this.phoneNumber,
    };

    if (!this.otpCode || this.otpCode.trim().length === 0) {
      this.authMessage = 'Please enter the OTP code.';
      return;
    }

    this.authMessage = 'Verifying OTP...';
    try {
      const isOtpVerified = await this.waitlistService.verifyOtp(
        this.phoneNumber,
        this.otpCode
      );

      if (isOtpVerified) {
        // OTP correct. First, ensure user is saved/marked as verified
        await this.waitlistService.saveUser(originalFormData); // Assuming saveUser takes similar data
        // Then, add to waitlist
        await this.waitlistService.addToWaitlist(originalFormData);

        this.authMessage =
          'Phone verified! You have been added to the waitlist.';
        this.firstUserModal = false; // Close modal
        this.waitlistForm.reset({
          phone: '+1',
          game: 'cash',
          smsUpdates: false,
        }); // Reset main form
        this.getWaitlist(); // Refresh list

        // Clear OTP state
        this.otpCode = '';
        this.verificationSent = false;
        // this.phoneNumber will be set again if a new unverified number is submitted
      } else {
        this.authMessage = 'Invalid OTP. Please try again.';
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      this.authMessage = 'Error verifying OTP. Please try again later.';
    }
  }
}
