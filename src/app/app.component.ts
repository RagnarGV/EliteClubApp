import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private platform: Platform, private location: Location) {
    this.initializeApp();
  }
  async initializeApp() {
    await this.platform.ready().then(() => {
      App.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          this.location.back();
        } else {
          App.exitApp(); // Exit app if no history
        }
      });
    });
    await SplashScreen.hide();
    Keyboard.setResizeMode({ mode: KeyboardResize.Native });
  }
}
