import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withPreloading,
} from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';

const firebase = {
  apiKey: 'AIzaSyBCzOwAKe5SMJGN_k-6USQPWx_n7UO5nR8',
  authDomain: 'sms-test-ef960.firebaseapp.com',
  projectId: 'sms-test-ef960',
  storageBucket: 'sms-test-ef960.firebasestorage.app',
  messagingSenderId: '315435137110',
  appId: '1:315435137110:web:8e0d92fda2c55f591363f7',
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideHttpClient(),
    provideAnimations(),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
};
