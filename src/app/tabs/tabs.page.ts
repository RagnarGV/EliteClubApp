// import { Component, EnvironmentInjector, inject } from '@angular/core';
// import {
//   IonTabs,
//   IonTabBar,
//   IonTabButton,
//   IonIcon,
//   IonLabel,
//   IonContent,
// } from '@ionic/angular/standalone';
// import { addIcons } from 'ionicons';
// import { list, calendar, tv, home } from 'ionicons/icons';

// @Component({
//   selector: 'app-tabs',
//   templateUrl: 'tabs.page.html',
//   styleUrls: ['tabs.page.scss'],
//   imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent],
// })
// export class TabsPage {
//   public environmentInjector = inject(EnvironmentInjector);

//   constructor() {
//     addIcons({ list, calendar, tv, home });
//   }
// }
import {
  Component,
  ViewChild,
  AfterViewInit,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonContent,
} from '@ionic/angular/standalone';
import { GestureController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, calendar, tv, home, informationCircle } from 'ionicons/icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent],
})
export class TabsPage implements AfterViewInit {
  public environmentInjector = inject(EnvironmentInjector);
  @ViewChild(IonTabs, { static: true }) tabs!: IonTabs;
  private tabSwipeEnabled = true;
  constructor(private gestureCtrl: GestureController, private router: Router) {
    addIcons({ list, calendar, tv, home, informationCircle });
  }

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: document.querySelector('.tabs-container')!,
      gestureName: 'swipe',
      threshold: 15,
      onStart: () => {
        if (!this.tabSwipeEnabled) {
          return; // Prevent swipe if tab swipe is disabled
        }
      },
      onEnd: (ev) => {
        if (this.tabSwipeEnabled) {
          if (ev.deltaX > 50) {
            this.swipeToTab('prev');
          } else if (ev.deltaX < -50) {
            this.swipeToTab('next');
          }
        }
      },
    });
    gesture.enable();
  }

  swipeToTab(direction: 'prev' | 'next') {
    const tabs = ['home', 'schedule', 'waitlist', 'special-events', 'f&q'];
    const currentTab = this.tabs.getSelected();
    const currentIndex = tabs.indexOf(currentTab!);

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < tabs.length) {
      this.router.navigate(['/tabs/' + tabs[newIndex]]);
    }
  }
  disableTabSwipe() {
    this.tabSwipeEnabled = false;
    console.log(this.tabSwipeEnabled, 'false');
  }

  enableTabSwipe() {
    this.tabSwipeEnabled = true;
    console.log(this.tabSwipeEnabled, 'true');
  }
}
