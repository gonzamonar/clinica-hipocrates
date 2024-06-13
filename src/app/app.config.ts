import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideClientHydration(), 
    provideRouter(routes), 
    provideFirebaseApp(
      () => initializeApp({
      "projectId":"clinica-hipocrates",
      "appId":"1:697040935622:web:8c225770fe8509bdf2d5c7",
      "storageBucket":"clinica-hipocrates.appspot.com",
      "apiKey":"AIzaSyC4I8Wt8sqQ244zOHozDImz7KPqiV9wOBY",
      "authDomain":"clinica-hipocrates.firebaseapp.com",
      "messagingSenderId":"697040935622"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideAnimations()
  ]
};

