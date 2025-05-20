// home.page.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  IonButton,
  IonImg,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { calendar, checkmark } from 'ionicons/icons';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { TabsPage } from '../tabs/tabs.page';
import Swiper from 'swiper';

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    IonButton,
    IonImg,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  schedule: any[] = [];
  toc_is_live: boolean = false;
  toc: any;
  toc_count: number = 0;
  loading: boolean = true;
  todayGames: any[] = [];
  waitlist: any;
  gallery: any;
  swiperInstance: Swiper | null = null;
  isClubOpen: boolean = false;
  isConnected: boolean = true;
  isTOCWaitlistOpen: boolean = false;
  startTime: any;
  activeOperationalSchedule: any;
  isWaitlistAcceptingEntries: boolean = false;
  waitlistDisplayOpenTime: string = '';
  errorMessage: string = '';
  nextGame: any;
  constructor(
    private scheduleService: ApiService,
    private route: Router,
    private Tabs: TabsPage
  ) {
    addIcons({ checkmark, calendar });
  }

  async ngOnInit() {
    this.getSchedule();
    this.getTocSettings();
    this.getTodayGames();
    this.getWaitlist();
    this.getGallery();
    this.loadData();
  }

  async handleRefresh(event: any) {
    setTimeout(() => {
      location.reload();
    }, 300);
  }
  disableTabSwipe() {
    console.log('trigger disable');
    this.Tabs.disableTabSwipe();
  }
  enableTabSwipe() {
    this.Tabs.enableTabSwipe();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      await this.getWaitlist();
      const schedules = await this.scheduleService.getSchedule(); // Fetch all schedule data
      this.processClubScheduleAndStatus(schedules);
      this.nextGame = this.nextGameNight(schedules);
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

  nextGameNight(schedules: any[]) {
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

    // Normalize and sort the schedule by day index
    const sortedSchedules = schedules
      .map((s: any) => ({
        ...s,
        dayIndex: dayNames.indexOf(s.day),
      }))
      .sort((a: any, b: any) => a.dayIndex - b.dayIndex);

    // Find the next live schedule starting from today
    for (let i = 0; i < 7; i++) {
      const dayToCheck = (currentDayIndex + i) % 7;
      const nextSchedule = sortedSchedules.find(
        (s: any) => s.dayIndex === dayToCheck && s.is_live == true
      );
      if (nextSchedule) {
        console.log(nextSchedule.day);
        return nextSchedule.day;
      }
    }

    return null; // No live schedule found
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

      this.isClubOpen = now >= clubOpenDateTime && now < clubCloseDateTime;

      // Rule 1: Waitlist opens 1 hour before club open and closes 2 hours before club close.
      const waitlistOpenTime = new Date(
        clubOpenDateTime.getTime() - 1 * 60 * 60 * 1000
      );
      const waitlistCloseTime = new Date(
        clubCloseDateTime.getTime() - 2 * 60 * 60 * 1000
      );

      if (now > waitlistCloseTime) {
        this.isClubOpen = false;
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
      console.log(`Is Club Actually Open Now: ${this.isClubOpen}`);
      console.log(
        `Is Waitlist Accepting Entries: ${this.isWaitlistAcceptingEntries}`
      );
      console.log(
        `Waitlist/Club Effective Open Display: ${this.waitlistDisplayOpenTime}`
      );
    } else {
      this.isClubOpen = false;
      this.isWaitlistAcceptingEntries = false;
      this.waitlistDisplayOpenTime = '';
      this.todayGames = []; // Ensure games are cleared if no active schedule
      console.log('No active or upcoming club schedule for today.');
    }
  }

  async getTodayGames() {
    this.scheduleService.getSchedule().then((response) => {
      response.forEach(
        (day: { day: string; is_live: boolean; games: any[] }) => {
          if (day.is_live == true) {
            day.games.forEach((game: { date: string }) => {
              if (
                day.day ===
                new Date().toLocaleDateString('en-US', { weekday: 'long' })
              ) {
                this.todayGames.push(game);
                this.isClubOpen = true;
              }
            });
          }
        }
      );
    });
  }

  async getWaitlist() {
    this.scheduleService.getWaitlist().then((response) => {
      console.log(response);
      this.waitlist = response;
    });
  }

  async getGallery() {
    this.scheduleService.getGalleryItems().then((response) => {
      console.log(response);
      this.gallery = response;
    });
  }

  getTocSettings() {
    this.scheduleService.getTocSettings().then((toc) => {
      this.toc = toc;
      const today = new Date();
      const currentTime = today.getTime(); // in ms
      toc.forEach((day: any) => {
        const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

        if (day.day_date === dayName && day.is_live == true) {
          const clubStartTimeStr = day.time;
          // e.g., "7:00 pm"
          this.isClubOpen = true;
          this.toc = day;
          this.toc_count++;
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
            this.toc_is_live = true;
          } else if (currentTime > preRegEndTime.getTime()) {
            this.startTime = undefined;
          }
        }
      });

      console.log(this.toc_count);
    });
  }
  getStartTime(schedule: string) {
    let [timePart, modifier] = schedule.split(/(am|pm)/i);
    let [hours, minutes] = timePart.split(':');
    console.log(hours);
    return Number(hours) - 2 + ':' + minutes + ' ' + modifier;
  }
  getSchedule() {
    this.scheduleService.getSchedule().then(async (schedule) => {
      this.schedule = schedule.filter(
        (schdeule: any) => schdeule.day === this.getCurrentDay()
      );

      this.loading = false;
    });
  }

  getCurrentDay(): string {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date();
    return days[today.getDay()];
  }
  goToToc(id: any) {
    console.log(id);
    this.route.navigate(['/tabs/toc', id]);
  }
}
